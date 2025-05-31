from django.db import models
from django.urls import reverse
import uuid

class LoteDeVinho(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, help_text="ID único para este lote de vinho")
    nome_lote = models.CharField(max_length=200, verbose_name="Nome do Lote / Vinho")
    variedade_uva = models.CharField(max_length=100, verbose_name="Variedade da Uva")
    data_colheita = models.DateField(verbose_name="Data da Colheita")
    origem_vinhedo = models.CharField(max_length=255, blank=True, null=True, verbose_name="Origem do Vinhedo")
    data_chegada_uvas = models.DateField(blank=True, null=True, verbose_name="Data de Chegada das Uvas na Vinícola")
    detalhes_fermentacao = models.TextField(blank=True, null=True, verbose_name="Detalhes da Fermentação")
    processo_envelhecimento = models.TextField(blank=True, null=True, verbose_name="Processo de Envelhecimento")
    data_engarrafamento = models.DateField(blank=True, null=True, verbose_name="Data de Engarrafamento")
    data_lancamento = models.DateField(blank=True, null=True, verbose_name="Data de Lançamento / Chegada às Prateleiras")
    quantidade_produzida = models.PositiveIntegerField(blank=True, null=True, verbose_name="Quantidade Produzida (Garrafas)")
    notas_degustacao = models.TextField(blank=True, null=True, verbose_name="Notas de Degustação")
    informacoes_adicionais = models.TextField(blank=True, null=True, verbose_name="Informações Adicionais")
    timestamp_criacao = models.DateTimeField(auto_now_add=True, verbose_name="Data de Criação do Registro")

    class Meta:
        verbose_name = "Lote de Vinho"
        verbose_name_plural = "Lotes de Vinho"
        ordering = ['-timestamp_criacao'] # Ordena os lotes mais recentes primeiro

    def __str__(self):
        return f"{self.nome_lote} (Colheita: {self.data_colheita.strftime('%d/%m/%Y') if self.data_colheita else 'N/A'})"

    def get_absolute_url(self):
        # URL para visualizar os detalhes deste lote (para o cliente)
        return reverse('tracker:detalhe_lote', kwargs={'batch_id': self.id})
