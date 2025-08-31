from django.shortcuts import render
from django.conf import settings
import os

def index_view(request):
    # Verifica se o arquivo index.html existe no diretório de build do React
    # Em produção, este arquivo será servido pelo servidor web (Nginx/Apache)
    # Mas para um setup mais simples com Django servindo tudo, podemos fazer assim:
    try:
        # O caminho para o index.html é relativo ao BASE_DIR do Django
        # e depois aponta para o diretório 'dist' do frontend.
        # Certifique-se que o caminho está correto relativo ao BASE_DIR.
        # BASE_DIR é o diretório 'vinicola_rastreio', então precisamos subir um nível para 'backend',
        # depois descer para 'frontend' e acessar 'dist/index.html'.
        index_path = os.path.join(settings.BASE_DIR, '..', 'frontend', 'dist', 'index.html')
        with open(index_path, 'r', encoding='utf-8') as f:
            return render(request, 'index.html', {})
    except FileNotFoundError:
        # Se o index.html não for encontrado (por exemplo, antes do build do React),
        # podemos retornar uma mensagem de erro ou um template simples.
        # O template 'index_fallback.html' deve estar em backend/vinicola_rastreio/templates/
        return render(request, 'index_fallback.html', {})
    except Exception as e:
        # Captura outros erros inesperados
        return render(request, 'error_template.html', {'error': str(e)}) # Crie um error_template.html se necessário
