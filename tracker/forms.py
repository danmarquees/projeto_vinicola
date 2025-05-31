from django import forms
from .models import LoteDeVinho, AvaliacaoCliente

class LoteDeVinhoForm(forms.ModelForm):
    class Meta:
        model = LoteDeVinho
        fields = [
            'nome_lote', 'variedade_uva', 'data_colheita', 'origem_vinhedo',
            'data_chegada_uvas', 'detalhes_fermentacao', 'processo_envelhecimento',
            'data_engarrafamento', 'data_lancamento', 'quantidade_produzida',
            'notas_degustacao', 'informacoes_adicionais'
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
            # Adicionar 'class': 'form-control' para outros campos se usar Bootstrap, por exemplo
            'nome_lote': forms.TextInput(attrs={'class': 'form-control'}),
            'variedade_uva': forms.TextInput(attrs={'class': 'form-control'}),
            'origem_vinhedo': forms.TextInput(attrs={'class': 'form-control'}),
            'quantidade_produzida': forms.NumberInput(attrs={'class': 'form-control'}),
        }
        labels = {
            'nome_lote': 'Nome do Vinho/Lote',
            # Personalize outros labels se necessário
        }
        help_texts = {
            'data_colheita': 'Selecione a data em que as uvas foram colhidas.',
            # Adicione outros textos de ajuda
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
