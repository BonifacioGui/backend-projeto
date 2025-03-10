const express = require("express");
const mongoose = require("mongoose");
const AlunoDisciplina = require("../models/AlunoDisciplina");
const Disciplina = require("../models/Disciplina");
const Aluno = require("../models/Aluno");

const router = express.Router();

// Função auxiliar para validar IDs
const validarId = (id) => mongoose.Types.ObjectId.isValid(id);

// Função auxiliar para verificar se a disciplina existe
const verificarDisciplina = async (id) => {
  if (!validarId(id)) return null;
  return await Disciplina.findById(id);
};

// Função auxiliar para verificar se o aluno existe
const verificarAluno = async (id) => {
  if (!validarId(id)) return null;
  return await Aluno.findById(id);
};

// 🔹 Criar uma nova disciplina (POST /api/disciplinas)
router.post("/", async (req, res) => {
  try {
    console.log("Corpo da requisição recebido:", req.body); // Log para depuração

    const { nome, codigo, cargaHoraria, email, senha } = req.body;
    console.log("Email recebido:", email);
    console.log("Senha recebida:", senha);

    if (email !== "admin@admin.com" || senha !== "admin") {
      return res.status(403).json({ message: "Acesso negado! Somente administradores podem adicionar disciplinas." });
    }

    if (!nome || !codigo || !cargaHoraria) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    const disciplinaExiste = await Disciplina.findOne({ codigo });
    if (disciplinaExiste) {
      return res.status(400).json({ message: "Disciplina já cadastrada!" });
    }

    const novaDisciplina = new Disciplina({ nome, codigo, cargaHoraria });
    await novaDisciplina.save();

    res.status(201).json(novaDisciplina);
  } catch (error) {
    console.error("Erro ao criar disciplina:", error);
    res.status(500).json({ message: "Erro no servidor", error });
  }
});



// 🔹 Listar todas as disciplinas (GET /api/disciplinas)
router.get("/", async (req, res) => {
  try {
    const disciplinas = await Disciplina.find().populate("alunos");
    res.status(200).json(disciplinas);
  } catch (error) {
    console.error("Erro ao listar disciplinas:", error);
    res.status(500).json({
      message: "Erro ao listar disciplinas",
      error: process.env.NODE_ENV === "development" ? error.message : "Erro interno",
    });
  }
});

// 🔹 Buscar disciplina por ID (GET /api/disciplinas/:id)
router.get("/:id", async (req, res) => {
  try {
    const disciplina = await verificarDisciplina(req.params.id);
    if (!disciplina) {
      return res.status(404).json({ message: "Disciplina não encontrada!" });
    }

    res.json(disciplina);
  } catch (error) {
    console.error("Erro ao buscar disciplina:", error);
    res.status(500).json({
      message: "Erro ao buscar disciplina",
      error: process.env.NODE_ENV === "development" ? error.message : "Erro interno",
    });
  }
});

// 🔹 Atualizar disciplina por ID (PUT /api/disciplinas/:id)
router.put("/:id", async (req, res) => {
  try {
    const { nome, codigo, cargaHoraria } = req.body;

    // Validação de campos obrigatórios
    if (!nome || !codigo || !cargaHoraria) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    const disciplinaAtualizada = await Disciplina.findByIdAndUpdate(
      req.params.id,
      { nome, codigo, cargaHoraria },
      { new: true, runValidators: true }
    );

    if (!disciplinaAtualizada) {
      return res.status(404).json({ message: "Disciplina não encontrada!" });
    }

    res.json(disciplinaAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar disciplina:", error);
    res.status(500).json({
      message: "Erro ao atualizar disciplina",
      error: process.env.NODE_ENV === "development" ? error.message : "Erro interno",
    });
  }
});

// 🔹 Deletar disciplina por ID (DELETE /api/disciplinas/:id)
router.delete("/:id", async (req, res) => {
  try {
    const disciplinaDeletada = await Disciplina.findByIdAndDelete(req.params.id);
    if (!disciplinaDeletada) {
      return res.status(404).json({ message: "Disciplina não encontrada!" });
    }

    res.json({ message: "Disciplina removida com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar disciplina:", error);
    res.status(500).json({
      message: "Erro ao deletar disciplina",
      error: process.env.NODE_ENV === "development" ? error.message : "Erro interno",
    });
  }
});

// 🔹 Associar aluno a disciplina (POST /api/disciplinas/:id/associar)
router.post("/:id/associar", async (req, res) => {
  const { alunoId } = req.body;

  // Verifica se o alunoId foi fornecido
  if (!alunoId) {
    return res.status(400).json({ message: "O campo 'alunoId' é obrigatório!" });
  }

  try {
    // Verifica se a disciplina existe
    const disciplina = await verificarDisciplina(req.params.id);
    if (!disciplina) {
      return res.status(404).json({ message: "Disciplina não encontrada!" });
    }

    // Verifica se o aluno existe
    const aluno = await verificarAluno(alunoId);
    if (!aluno) {
      return res.status(404).json({ message: "Aluno não encontrado!" });
    }

    // Verifica se a associação já existe
    const associacaoExistente = await AlunoDisciplina.findOne({
      alunoId: aluno._id,
      disciplinaId: disciplina._id,
    });

    if (associacaoExistente) {
      return res.status(400).json({ message: "Aluno já associado a essa disciplina!" });
    }

    // Cria a associação no modelo AlunoDisciplina
    const novaAssociacao = new AlunoDisciplina({
      alunoId: aluno._id,
      disciplinaId: disciplina._id,
    });

    await novaAssociacao.save();

    // Adiciona o aluno à lista de alunos da disciplina, se ainda não estiver na lista
    if (!disciplina.alunos.includes(aluno._id)) {
      disciplina.alunos.push(aluno._id);
      await disciplina.save();
    }

    res.status(201).json({
      message: "Aluno associado à disciplina com sucesso!",
      associacao: novaAssociacao,
      disciplina: disciplina,
      aluno: aluno,
    });
  } catch (error) {
    console.error("Erro ao associar aluno à disciplina:", error);
    res.status(500).json({
      message: "Erro ao associar aluno à disciplina",
      error: process.env.NODE_ENV === "development" ? error.message : "Erro interno",
    });
  }
});

// 🔹 Remover aluno da disciplina (DELETE /api/disciplinas/:id/alunos/:alunoId)
router.delete("/:id/alunos/:alunoId", async (req, res) => {
  try {
    const { id, alunoId } = req.params;

    // Verifica se a disciplina existe
    const disciplina = await verificarDisciplina(id);
    if (!disciplina) {
      return res.status(404).json({ message: "Disciplina não encontrada!" });
    }

    // Verifica se o aluno existe
    const aluno = await verificarAluno(alunoId);
    if (!aluno) {
      return res.status(404).json({ message: "Aluno não encontrado!" });
    }

    // Remove o aluno da disciplina
    disciplina.alunos.pull(aluno._id);
    await disciplina.save();

    // Remove a associação no modelo AlunoDisciplina
    await AlunoDisciplina.findOneAndDelete({
      alunoId: aluno._id,
      disciplinaId: disciplina._id,
    });

    res.json({
      message: "Aluno removido da disciplina com sucesso!",
      disciplina: disciplina,
      aluno: aluno,
    });
  } catch (error) {
    console.error("Erro ao remover aluno da disciplina:", error);
    res.status(500).json({
      message: "Erro ao remover aluno da disciplina",
      error: process.env.NODE_ENV === "development" ? error.message : "Erro interno",
    });
  }
});

module.exports = router;
