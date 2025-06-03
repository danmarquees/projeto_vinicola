from django.urls import path
from . import views

app_name = 'tracker'

urlpatterns = [
    # URLs da Área da Vinícola
    path('vinicola/', views.PaginaInicialVinicolaView.as_view(), name='home_vinicola'),
    path('vinicola/dashboard/', views.VinicolaDashboardView.as_view(), name='vinicola_dashboard'),
    path('vinicola/cadastrar/', views.CadastrarLoteView.as_view(), name='cadastrar_lote'),
    path('vinicola/editar/<uuid:pk>/', views.EditarLoteView.as_view(), name='editar_lote'),
    path('vinicola/excluir/<uuid:pk>/', views.ExcluirLoteView.as_view(), name='excluir_lote'),
    path('vinicola/qr-code/<uuid:batch_id>/', views.mostrar_qr_code_view, name='mostrar_qr_code'),
    path('vinicola/saida-estoque/<uuid:pk>/', views.RegistrarSaidaEstoqueView.as_view(), name='registrar_saida_estoque'),

    # URL Pública para Cliente
    path('lote/<uuid:batch_id>/', views.DetalheLoteClienteView.as_view(), name='detalhe_lote_cliente'), # Renomeado
]
