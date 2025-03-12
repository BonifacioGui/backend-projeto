Sistema de Gerenciamento de Alunos e Disciplinas (Backend)
Este projeto é o backend de um sistema de gerenciamento de alunos e disciplinas, desenvolvido com Node.js, Express e MongoDB. Ele fornece uma API RESTful para o frontend, permitindo o cadastro, edição, exclusão e consulta de alunos e disciplinas, além de gerenciar matrículas de alunos em disciplinas.

Funcionalidades
Rotas da API
Alunos:

POST /api/alunos/register: Cadastra um novo aluno.

POST /api/alunos/login: Realiza o login do aluno e retorna um token JWT.

GET /api/alunos/: Lista todos os alunos (protegido por token).

GET /api/alunos/:id: Busca um aluno pelo ID (protegido por token).

PUT /api/alunos/:id: Atualiza os dados de um aluno (protegido por token).

DELETE /api/alunos/:id: Remove um aluno (protegido por token).

Disciplinas:

POST /api/disciplinas/: Cadastra uma nova disciplina (somente admin).

GET /api/disciplinas/: Lista todas as disciplinas.

GET /api/disciplinas/:id: Busca uma disciplina pelo ID.

PUT /api/disciplinas/:id: Atualiza os dados de uma disciplina.

DELETE /api/disciplinas/:id: Remove uma disciplina.

POST /api/disciplinas/:id/associar: Associa um aluno a uma disciplina.

DELETE /api/disciplinas/:id/alunos/:alunoId: Remove um aluno de uma disciplina.

Tecnologias Utilizadas
Node.js: Ambiente de execução JavaScript.

Express: Framework para construção de APIs.

MongoDB: Banco de dados NoSQL para armazenamento de dados.

Mongoose: Biblioteca para modelagem de dados do MongoDB.

JWT (JSON Web Tokens): Para autenticação e gerenciamento de sessões.

Bcrypt: Para criptografia de senhas.

CORS: Para permitir requisições de diferentes origens.

Dotenv: Para gerenciamento de variáveis de ambiente.

Estrutura do Projeto
Diretórios e Arquivos
server.js: Ponto de entrada do servidor, configuração do Express e conexão com o MongoDB.

routes/: Contém as rotas da API para alunos e disciplinas.

alunoRoutes.js: Rotas relacionadas aos alunos.

disciplinaRoutes.js: Rotas relacionadas às disciplinas.

models/: Contém os modelos de dados para alunos, disciplinas e associações.

Aluno.js: Modelo de dados para alunos.

Disciplina.js: Modelo de dados para disciplinas.

AlunoDisciplina.js: Modelo de dados para associações entre alunos e disciplinas.

Matricula.js: Modelo de dados para matrículas de alunos em disciplinas.

controllers/: Contém os controladores para manipulação de dados.

alunoController.js: Controlador para operações relacionadas aos alunos.

disciplinaController.js: Controlador para operações relacionadas às disciplinas.

Como Executar o Backend
Instale as dependências:

cd backend
npm install
Configure as variáveis de ambiente:
Crie um arquivo .env na raiz do backend e adicione as seguintes variáveis:


MONGO_URI=mongodb+srv://admin:admin@cluster0.itb9q.mongodb.net/escolaDB?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=4f8e5a2c8f6a0d8b1a7e0c2d4e6f9b3c1d5e7a8f0b9c2d4e6f7a8b9c0d1e2f3
PORT=5000
Inicie o servidor:

npm start
Observações
O backend está configurado para rodar na porta 5000.