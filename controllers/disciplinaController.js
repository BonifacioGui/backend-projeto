const Disciplina = require("../models/Disciplina");

exports.criarDisciplina = async (req, res) => {
  const { nome, codigo, cargaHoraria } = req.body; 

  try {
    // Verifica se a disciplina já existe pelo código
    const disciplinaExistente = await Disciplina.findOne({ codigo });

    if (disciplinaExistente) {
      return res.status(400).json({ message: "Disciplina já cadastrada!" });
    }

    // Criação da nova disciplina
    const novaDisciplina = new Disciplina({ nome, codigo, cargaHoraria });

    // Salvando a disciplina no banco de dados
    await novaDisciplina.save();
    
    // Retorna a disciplina criada
    res.status(201).json(novaDisciplina);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};