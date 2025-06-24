# Sistema de Gestão para SG Pequenos Reparos

O **Sistema de Gestão para SG Pequenos Reparos** é uma aplicação web desenvolvida para auxiliar um profissional autônomo (faz-tudo) a organizar sua agenda, apresentar seus serviços e facilitar a comunicação com os clientes. O sistema busca reduzir a perda de oportunidades por falta de organização e melhorar a experiência tanto para o prestador quanto para os solicitantes.

---

## ✨ Funcionalidades

*Cadastro de usuários (clientes e administrador)

*Visualização de tipos de serviços com categorização

*Agendamento de serviços com controle de disponibilidade (conforme itinerário)

*Agenda com visualização por cores/status dos agendamentos

*Histórico completo de serviços realizados

*Filtros por nome, data, status e tipo de serviço

*Sistema de notificações (solicitação, alteração, conclusão e lembretes)

*Cancelamento de serviços com justificativa

*Avaliação de serviços prestados pelos clientes

*Gerenciamento completo de usuários, serviços e itinerário pelo administrador

---

## 👨‍💻 Alunos integrantes da equipe

* Felipe Luiz Parreiras Lima
* Miguel Lima Barcellos
* Gabriel Pedrosa do Carmo Nonato
* Pedro Henrique Silva Vargas
* Henrique Azevedo Flores
* Walter Roberto Rodrigues Louback

---

## 👩‍🏫 Professores responsáveis

* Eveline Alonso Veloso
* Joana Gabriela Ribeiro de Souza
* Ramon Lacerda Marques

---

## ✅ Requisitos para executar

* **Java 24.0.1**
* **Maven 3.8+**
* **Node.js 18+**
* **npm**
* **PostgreSQL 15+**
* **pgAdmin** (opcional)

---
## 📦 Repositório

O repositório oficial do projeto está hospedado no GitHub e pode ser acessado pelo seguinte link:

https://github.com/ICEI-PUC-Minas-PPLES-TI/plf-es-2025-1-ti3-898110-grupo-8-sg.git

## ⚙️ Configuração do Banco de Dados (PostgreSQL)

1. Acesse o pgAdmin ou terminal e execute:

   ```sql
   CREATE USER sg_user WITH PASSWORD 'sg_password';
   CREATE DATABASE sg_reparos OWNER sg_user;
   GRANT ALL PRIVILEGES ON DATABASE sg_reparos TO sg_user;
   ```

2. Verifique se as credenciais estão corretamente configuradas no arquivo `application.properties` localizado em `Codigo/backend/src/main/resources/`:

   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/sg_reparos
   spring.datasource.username=sg_user
   spring.datasource.password=sg_password
   ```

---

## 🔧 Execução do Backend (Java + Spring Boot)

1. Abra um terminal e navegue até o diretório do backend:

   ```bash
   cd Codigo/backend
   ```

2. Compile o projeto com Maven:

   ```bash
   mvn clean install
   ```

3. Execute a aplicação:

   Alternativamente, você pode rodar a classe principal `SgPequenosReparosApplication.java` diretamente pela IDE.

4. O backend ficará acessível em:

   ```
   http://localhost:8080
   ```

---

## 💻 Execução do Frontend (React)

1. No terminal, navegue até o diretório do frontend:

   ```bash
   cd Codigo/frontend/src
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm start
   ```

4. A aplicação estará disponível em:

   ```
   http://localhost:3000
   ```

---

## 📄 Licença

Este projeto está licenciado sob a **Creative Commons Attribution 4.0 International (CC BY 4.0)**.
Para mais detalhes, consulte o arquivo [LICENSE](LICENSE).

---
