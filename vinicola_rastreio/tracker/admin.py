from django.contrib import admin
from .models import LoteDeVinho

@admin.register(LoteDeVinho)
class LoteDeVinhoAdmin(admin.ModelAdmin):
    list_display = ('nome_lote', 'variedade_uva', 'data_colheita', 'id', 'timestamp_criacao')
    search_fields = ('nome_lote', 'variedade_uva', 'id')
    list_filter = ('data_colheita', 'variedade_uva', 'timestamp_criacao')
    date_hierarchy = 'data_colheita' # Adiciona navegação por hierarquia de datas
    readonly_fields = ('id', 'timestamp_criacao') # Campos que não podem ser editados diretamente
    fieldsets = (
        (None, {
            'fields': ('nome_lote', 'variedade_uva', 'id')
        }),
        ('Datas Importantes', {
            'fields': ('data_colheita', 'data_chegada_uvas', 'data_engarrafamento', 'data_lancamento')
        }),
        ('Detalhes da Produção', {
            'fields': ('origem_vinhedo', 'detalhes_fermentacao', 'processo_envelhecimento', 'quantidade_produzida')
        }),
        ('Características e Observações', {
            'fields': ('notas_degustacao', 'informacoes_adicionais')
        }),
        ('Metadados', {
            'fields': ('timestamp_criacao',),
            'classes': ('collapse',) # Começa colapsado
        }),
    )
