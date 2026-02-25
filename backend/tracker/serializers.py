from rest_framework import serializers
from .models import LoteDeVinho, AvaliacaoCliente, ScanEvento

class AvaliacaoClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvaliacaoCliente
        fields = '__all__'

class ScanEventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScanEvento
        fields = '__all__'

class LoteDeVinhoSerializer(serializers.ModelSerializer):
    avaliacoes = AvaliacaoClienteSerializer(many=True, read_only=True)
    media_estrelas = serializers.SerializerMethodField()

    class Meta:
        model = LoteDeVinho
        fields = '__all__'
        
    def get_media_estrelas(self, obj):
        avaliacoes = obj.avaliacoes.all()
        if avaliacoes:
            return round(sum([av.estrelas for av in avaliacoes]) / len(avaliacoes), 1)
        return 'N/A'
