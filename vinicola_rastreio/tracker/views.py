from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse_lazy, reverse
from django.views.generic import CreateView, DetailView, ListView
from django.contrib.auth.mixins import LoginRequiredMixin # Para proteger views
from django.contrib.messages.views import SuccessMessageMixin
from .models import LoteDeVinho,AvaliacaoCliente
from .forms import LoteDeVinhoForm, AvaliacaoClienteForm
import qrcode
from io import BytesIO
import base64
from django.http import Http404, JsonResponse # Importe JsonResponse
from django.db import models


class PaginaInicialVinicolaView(LoginRequiredMixin, ListView):
    model = LoteDeVinho
    template_name = 'tracker/vinicola_home.html'
    context_object_name = 'lotes_recentes'
    paginate_by = 10 # Mostrar 10 lotes por página
    login_url = '/admin/login/' # Ou sua URL de login customizada

    def get_queryset(self):
        return LoteDeVinho.objects.order_by('-timestamp_criacao')[:20] # Exibe os 20 mais recentes

class CadastrarLoteView(LoginRequiredMixin, SuccessMessageMixin, CreateView):
    model = LoteDeVinho
    form_class = LoteDeVinhoForm
    template_name = 'tracker/admin_cadastrar_lote.html'
    success_message = "Lote '%(nome_lote)s' cadastrado com sucesso!"
    login_url = '/admin/login/'

    def get_success_url(self):
        return reverse('tracker:mostrar_qr_code', kwargs={'batch_id': self.object.id})

def mostrar_qr_code_view(request, batch_id):
    # Idealmente, esta view também seria protegida por login
    lote = get_object_or_404(LoteDeVinho, id=batch_id)
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
