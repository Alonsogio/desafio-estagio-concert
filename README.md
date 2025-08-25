# 🚀 Machines Management System

Sistema completo (Frontend + Backend) para **gerenciamento de máquinas** com cadastro, consulta, atualização de telemetria e visualização em mapa.  
Desenvolvido como desafio técnico, aplicando **boas práticas (SOLID, Clean Code, testes unitários e de integração)**.

---

## 📂 Estrutura do Projeto

├── backend/ (API RESTful em .NET + EF Core)

├── frontend/  (Interface web em Angular)

└── README.md (Documentação principal)

---

## ⚙️ Funcionalidades Implementadas

### Backend (.NET + EF Core)

 **Cadastro de máquinas** com atributos:

  - Identificador único (UUID automático)
  - Nome
  - Localização (string + coordenadas)
  - Status atual (`operating`, `maintenance`, `offline`)

  <br/>

 **Consulta de máquinas**
  - Listagem completa
  - Filtro por status

  <br/>

 **Atualização de telemetria**
  - Endpoint para atualizar localização e status

  <br/>

**Boas práticas**
  - Service Layer (Controller → Service → DbContext)
  - Testes unitários (xUnit + Moq)
  - Testes de integração com banco em memória

### Frontend (Angular + Bootstrap + Leaflet)

 **Dashboard de Máquinas**
  - Lista paginada de máquinas
  - Status destacado com badges coloridas
  - Botões de ações (detalhes, editar telemetria)
  - Mapa interativo (Leaflet + OpenStreetMap)

<br/>

 **Cadastro de Máquinas**
  - Formulário com validações (Angular Forms)
  - Campos obrigatórios, min/max em coordenadas

<br/>

**Detalhes da Máquina**
  - Página individual com informações completas
  - Mapa exibindo a posição da máquina

<br/>

 **Atualização de Telemetria**
  - Modal para alterar localização e status
  
<br/>

 **Estilização**
  - Bootstrap 5 + SCSS modular
  - Interface leve, responsiva e limpa

---

## 🛠️ Tecnologias Utilizadas

### Backend

- .NET 8 (ASP.NET Core Web API)
- Entity Framework Core
- SQLite (dev) / InMemory (testes)
- xUnit + Moq (testes)

### Frontend

- Angular 19
- Bootstrap 5
- Leaflet (mapas interativos)
- TypeScript + SCSS

---

## 🚀 Como Rodar o Projeto

### 🔹 Backend

- cd backend/Machines.Api
- dotnet restore
- dotnet ef database update
- dotnet run

<br/>

### 🔹 Frontend

- cd frontend/machines-frontend
- npm install
- ng serve -o

#### Frontend disponível em: http://localhost:4200

---

<br/>

## 🧪 Testes

### Backend

- ##### Testes unitários (regras de negócio, validações)

- ##### Testes de integração (rotas + banco em memória)


### Rodar testes: 

- cd backend/Machines.Tests
- dotnet test

--- 

<br/>

## 🌍 Funcionalidades Extras

- Exibição de máquinas no mapa com Leaflet + OpenStreetMap

- Badges coloridas para status

- Paginação no dashboard

- Interface responsiva e limpa

---

### 👩‍💻 Autor

Desenvolvido por *Giovanna Alonso* ✨