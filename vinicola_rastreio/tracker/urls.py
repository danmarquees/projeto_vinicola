from django.urls import path
from . import views

app_name = 'tracker'

urlpatterns = [
    path('vinicola/', views.PaginaInicialVinicolaView.as_view(), name='home_vinicola'),
    path('vinicola/cadastrar/', views.CadastrarLoteView.as_view(), name='cadastrar_lote'),
    path('vinicola/qr-code/<uuid:batch_id>/', views.mostrar_qr_code_view, name='mostrar_qr_code'),
    path('lote/<uuid:batch_id>/', views.detalhes_lote_cliente, name='detalhe_lote'),
]
