from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from .models import LoteDeVinho, AvaliacaoCliente, ScanEvento
from .serializers import LoteDeVinhoSerializer, AvaliacaoClienteSerializer, ScanEventoSerializer

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username
        })

class LoteDeVinhoViewSet(viewsets.ModelViewSet):
    queryset = LoteDeVinho.objects.all().order_by('-data_colheita', '-timestamp_criacao')
    serializer_class = LoteDeVinhoSerializer
    
    def get_permissions(self):
        # Permitir que qualquer pessoa visualize a lista ou detalhes do lote
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

class AvaliacaoClienteViewSet(viewsets.ModelViewSet):
    queryset = AvaliacaoCliente.objects.all().order_by('-data_avaliacao')
    serializer_class = AvaliacaoClienteSerializer
    permission_classes = [permissions.AllowAny] # Qualquer um pode avaliar

class ScanEventoViewSet(viewsets.ModelViewSet):
    queryset = ScanEvento.objects.all().order_by('-timestamp_scan')
    serializer_class = ScanEventoSerializer
    permission_classes = [permissions.AllowAny] # Qualquer scan pode ser registrado anônimamente
