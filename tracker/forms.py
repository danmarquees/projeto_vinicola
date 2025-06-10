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
            'quantidade_produzida_inicial', 'quantidade_em_estoque', 'nivel_alerta_estoque',
            'sugestoes_harmonizacao', 'temperatura_servico', 'dicas_armazenamento',
            'video_url', 'imagem_vinho',
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
            'temperatura_servico': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ex: 16-18°C'}),
            'video_url': forms.URLInput(attrs={'class': 'form-control', 'placeholder': 'https://www.youtube.com/embed/seu_video_id'}),
            'quantidade_produzida_inicial': forms.NumberInput(attrs={'class': 'form-control'}),
            'quantidade_em_estoque': forms.NumberInput(attrs={'class': 'form-control'}),
            'nivel_alerta_estoque': forms.NumberInput(attrs={'class': 'form-control'}),
            'sugestoes_harmonizacao': forms.Textarea(attrs={'rows': 3, 'class': 'form-control'}),
            'dicas_armazenamento': forms.Textarea(attrs={'rows': 3, 'class': 'form-control'}),
        }
        labels = {
            'nome_lote': 'Nome do Vinho/Lote',
            'quantidade_produzida_inicial': 'Qtd. Produzida Inicial',
            'quantidade_em_estoque': 'Qtd. Atual em Estoque',
            'nivel_alerta_estoque': 'Nível de Alerta de Estoque',
            'sugestoes_harmonizacao': 'Sugestões de Harmonização',
            'temperatura_servico': 'Temperatura Ideal de Serviço',
            'dicas_armazenamento': 'Dicas de Armazenamento',
            'video_url': 'URL do Vídeo (Embed)',
            'imagem_vinho': 'Imagem do Vinho/Rótulo',
        }
        help_texts = {
            'data_colheita': 'Selecione a data em que as uvas foram colhidas.',
            'quantidade_em_estoque': 'Este valor será igualado à "Qtd. Produzida Inicial" no cadastro, se não for preenchido.',
            'video_url': 'Cole o link de incorporação (embed) do seu vídeo (ex: do YouTube, Vimeo).',
        }

class AvaliacaoClienteForm(forms.ModelForm):
    class Meta:
        model = AvaliacaoCliente
        fields = ['estrelas', 'comentario', 'nome_avaliador', 'email_avaliador']
        widgets = {
            'nome_avaliador': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Seu nome (opcional)'}),
            'email_avaliador': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Seu email (opcional, não será publicado)'}),
            'estrelas': forms.RadioSelect(choices=[(i, str(i)) for i in range(1, 6)]),
            'comentario': forms.Textarea(attrs={'rows': 4, 'class': 'form-control', 'placeholder': 'Deixe seu comentário sobre o vinho (opcional)...'}),
        }
        labels = {
            'estrelas': 'Sua avaliação (1 a 5 estrelas)',
            'comentario': 'Comentário',
            'nome_avaliador': 'Seu Nome (Opcional)',
            'email_avaliador': 'Seu Email (Opcional)',
        }

# Formulário para registrar uma saída de estoque (exemplo simples)
class SaidaEstoqueForm(forms.Form):
    quantidade = forms.IntegerField(label="Quantidade de Saída", min_value=1, widget=forms.NumberInput(attrs={'class': 'form-control'}))
    observacao = forms.CharField(label="Observação (Opcional)", required=False, widget=forms.Textarea(attrs={'rows': 2, 'class': 'form-control'}))
