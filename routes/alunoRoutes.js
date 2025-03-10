const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Aluno = require("../models/Aluno");

const router = express.Router();

// 🔹 Middleware para autenticação (protege as rotas)
const verificarToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Acesso negado! Token não fornecido." });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.alunoId = decoded.id;
    next();
  } catch (error) {
    res.status(400).json({ message: "Token inválido!" });
  }
};


// 🔹 Criar um novo aluno (NÃO PROTEGIDO)
router.post("/register", async (req, res) => {
  try {
    const {
      nome,
      endereco,
      dataNascimento,
      matricula,
      telefone,
      email,
      curso,
      senha,
    } = req.body;

    // Verifica se o aluno já está cadastrado
    const alunoExiste = await Aluno.findOne({ email });
    if (alunoExiste) {
      return res.status(400).json({ message: "Aluno já cadastrado!" });
    }

    // Validação dos campos obrigatórios
    if (!nome || !endereco || !dataNascimento || !matricula || !telefone || !email || !curso || !senha) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // Cria o novo aluno
    const novoAluno = new Aluno({
      nome,
      endereco,
      dataNascimento,
      matricula,
      telefone,
      email,
      curso,
      senha: senhaHash,
    });

    // Salva o aluno no banco de dados
    await novoAluno.save();

    // Retorna o aluno cadastrado (sem a senha)
    const alunoCadastrado = { ...novoAluno.toObject() };
    delete alunoCadastrado.senha;

    res.status(201).json({
      message: "Aluno cadastrado com sucesso!",
      aluno: alunoCadastrado,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error });
  }
});

// 🔹 Login de aluno (ou admin)
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const aluno = await Aluno.findOne({ email });
    if (!aluno) return res.status(404).json({ message: "Aluno não encontrado!" });

    const senhaValida = await bcrypt.compare(senha, aluno.senha);
    if (!senhaValida) return res.status(401).json({ message: "Senha inválida!" });

    const isAdmin = email === "admin@admin.com"; // Verifica se é admin

    const token = jwt.sign({ id: aluno._id, isAdmin }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Retorna o alunoId, token e se é admin
    res.json({ alunoId: aluno._id, token, isAdmin });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error });
  }
});


// 🔹 Listar todos os alunos (PROTEGIDO)
router.get("/", verificarToken, async (req, res) => {
  try {
    const alunos = await Aluno.find()
      .select("-senha")
      .populate("disciplinas");

    res.json(alunos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar alunos", error });
  }
});

// 🔹 Buscar um aluno por ID (PROTEGIDO)
router.get("/:id", verificarToken, async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id).select("-senha");
    if (!aluno) return res.status(404).json({ message: "Aluno não encontrado!" });

    res.json(aluno);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar aluno", error });
  }
});

// 🔹 Atualizar aluno por ID (PROTEGIDO)
router.put("/:id", verificarToken, async (req, res) => {
  try {
    const { nome, email } = req.body;
    const alunoAtualizado = await Aluno.findByIdAndUpdate(
      req.params.id,
      { nome, email },
      { new: true, runValidators: true }
    ).select("-senha");

    if (!alunoAtualizado) return res.status(404).json({ message: "Aluno não encontrado!" });

    res.json(alunoAtualizado);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar aluno", error });
  }
});

// 🔹 Deletar aluno por ID (PROTEGIDO)
router.delete("/:id", verificarToken, async (req, res) => {
  try {
    const alunoDeletado = await Aluno.findByIdAndDelete(req.params.id);
    if (!alunoDeletado) return res.status(404).json({ message: "Aluno não encontrado!" });

    res.json({ message: "Aluno removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar aluno", error });
  }
});

module.exports = router;