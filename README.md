# Consultório Médico API

Bem-vindo ao projeto Consultório Médico API da Cubos! Este é um MVP (Produto Viável Mínimo) de uma RESTful API para gerenciar consultas médicas em um consultório.

## Estrutura do Projeto

O projeto está estruturado da seguinte forma:

src/
controladores

// Seus controladores vão aqui //

bancodedados.js
rotas.js
index.js

markdown


- **controladores:** Contém os controladores responsáveis por lidar com a lógica de negócios.
- **bancodedados.js:** Arquivo que simula a persistência dos dados em memória.
- **rotas.js:** Define as rotas da API.
- **index.js:** Ponto de entrada da aplicação.

## Requisitos

- Node.js
- npm ou yarn

## Instalação

1. Clone o repositório:

```
git clone https://github.com/LeooAndrade/consultadas
````
2. Instale as dependências:
````

cd seu-repositorio
npm install
# ou
yarn install
````
3. Executando a Aplicação
````

npm start
# ou
yarn start
A API estará disponível em http://localhost:3000 por padrão.
````

Endpoints
````
Listar consultas médicas
GET /consultas?cnes_consultorio=1001&senha_consultorio=CubosHealth@2022


#Criar consulta médica#
POST /consulta


#Atualizar os dados de uma consulta médica#
PUT /consulta/:identificadorConsulta/paciente

#Excluir uma consulta médica#
DELETE /consulta/:identificadorConsulta


#Finalizar uma consulta médica#
POST /consulta/finalizar


#Listar o laudo de uma consulta#
GET /consulta/laudo?identificador_consulta=1&senha=1234

#Listar as consultas que um médico atendeu#
GET /consultas/medico?identificador_medico=1
````

##Status Code##
200 (OK): Requisição bem-sucedida.
201 (Created): Requisição bem-sucedida e algo foi criado.
204 (No Content): Requisição bem-sucedida, sem conteúdo no corpo da resposta.
400 (Bad Request): O servidor não entendeu a requisição.
401 (Unauthorized): O usuário não está autenticado.
403 (Forbidden): O usuário não tem permissão de acessar o recurso solicitado.
404 (Not Found): O servidor não pode encontrar o recurso solicitado.
500 (Internal Server Error): Falhas causadas pelo servidor.
