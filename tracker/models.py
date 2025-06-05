from django.db import models
from django.urls import reverse
from django.core.validators import MinValueValidator
# from django.conf import settings # Para referenciar o User model (unused)
import uuid

class LoteDeVinho(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, help_text="ID único para este lote de vinho")
    nome_lote = models.CharField(max_length=200, verbose_name="Nome do Lote / Vinho")
    variedade_uva = models.CharField(max_length=100, verbose_name="Variedade da Uva")
    data_colheita = models.DateField(verbose_name="Data da Colheita")
    origem_vinhedo = models.CharField(max_length=255, blank=True, null=True, verbose_name="Origem do Vinhedo")

    data_chegada_uvas = models.DateField(blank=True, null=True, verbose_name="Data de Chegada das Uvas na Vinícola")
    detalhes_fermentacao = models.TextField(blank=True, null=True, verbose_name="Detalhes da Fermentação")
    tempo_barrica = models.CharField(max_length=100, blank=True, null=True, verbose_name="Tempo em Barrica (Ex: 12 meses)")
    tipo_barrica = models.CharField(max_length=100, blank=True, null=True, verbose_name="Tipo de Barrica (Ex: Carvalho Francês, 1º uso)")
    processo_envelhecimento = models.TextField(blank=True, null=True, verbose_name="Processo de Envelhecimento")
    data_engarrafamento = models.DateField(blank=True, null=True, verbose_name="Data de Engarrafamento")
    data_lancamento = models.DateField(blank=True, null=True, verbose_name="Data de Lançamento / Chegada às Prateleiras")
    tipo_rolha = models.CharField(max_length=100, blank=True, null=True, verbose_name="Tipo de Rolha (Ex: Cortiça natural, Sintética)")
    ultima_modificacao = models.DateTimeField(auto_now=True, verbose_name="Última Modificação")
    quantidade_produzida = models.PositiveIntegerField(blank=True, null=True, verbose_name="Quantidade Produzida (Garrafas)")
    notas_degustacao = models.TextField(blank=True, null=True, verbose_name="Notas de Degustação")
    informacoes_adicionais = models.TextField(blank=True, null=True, verbose_name="Informações Adicionais")
    timestamp_criacao = models.DateTimeField(auto_now_add=True, verbose_name="Data de Criação do Registro")
    # Adicionando novos campos para informações de consumo/harmonização
    harmonizacao = models.TextField(blank=True, null=True, help_text="Sugestões de harmonização com alimentos.")
    temperatura_servico = models.CharField(max_length=50, blank=True, null=True, help_text="Temperatura ideal para servir o vinho.")
    dicas_armazenamento = models.TextField(blank=True, null=True, help_text="Dicas para armazenar o vinho corretamente.")
    # Adicionando campos para links multimídia/redes sociais
    link_video_producao = models.URLField(blank=True, null=True, help_text="Link para um vídeo sobre a produção (YouTube, Vimeo, etc.).")
    link_rede_social_vinicola = models.URLField(blank=True, null=True, help_text="Link para a rede social oficial da vinícola.")

    # Novos campos para Gestão de Estoque
    quantidade_produzida_inicial = models.PositiveIntegerField(
        verbose_name="Quantidade Produzida Inicial (Garrafas)",
        help_text="Número total de garrafas produzidas neste lote.",
        default=0,
    )
    quantidade_em_estoque = models.PositiveIntegerField(
        verbose_name="Quantidade Atual em Estoque (Garrafas)",
        help_text="Número de garrafas atualmente disponíveis.",
        default=0,
        validators=[MinValueValidator(0)]
    )
    nivel_alerta_estoque = models.PositiveIntegerField(
        verbose_name="Nível de Alerta de Estoque (Garrafas)",
        help_text="Receber alerta quando o estoque atingir esta quantidade.",
        blank=True, null=True, default=10
    )

    # --- NOVOS CAMPOS PARA CLIENTE ---
    sugestoes_harmonizacao = models.TextField(
        blank=True, null=True, verbose_name="Sugestões de Harmonização",
        help_text="Descreva pratos ou tipos de alimentos que combinam bem com este vinho."
    )
    temperatura_servico_recomendada = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Temperatura Ideal de Serviço",
        help_text="Ex: 16-18°C"
    )
    dicas_armazenamento = models.TextField(
        blank=True, null=True, verbose_name="Dicas de Armazenamento",
        help_text="Instruções sobre como armazenar a garrafa para preservar a qualidade do vinho."
    )
    video_url = models.URLField(
        blank=True, null=True, verbose_name="URL do Vídeo",
        help_text="Link para um vídeo (Ex: YouTube, Vimeo) sobre o vinho, vinícola ou produção. Use o link de 'incorporar' (embed)."
    )
    # Campo para imagem do rótulo ou do vinho (opcional, mas útil)
    imagem_vinho = models.ImageField(
        upload_to='vinhos_imagens/', blank=True, null=True, verbose_name="Imagem do Vinho/Rótulo"
    )

    class Meta:
        verbose_name = "Lote de Vinho"
        verbose_name_plural = "Lotes de Vinho"
        ordering = ['-data_colheita', '-timestamp_criacao']

    def __str__(self):
        return f"{self.nome_lote} (Colheita: {self.data_colheita:%d/%m/%Y})" if self.data_colheita else f"{self.nome_lote} (Colheita: N/A)"

    def get_absolute_url(self):
        return reverse('tracker:detalhe_lote_cliente', kwargs={'batch_id': self.id})

    def get_edit_url(self):
        return reverse('tracker:editar_lote', kwargs={'pk': self.id})

    def get_delete_url(self):
        return reverse('tracker:excluir_lote', kwargs={'pk': self.id})

    @property
    def em_alerta_de_estoque(self):
        if self.nivel_alerta_estoque is not None:
            return self.quantidade_em_estoque <= self.nivel_alerta_estoque
        return False

    def save(self, *args, **kwargs):
        if not self.pk and self.quantidade_em_estoque == 0 and self.quantidade_produzida_inicial > 0:
            self.quantidade_em_estoque = self.quantidade_produzida_inicial
        super().save(*args, **kwargs)


class AvaliacaoCliente(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lote_vinho = models.ForeignKey(LoteDeVinho, on_delete=models.CASCADE, related_name='avaliacoes')
    nome_avaliador = models.CharField(max_length=100, verbose_name="Seu Nome (Opcional)", blank=True, null=True)
    email_avaliador = models.EmailField(verbose_name="Seu Email (Opcional, não será publicado)", blank=True, null=True)
    estrelas = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)], help_text="Pontuação de 1 a 5 estrelas.")
    comentario = models.TextField(blank=True, null=True, help_text="Comentário sobre o vinho.")
    data_avaliacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-data_avaliacao']

    def __str__(self):
        return f"Avaliação de {self.estrelas} estrelas para {self.lote_vinho.nome_lote}"


class ScanEvento(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lote_vinho = models.ForeignKey(LoteDeVinho, on_delete=models.CASCADE, related_name="scans")
    timestamp_scan = models.DateTimeField(auto_now_add=True, verbose_name="Data/Hora do Scan")
    ip_address = models.GenericIPAddressField(blank=True, null=True, verbose_name="Endereço IP")
    user_agent = models.TextField(blank=True, null=True, verbose_name="User Agent")

    class Meta:
        verbose_name = "Evento de Scan de QR Code"
        verbose_name_plural = "Eventos de Scan de QR Code"
        ordering = ['-timestamp_scan']

    def __str__(self):
        return f"Scan do lote {self.lote_vinho.nome_lote} em {self.timestamp_scan:%d/%m/%Y %H:%M}"
