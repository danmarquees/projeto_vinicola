# Sistema de Rastreabilidade de Vinhos Premium 🍷

Este projeto é uma plataforma full-stack moderna de **Rastreabilidade e Gestão de Adega**, projetada para registrar o ciclo de vida de lotes de vinho premium — desde a colheita até a degustação final —, além de apresentar uma interface visual de alto padrão (Bordeaux & Champagne) para os clientes através da leitura de QR Codes nas garrafas.

---

## 🏗️ Arquitetura do Projeto

O sistema foi refatorado de uma arquitetura legada (Django SSR) para uma **Arquitetura Full-Stack Desacoplada**:

* **Frontend:** React + Vite + Tailwind CSS v4. Responsável por todo o visual elegante (Admin Panel e a Jornada do Cliente no QR Code).
* **Backend:** Django Rest Framework (DRF). Fornece uma API JSON segura, com Autenticação baseada em Tokens e banco de dados contendo o modelo enológico completo.

---

## 🚀 Como Rodar o Projeto Localmente

O projeto exige que dois servidores rodem em paralelo (em janelas de terminais diferentes): o Servidor Banco de Dados/API (Django) e o Servidor Visual (React).

### Passo 1: O Backend (Django)

1. Abra um terminal e navegue até a pasta do backend:

   ```bash
   cd backend
   ```

2. Crie e ative um ambiente virtual (recomendado):

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # Mac/Linux
   # venv\Scripts\activate   # Windows
   ```

3. Instale as bibliotecas Python (Django, DRF, CORS, etc.):

   ```bash
   pip install -r requirements.txt
   ```

4. Aplique o banco de dados e inicie o servidor:

   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

*O Backend ficará escutando em `http://localhost:8000/`. Ele gerencia as rotas `/api/lotes/`, `/api/auth/login/` e `/api/scans/`.*

### Passo 2: O Frontend (React/Vite)

1. Abra um **novo** terminal e navegue até a pasta do frontend:

   ```bash
   cd frontend
   ```

2. Instale as dependências JavaScript:

   ```bash
   npm install
   ```

3. Inicie o servidor veloz do Vite:

   ```bash
   npm run dev
   ```

*O Frontend ficará disponível em `http://localhost:5173/`. Por padrão, o `vite.config.js` já está configurado como um Proxy que envia requisições do frontend para a porta 8000 do Django, evitando problemas de CORS.*

---

## 🍷 Como Usar o Sistema

### 1. Acesso do Administrador (Gestão de Adega)

Acesse a raiz do frontend (`http://localhost:5173/`). Você cairá na tela de login.
O sistema requesitará um usuário certificado pelo banco do Django.
* *Dica:* Se você acabou de instalar o projeto, pode criar um usuário de adega direto do terminal backend rodando `python manage.py createsuperuser`.

Ao logar, você verá o Dashboard da Vinícola, onde poderá:
* Criar novos lotes de vinho com métricas complexas (Uva, Temperatura, Harmonizações, Quantidade em Estoque, Limite de Alerta).
* Ver painéis dinâmicos de "Alerta de Baixo Estoque".
* Gerar o **QR Code** único para imprimir no rótulo daquela garrafa.

### 2. Acesso do Cliente Final (O Rótulo Digital)

Quando o cliente ler o QR Code com a câmera do celular, ele será levado ao Rótulo Digital animado e sem necessidade de login. Essa tela exibe:
* **Origem:** Dados do terroir, ano de colheita e uva.
* **Timeline de Envelhecimento:** Componente visual calculando a permanência em barril.
* **Guia do Sommelier:** Dicas cadastradas de Temperatura de Serviço, Tempo de Guarda e Harmonização.
* **Dinâmica Visual:** Se o vinho for tinto, o site ficará em tons de Rosé Escuro. Se for branco (ex: *Chardonnay*), a tela brilhará em tons de Ouro.

> **💡 Analytics Automático:** Cada vez que um rótulo digital é aberto por um cliente, o frontend dispara dados passivos para a rota `ScanEvento` do backend, gerando ricas métricas de leitura para o administrador.

---

## 🛠️ Tecnologias Utilizadas

**Frontend:**
* React 18
* Vite
* Tailwind CSS v4 (Design System)
* `qrcode.react`

**Backend:**
* Python 3.8+
* Django 4.2+
* Django REST Framework (DRF)
* `django-cors-headers`
* SQLite (Banco Relacional Padrão)

*Desenvolvido com sofisticação. Aprecie com moderação.*
