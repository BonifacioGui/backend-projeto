const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Aluno = require("../models/Aluno");

exports.criarAluno = async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashSenha = await bcrypt.hash(senha, salt);
    const novoAluno = new Aluno({ nome, email, senha: hashSenha });
    await novoAluno.save();
    res.json(novoAluno);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.loginAluno = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const aluno = await Aluno.findOne({ email });
    if (!aluno) return res.status(404).json({ error: "Aluno não encontrado" });

    const senhaValida = await bcrypt.compare(senha, aluno.senha);
    if (!senhaValida) return res.status(401).json({ error: "Senha inválida" });

    const token = jwt.sign({ id: aluno._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
