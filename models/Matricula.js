const mongoose = require("mongoose");

const MatriculaSchema = new mongoose.Schema({
  alunoId: { type: mongoose.Schema.Types.ObjectId, ref: "Aluno", required: true }, // Referência ao aluno
  disciplinaId: { type: mongoose.Schema.Types.ObjectId, ref: "Disciplina", required: true }, // Referência à disciplina
});

const Matricula = mongoose.model("Matricula", MatriculaSchema);
module.exports = Matricula;