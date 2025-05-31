from django.shortcuts import render, get_object_or_404
from django.urls import reverse_lazy, reverse
from django.views.generic import CreateView, DetailView, ListView
from django.contrib.auth.mixins import LoginRequiredMixin # Para proteger views
from django.contrib.messages.views import SuccessMessageMixin
from .models import LoteDeVinho
from .forms import LoteDeVinhoForm
import qrcode
from io import BytesIO
import base64

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

class DetalheLoteClienteView(DetailView): # Renomeado para clareza
    model = LoteDeVinho
    template_name = 'tracker/cliente_detalhe_lote.html'
    context_object_name = 'lote'
    pk_url_kwarg = 'batch_id'
