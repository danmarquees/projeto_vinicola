from django.contrib import admin
from .models import LoteDeVinho, AvaliacaoCliente

@admin.register(LoteDeVinho)
class LoteDeVinhoAdmin(admin.ModelAdmin):
    list_display = ('nome_lote', 'variedade_uva', 'data_colheita', 'id', 'timestamp_criacao')
    search_fields = ('nome_lote', 'variedade_uva')
    list_filter = ('data_colheita', 'variedade_uva', 'timestamp_criacao')
    date_hierarchy = 'data_colheita' # Adiciona navegação por hierarquia de datas
    readonly_fields = ('id', 'timestamp_criacao') # Campos que não podem ser editados diretamente
    fieldsets = (
        (None, {
            'fields': ('nome_lote', 'variedade_uva',)
        }),
        ('Datas Importantes', {
            'fields': ('data_colheita', 'data_chegada_uvas', 'data_engarrafamento', 'data_lancamento')
        }),
        ('Detalhes da Produção', {
            'fields': ('origem_vinhedo', 'detalhes_fermentacao', 'processo_envelhecimento', 'quantidade_produzida')
        }),
        ('Características e Observações', {
            'fields': ('notas_degustacao', 'informacoes_adicionais', 'harmonizacao', 'temperatura_servico', 'dicas_armazenamento')
        }),
        ('Links', {
            'fields': ('link_video_producao', 'link_rede_social_vinicola')
        }),
        ('Metadados', {
            'fields': ('timestamp_criacao',),
            'classes': ('collapse',) # Começa colapsado
        }),
    )


@admin.register(AvaliacaoCliente)
class AvaliacaoClienteAdmin(admin.ModelAdmin):
    list_display = ('nome_lote', 'estrelas', 'comentario', 'data_avaliacao')
    list_filter = ('estrelas', 'data_avaliacao', 'nome_lote') # Filtrar por nome do vinho do lote
    search_fields = ('nome_lote__nome_lote', 'comentario')
    readonly_fields = ('data_avaliacao',) # A data de avaliação é gerada automaticamente
