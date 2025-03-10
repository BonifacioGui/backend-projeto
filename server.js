const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Importação das rotas
dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite o uso de JSON no body das requisições

const alunoRoutes = require("./routes/alunoRoutes");
const disciplinaRoutes = require("./routes/disciplinaRoutes");

// Conectar ao MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas conectado com sucesso!"))
  .catch(err => console.error("❌ Erro ao conectar ao MongoDB:", err));

// Definição das rotas
app.use("/api/alunos", alunoRoutes);
app.use("/api/disciplinas", disciplinaRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));