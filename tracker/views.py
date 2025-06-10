from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse_lazy, reverse
from django.views.generic import CreateView, DetailView, ListView, UpdateView, DeleteView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin # Para proteger views
from django.contrib.messages.views import SuccessMessageMixin
from django.views.generic.edit import FormMixin # Importar FormMixin
from .models import LoteDeVinho,AvaliacaoCliente, ScanEvento
from .forms import LoteDeVinhoForm, AvaliacaoClienteForm, SaidaEstoqueForm
from django.contrib import messages
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from datetime import timedelta
import qrcode
from io import BytesIO
import base64
from django.http import Http404 # Importe JsonResponse
from django.db import models



class PaginaInicialVinicolaView(LoginRequiredMixin, ListView):
    model = LoteDeVinho
    template_name = 'tracker/vinicola_home.html'
    context_object_name = 'lotes_recentes'
    paginate_by = 10 # Mostrar 10 lotes por página
    login_url = reverse_lazy('admin:login')# Ou sua URL de login customizada

    def get_queryset(self):
            return LoteDeVinho.objects.order_by('-data_colheita', '-timestamp_criacao')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['lotes_em_alerta'] = LoteDeVinho.objects.filter(
            quantidade_em_estoque__lte=models.F('nivel_alerta_estoque')
        ).exclude(nivel_alerta_estoque__isnull=True)
        context['total_lotes'] = LoteDeVinho.objects.count()
        context['total_garrafas_em_estoque'] = LoteDeVinho.objects.aggregate(total=Sum('quantidade_em_estoque'))['total'] or 0
        return context

class CadastrarLoteView(LoginRequiredMixin, SuccessMessageMixin, CreateView):
    model = LoteDeVinho
    form_class = LoteDeVinhoForm
    template_name = 'tracker/admin_cadastrar_lote.html'
    success_message = "Lote '%(nome_lote)s' cadastrado com sucesso!"
    login_url = '/admin/login/'

    def get_success_url(self):
        return reverse('tracker:mostrar_qr_code', kwargs={'batch_id': self.object.pk})

def mostrar_qr_code_view(request, batch_id):
    # Idealmente, esta view também seria protegida por login
    lote = get_object_or_404(LoteDeVinho, pk=batch_id)
    qr_code_url = request.build_absolute_uri(lote.get_absolute_url())

    img = qrcode.make(qr_code_url)
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    qr_code_data_uri = f"data:image/png;base64,{img_str}"

    return render(request, 'tracker/mostrar_qr_code.html', {
        'lote': lote,
        'qr_code_url': qr_code_url,
        'qr_code_data_uri': qr_code_data_uri
    })

def detalhes_lote_cliente(request, lote_id):
    try:
        lote = get_object_or_404(LoteDeVinho, pk=lote_id)
    except ValueError: # Captura erro se o UUID for inválido
        raise Http404("Lote de vinho não encontrado ou ID inválido.")

    # Recupera todas as avaliações para este lote, ordenadas da mais recente
    avaliacoes = AvaliacaoCliente.objects.filter(lote_vinho=lote).order_by('-data_avaliacao')

    # Calcula a média das estrelas
    media_estrelas = avaliacoes.aggregate(models.Avg('estrelas'))['estrelas__avg']
    if media_estrelas:
        media_estrelas = round(media_estrelas, 1) # Arredonda para uma casa decimal
    else:
        media_estrelas = 'N/A'

    # Lida com a submissão do formulário de avaliação
    if request.method == 'POST':
        form = AvaliacaoClienteForm(request.POST)
        if form.is_valid():
            nova_avaliacao = form.save(commit=False) # Não salva ainda, pois precisamos vincular o lote
            nova_avaliacao.lote_vinho = lote
            nova_avaliacao.save()
            # Redireciona para a mesma página para evitar reenvio do formulário
            return redirect('tracker:detalhes_lote_cliente', lote_id=lote.id)
    else:
        form = AvaliacaoClienteForm() # Cria um formulário vazio para exibição inicial

    context = {
        'lote': lote,
        'avaliacoes': avaliacoes,
        'form_avaliacao': form,
        'media_estrelas': media_estrelas,
    }
    return render(request, 'tracker/cliente_detalhe_lote.html', context)

class EditarLoteView(LoginRequiredMixin, SuccessMessageMixin, UpdateView):
    model = LoteDeVinho
    form_class = LoteDeVinhoForm
    template_name = 'tracker/admin_gerenciar_lote.html' # Reutiliza o template
    success_message = "Lote '%(nome_lote)s' atualizado com sucesso!"
    login_url = reverse_lazy('admin:login')
    pk_url_kwarg = 'pk' # Define o nome do parâmetro da URL para a chave primária

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['titulo_pagina'] = f"Editar Lote: {self.object.nome_lote}"
        context['nome_botao'] = "Salvar Alterações"
        return context

    def get_success_url(self):
        # Volta para a home da vinícola ou para os detalhes do lote editado
        return reverse('tracker:home_vinicola')


class ExcluirLoteView(LoginRequiredMixin, SuccessMessageMixin, DeleteView):
    model = LoteDeVinho
    template_name = 'tracker/admin_confirmar_exclusao_lote.html'
    success_url = reverse_lazy('tracker:home_vinicola')
    success_message = "Lote excluído com sucesso."
    login_url = reverse_lazy('admin:login')
    pk_url_kwarg = 'pk'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['titulo_pagina'] = f"Confirmar Exclusão do Lote: {self.object.nome_lote}"
        return context

    # Para o SuccessMessageMixin funcionar com DeleteView
    def post(self, request, *args, **kwargs):
        messages.success(self.request, self.success_message)
        return super().post(request, *args, **kwargs)


