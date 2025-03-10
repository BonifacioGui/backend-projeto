const mongoose = require("mongoose");

const AlunoDisciplinaSchema = new mongoose.Schema({
  alunoId: { type: mongoose.Schema.Types.ObjectId, ref: "Aluno", required: true },
  disciplinaId: { type: mongoose.Schema.Types.ObjectId, ref: "Disciplina", required: true },
});

const AlunoDisciplina = mongoose.model("AlunoDisciplina", AlunoDisciplinaSchema);
module.exports = AlunoDisciplina;