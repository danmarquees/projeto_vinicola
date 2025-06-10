# Guia de Configuração e Execução: Sistema de Rastreabilidade de Vinhos com Django

-----

## 1\. Introdução

Este documento fornece as instruções passo a passo para configurar e executar o projeto **"Sistema de Rastreabilidade de Vinhos"** desenvolvido com o framework **Django**. O sistema permite que uma vinícola cadastre lotes de vinho e gere **QR Codes** que, ao serem escaneados pelos clientes, exibem informações detalhadas sobre a procedência e o processo de produção do vinho.

-----

## 2\. Pré-requisitos

Antes de começar, certifique-se de que você tem os seguintes softwares instalados em seu sistema:

  * **Python**: Versão 3.8 ou superior. Você pode baixá-lo em [python.org](https://www.python.org).
  * **Pip**: O gerenciador de pacotes do Python. Geralmente, ele é instalado automaticamente com o Python.
  * **Git** (Opcional, mas recomendado): Para clonar o repositório do projeto, se aplicável. Caso contrário, certifique-se de ter todos os arquivos do projeto.

-----

## 3\. Configuração do Ambiente do Projeto

### 3.1. Obtenha os Arquivos do Projeto

Se o projeto estiver em um repositório Git, clone-o:

```bash
git clone <URL_DO_REPOSITORIO>
cd nome-do-diretorio-do-projeto
```

Caso contrário, certifique-se de que todos os arquivos do projeto estejam em um diretório na sua máquina e navegue até ele pelo terminal.

### 3.2. Crie e Ative um Ambiente Virtual

Navegue até o diretório raiz do projeto (onde o arquivo `manage.py` está localizado):

```bash
cd caminho/para/seu/projeto_vinicola
```

Crie um ambiente virtual (chamado `venv`):

```bash
python -m venv venv
```

Ative o ambiente virtual:

  * **No Windows:**
    ```bash
    venv\Scripts\activate
    ```
  * **No macOS/Linux:**
    ```bash
    source venv/bin/activate
    ```

Após a ativação, o nome do ambiente virtual (ex: `(venv)`) aparecerá no início do seu prompt de comando.

### 3.3. Instale as Dependências

Se o arquivo `requirements.txt` existir:

```bash
pip install -r requirements.txt
```

Se o arquivo `requirements.txt` não existir, instale manualmente:

```bash
pip install Django qrcode[pil]
```

(Opcional) Para gerar o `requirements.txt`:

```bash
pip freeze > requirements.txt
```

-----

## 4\. Configuração do Banco de Dados

O projeto utiliza SQLite por padrão, o que simplifica a configuração inicial.

### 4.1. Aplique as Migrações Iniciais

```bash
python manage.py makemigrations tracker
python manage.py migrate
```

Isso criará um arquivo `db.sqlite3` no diretório raiz do projeto.

### 4.2. Crie um Superusuário

```bash
python manage.py createsuperuser
```

Siga as instruções no terminal para definir nome de usuário, e-mail e senha.

-----

## 5\. Executando o Servidor de Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
python manage.py runserver
```

Por padrão, o servidor estará em `http://127.0.0.1:8000/`. Para outra porta:

```bash
python manage.py runserver 8080
```

-----

## 6\. Acessando a Aplicação

  * **Página Inicial da Aplicação**
    `http://127.0.0.1:8000/`
    Redireciona para a página inicial da área da vinícola.

  * **Área da Vinícola (Requer Login)**
    `http://127.0.0.1:8000/rastreio/vinicola/`
    Redireciona para o login se não estiver autenticado.

  * **Cadastro de Novo Lote de Vinho (Requer Login)**
    `http://127.0.0.1:8000/rastreio/vinicola/cadastrar/`

  * **Visualização do QR Code (Requer Login)**
    `http://127.0.0.1:8000/rastreio/vinicola/qr-code/ID_DO_LOTE/`
    Substitua `ID_DO_LOTE` pelo UUID do lote.

  * **Detalhes do Lote para o Cliente**
    `http://127.0.0.1:8000/rastreio/lote/ID_DO_LOTE/`
    Página pública para o cliente.

  * **Interface Administrativa do Django**
    `http://127.0.0.1:8000/admin/`
    Faça login com o superusuário criado.

-----

## 7\. Estrutura de Arquivos Relevantes (Resumo)

  * `manage.py`: Utilitário do Django.
  * `vinicola_rastreio/`: Diretório do projeto
      * `settings.py`: Configurações do projeto
      * `urls.py`: URLs principais
  * `tracker/`: App Django da rastreabilidade
      * `models.py`: Modelos de dados
      * `views.py`: Lógica das requisições
      * `forms.py`: Formulários Django
      * `urls.py`: URLs do app
      * `admin.py`: Configuração admin
      * `templates/tracker/`: Arquivos HTML
  * `db.sqlite3`: Banco de dados SQLite
  * `requirements.txt`: Lista de dependências

-----

## 8\. Solução de Problemas Comuns

  * **`ModuleNotFoundError`**: Verifique se o ambiente virtual está ativado e se instalou as dependências (`pip install -r requirements.txt`).
  * **Erro de Migração (`no such table`)**: Certifique-se de ter rodado `makemigrations` e `migrate`.
  * **Erro 404 (Página Não Encontrada)**: Verifique se as URLs estão configuradas corretamente.
  * **Arquivos Estáticos não carregam**: Certifique-se de que `DEBUG=True` está no `settings.py`. Para produção, use ferramentas como Whitenoise.
