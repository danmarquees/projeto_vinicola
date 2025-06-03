from django import forms
from .models import LoteDeVinho, AvaliacaoCliente

class LoteDeVinhoForm(forms.ModelForm):
    class Meta:
        model = LoteDeVinho
        fields = [
            'nome_lote', 'variedade_uva', 'data_colheita', 'origem_vinhedo',
            'data_chegada_uvas', 'detalhes_fermentacao', 'tempo_barrica', 'tipo_barrica',
            'processo_envelhecimento', 'data_engarrafamento', 'tipo_rolha',
            'data_lancamento', 'notas_degustacao', 'informacoes_adicionais',
            'quantidade_produzida_inicial', 'quantidade_em_estoque', 'nivel_alerta_estoque'
        ]
        # Usar widgets para melhorar a experiência do usuário (ex: input de data)
        widgets = {
            'data_colheita': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
            'data_chegada_uvas': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
            'data_engarrafamento': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
            'data_lancamento': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
            'detalhes_fermentacao': forms.Textarea(attrs={'rows': 3, 'class': 'form-control'}),
            'processo_envelhecimento': forms.Textarea(attrs={'rows': 3, 'class': 'form-control'}),
            'notas_degustacao': forms.Textarea(attrs={'rows': 3, 'class': 'form-control'}),
            'informacoes_adicionais': forms.Textarea(attrs={'rows': 2, 'class': 'form-control'}),
            'nome_lote': forms.TextInput(attrs={'class': 'form-control'}),
            'variedade_uva': forms.TextInput(attrs={'class': 'form-control'}),
            'origem_vinhedo': forms.TextInput(attrs={'class': 'form-control'}),
            'tempo_barrica': forms.TextInput(attrs={'class': 'form-control'}),
            'tipo_barrica': forms.TextInput(attrs={'class': 'form-control'}),
            'tipo_rolha': forms.TextInput(attrs={'class': 'form-control'}),
            'quantidade_produzida_inicial': forms.NumberInput(attrs={'class': 'form-control'}),
            'quantidade_em_estoque': forms.NumberInput(attrs={'class': 'form-control'}),
            'nivel_alerta_estoque': forms.NumberInput(attrs={'class': 'form-control'}),
        }
        labels = {
            'nome_lote': 'Nome do Vinho/Lote',
            'quantidade_produzida_inicial': 'Qtd. Produzida Inicial',
            'quantidade_em_estoque': 'Qtd. Atual em Estoque',
            'nivel_alerta_estoque': 'Nível de Alerta de Estoque',
        }
        help_texts = {
            'data_colheita': 'Selecione a data em que as uvas foram colhidas.',
            'quantidade_em_estoque': 'Este valor será igualado à "Qtd. Produzida Inicial" no cadastro, se não for preenchido.',
        }

class AvaliacaoClienteForm(forms.ModelForm):
    class Meta:
        model = AvaliacaoCliente
        fields = ['estrelas', 'comentario']
        widgets = {
            'estrelas': forms.RadioSelect(choices=[(i, str(i)) for i in range(1, 6)]), # Renderiza estrelas como radio buttons
            'comentario': forms.Textarea(attrs={'rows': 4, 'placeholder': 'Deixe seu comentário sobre o vinho (opcional)...'}),
        }
        labels = {
            'estrelas': 'Sua avaliação (1 a 5 estrelas)',
            'comentario': 'Comentário',
        }

# Formulário para registrar uma saída de estoque (exemplo simples)
class SaidaEstoqueForm(forms.Form):
    quantidade = forms.IntegerField(label="Quantidade de Saída", min_value=1, widget=forms.NumberInput(attrs={'class': 'form-control'}))
    observacao = forms.CharField(label="Observação (Opcional)", required=False, widget=forms.Textarea(attrs={'rows': 2, 'class': 'form-control'}))
