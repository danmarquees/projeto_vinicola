from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoteDeVinhoViewSet, AvaliacaoClienteViewSet, ScanEventoViewSet, CustomAuthToken

router = DefaultRouter()
router.register(r'lotes', LoteDeVinhoViewSet)
router.register(r'avaliacoes', AvaliacaoClienteViewSet)
router.register(r'scans', ScanEventoViewSet)

app_name = 'tracker'

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', CustomAuthToken.as_view(), name='api_login'),
]
