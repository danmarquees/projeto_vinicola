from django.contrib import admin
from .models import LoteDeVinho, AvaliacaoCliente, ScanEvento

@admin.register(LoteDeVinho)
class LoteDeVinhoAdmin(admin.ModelAdmin):
    list_display = (
        'nome_lote', 'variedade_uva', 'data_colheita', 'quantidade_produzida_inicial',
        'quantidade_em_estoque', 'em_alerta_de_estoque', 'id'
    )
    list_filter = ('data_colheita', 'variedade_uva')
    search_fields = ('nome_lote', 'variedade_uva')
    date_hierarchy = 'data_colheita'
    readonly_fields = ('id', 'timestamp_criacao')

    fieldsets = (
        ("Informações Principais", {
            'fields': ('nome_lote', 'variedade_uva')
        }),
        ("Datas Importantes", {
            'fields': ('data_colheita', 'data_chegada_uvas', 'data_engarrafamento', 'data_lancamento')
        }),
        ("Detalhes da Produção", {
            'fields': ('origem_vinhedo', 'detalhes_fermentacao', 'tempo_barrica', 'tipo_barrica',
                       'processo_envelhecimento', 'tipo_rolha')
        }),
        ("Estoque", {
            'fields': ('quantidade_produzida_inicial', 'quantidade_em_estoque', 'nivel_alerta_estoque')
        }),
        ("Características e Observações", {
            'fields': ('notas_degustacao', 'informacoes_adicionais')
        }),
        ("Metadados", {
            'fields': ('timestamp_criacao',),
            'classes': ('collapse',)
        }),
    )
    # Para facilitar a edição, pode ser útil ter os campos de texto maiores
    # formfield_overrides = {
    #     models.TextField: {'widget': forms.Textarea(attrs={'rows':4, 'cols':40})},
    # }


# NOVO REGISTRO: AvaliacaoClienteAdmin
@admin.register(AvaliacaoCliente)
class AvaliacaoClienteAdmin(admin.ModelAdmin):
    list_display = ('lote_vinho', 'nome_avaliador', 'get_nota', 'data_avaliacao')
    list_filter = ('data_avaliacao', 'lote_vinho__nome_lote')
    search_fields = ('lote_vinho__nome_lote', 'nome_avaliador', 'comentario')
    # list_editable = ('aprovado',) # Permite editar o campo 'aprovado' diretamente na lista  <- 'aprovado' is not a field.
    actions = ['aprovar_avaliacoes', 'reprovar_avaliacoes']

    readonly_fields = ('data_avaliacao',) # Data não deve ser editável

    fieldsets = (
        (None, {
            'fields': ('lote_vinho', 'nome_avaliador', 'email_avaliador')
        }),
        ('Conteúdo da Avaliação', {
            'fields': ('nota', 'comentario')
        }),
        ('Moderação', {
            'fields': ('aprovado', 'data_avaliacao')
        }),
    )

    def get_nota(self, obj):
        return obj.nota
    get_nota.short_description = "Nota"

    def aprovar_avaliacoes(self, request, queryset):
        queryset.update(aprovado=True)
    aprovar_avaliacoes.short_description = "Aprovar avaliações selecionadas"

    def reprovar_avaliacoes(self, request, queryset):
        queryset.update(aprovado=False)
    reprovar_avaliacoes.short_description = "Reprovar avaliações selecionadas"

@admin.register(ScanEvento)
class ScanEventoAdmin(admin.ModelAdmin):
    list_display = ('lote_vinho', 'timestamp_scan', 'ip_address')
    list_filter = ('timestamp_scan', 'lote_vinho__variedade_uva') # Filtra pela variedade do lote associado
    search_fields = ('lote_vinho__nome_lote', 'ip_address')
    readonly_fields = ('id', 'timestamp_scan', 'lote_vinho', 'ip_address', 'user_agent') # Praticamente tudo readonly

    def has_add_permission(self, request):
        return False # Impede adição manual de scans pelo admin

    def has_change_permission(self, request, obj=None):
        return False # Impede edição de scans pelo admin (ou apenas para superusuários)

    # def has_delete_permission(self, request, obj=None):
    #     return False # Opcional: impedir exclusão
