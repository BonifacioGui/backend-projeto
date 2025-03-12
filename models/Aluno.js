const mongoose = require("mongoose");

const EnderecoSchema = new mongoose.Schema({
  rua: { type: String, required: true },
  bairro: { type: String, required: true },
  numero: { type: String, required: true },
  cidade: { type: String, required: true },
  cep: { type: String, required: true }
});

const AlunoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  endereco: { type: EnderecoSchema, required: true },  
  dataNascimento: { type: Date, required: true },
  matricula: { type: String, required: true, unique: true },
  telefone: { type: String, required: true },
  curso: { type: String, required: true },
  disciplinas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Disciplina" }]
});

const Aluno = mongoose.model("Aluno", AlunoSchema);
module.exports = Aluno;
