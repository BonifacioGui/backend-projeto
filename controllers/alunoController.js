const Aluno = require("../models/Aluno");
const AlunoDisciplina = require("../models/AlunoDisciplina");

// Listar todos os alunos com suas disciplinas matriculadas
exports.listarAlunosComDisciplinas = async (req, res) => {
  try {
    // Busca todos os alunos (excluindo a senha)
    const alunos = await Aluno.find().select("-senha");

    // Para cada aluno, busca as disciplinas matriculadas
    const alunosComDisciplinas = await Promise.all(
      alunos.map(async (aluno) => {
        // Busca as matrículas do aluno
        const matriculas = await AlunoDisciplina.find({ alunoId: aluno._id }).populate("disciplinaId");

        // Extrai as disciplinas das matrículas
        const disciplinas = matriculas.map((matricula) => matricula.disciplinaId);

        // Retorna o aluno com as disciplinas
        return {
          ...aluno.toObject(),
          disciplinas: disciplinas || [], // Retorna array vazio se não houver disciplinas
        };
      })
    );

    res.status(200).json(alunosComDisciplinas);
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    res.status(500).json({ error: "Erro ao buscar alunos." });
  }
};