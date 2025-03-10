const mongoose = require("mongoose");

const DisciplinaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  codigo: { type: String, required: true, unique: true },
  cargaHoraria: { type: Number, required: true },  // O campo cargaHoraria é necessário
  alunos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Aluno" }] 
});

const Disciplina = mongoose.model("Disciplina", DisciplinaSchema);
module.exports = Disciplina;