class RegistrarSaidaEstoqueView(LoginRequiredMixin, DetailView):
    model = LoteDeVinho
    template_name = 'tracker/admin_registrar_saida_estoque.html'
    pk_url_kwarg = 'pk'
    context_object_name = 'lote'
    login_url = reverse_lazy('admin:login')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = SaidaEstoqueForm()
        context['titulo_pagina'] = f"Registrar Saída de Estoque: {self.object.nome_lote}"
        return context

    def post(self, request, *args, **kwargs):
        lote = self.get_object()
        form = SaidaEstoqueForm(request.POST)
        if form.is_valid():
            quantidade_saida = form.cleaned_data['quantidade']
            # observacao = form.cleaned_data['observacao'] # Pode ser salva em um log de movimentação

            if quantidade_saida > lote.quantidade_em_estoque:
                messages.error(request, f"Quantidade de saída ({quantidade_saida}) excede o estoque disponível ({lote.quantidade_em_estoque}).")
            else:
                lote.quantidade_em_estoque -= quantidade_saida
                lote.save()
                messages.success(request, f"{quantidade_saida} unidade(s) do lote '{lote.nome_lote}' removida(s) do estoque.")
                # Aqui você poderia registrar a observação em um log de movimentação de estoque, se tivesse um.
                return redirect('tracker:home_vinicola')

        # Se o formulário for inválido ou houver erro de estoque, renderiza a página novamente
        context = self.get_context_data(object=lote)
        context['form'] = form # Passa o formulário com erros de volta para o template
        return self.render_to_response(context)


class VinicolaDashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'tracker/vinicola_dashboard.html'
    login_url = reverse_lazy('admin:login')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['titulo_pagina'] = "Dashboard da Vinícola"

        # Dados básicos para o dashboard
        context['total_lotes'] = LoteDeVinho.objects.count()
        context['total_garrafas_estoque'] = LoteDeVinho.objects.aggregate(total=Sum('quantidade_em_estoque'))['total'] or 0
        context['lotes_em_alerta'] = LoteDeVinho.objects.filter(
            quantidade_em_estoque__lte=models.F('nivel_alerta_estoque')
        ).exclude(nivel_alerta_estoque__isnull=True).count()

        # Scans recentes (últimos 30 dias)
        trinta_dias_atras = timezone.now() - timedelta(days=30)
        scans_recentes = ScanEvento.objects.filter(timestamp_scan__gte=trinta_dias_atras)
        context['total_scans_30_dias'] = scans_recentes.count()

        # Lotes mais escaneados (Top 5)
        lotes_mais_escaneados = LoteDeVinho.objects.annotate(
            num_scans=Count('scans')
        ).filter(num_scans__gt=0).order_by('-num_scans')[:5]
        context['lotes_mais_escaneados'] = lotes_mais_escaneados

        # Dados para gráficos (exemplo - contagem de scans por dia nos últimos 7 dias)
        # Isso seria melhor processado e passado para uma biblioteca de gráficos como Chart.js
        scan_data_chart = []
        labels_chart = []
        today = timezone.now().date()
        for i in range(6, -1, -1): # Últimos 7 dias
            dia = today - timedelta(days=i)
            labels_chart.append(dia.strftime("%d/%m"))
            scan_data_chart.append(ScanEvento.objects.filter(timestamp_scan__date=dia).count())

        context['scan_labels_chart'] = labels_chart
        context['scan_data_chart'] = scan_data_chart

        return context

# --- Views Públicas (Cliente) ---


class DetalheLoteClienteView(FormMixin, DetailView): # Adicionado FormMixin
    model = LoteDeVinho
    template_name = 'tracker/cliente_detalhe_lote.html'
    context_object_name = 'lote'
    pk_url_kwarg = 'batch_id'
    form_class = AvaliacaoClienteForm # Define o formulário a ser usado

    def get_object(self, queryset=None):
        lote = super().get_object(queryset)
        # Registrar o evento de scan se ainda não foi registrado para esta sessão/IP (opcional, para evitar múltiplos registros por refresh)
        # Uma forma simples é usar a sessão:
        session_key = f'scanned_lote_{lote.id}'
        if not self.request.session.get(session_key, False):
            ScanEvento.objects.create(
                lote_vinho=lote,
                ip_address=self.get_client_ip(self.request),
                user_agent=self.request.META.get('HTTP_USER_AGENT', '')
            )
            self.request.session[session_key] = True # Marca como escaneado nesta sessão
        return lote

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        lote = self.object
        # Pega apenas avaliações aprovadas
        context['avaliacoes'] = lote.avaliacoes.all()
        context['form_avaliacao'] = self.get_form() # Adiciona o formulário de avaliação ao contexto

        # Para os links de compartilhamento
        context['share_url'] = self.request.build_absolute_uri(lote.get_absolute_url())
        context['share_title'] = f"Descobri este vinho incrível: {lote.nome_lote}!"
        return context

    def post(self, request, *args, **kwargs):
        self.object = self.get_object() # Garante que o objeto do DetailView esteja disponível
        form = self.get_form()
        if form.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    def form_valid(self, form):
        avaliacao = form.save(commit=False)
        avaliacao.lote_vinho = self.object
        # Se você decidir associar avaliações a usuários logados:
        # if self.request.user.is_authenticated:
        #     avaliacao.usuario = self.request.user
        avaliacao.save()
        messages.success(self.request, "Obrigado pela sua avaliação! Ela será revisada em breve.")
        return redirect(self.object.get_absolute_url() + '#avaliacoes') # Redireciona para a seção de avaliações

    def form_invalid(self, form):
        messages.error(self.request, "Houve um erro no seu formulário de avaliação. Por favor, verifique os campos.")
        # Re-renderiza a página com o formulário e erros
        return super().get(self.request) # Chama o método get para reconstruir o contexto
