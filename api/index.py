import os
import sys

# Adiciona o diretório backend ao path para que o Django possa encontrar o módulo vinicola_rastreio
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Aponta para as configurações corretas do Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vinicola_rastreio.settings")

from django.core.wsgi import get_wsgi_application

# Vercel espera uma variável 'app'
app = get_wsgi_application()
