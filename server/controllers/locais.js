import { Local } from '../models/locais.js';

// Helper para formatar dados
const transformLocalData = (local) => {
  if (!local) return null;
  return {
    id: local.id,
    nome: local.nome,
    descricao: local.descricao,
    criado_em: local.criado_em
  };
};

// GET /api/locais
export const getAllLocais = async (req, res) => {
  try {
    const locais = await Local.findAll();
    res.json({
      success: true,
      data: locais.map(transformLocalData)
    });
  } catch (error) {
    console.error('Erro ao buscar locais:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar locais' });
  }
};

// GET /api/locais/:id
export const getLocalById = async (req, res) => {
  try {
    const { id } = req.params;
    const local = await Local.findById(id);

    if (!local) {
      return res.status(404).json({ success: false, message: 'Local não encontrado' });
    }

    res.json({ success: true, data: transformLocalData(local) });
  } catch (error) {
    console.error('Erro ao buscar local:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar local' });
  }
};

// POST /api/locais
export const createLocal = async (req, res) => {
  try {
    const { nome, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({ success: false, message: 'O campo "nome" é obrigatório' });
    }

    const existing = await Local.findByNome(nome);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Nome de local já existe' });
    }

    const novoLocal = await Local.create({ nome, descricao });

    res.status(201).json({
      success: true,
      message: 'Local criado com sucesso',
      data: transformLocalData(novoLocal)
    });
  } catch (error) {
    console.error('Erro ao criar local:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar local' });
  }
};

// PUT /api/locais/:id
export const updateLocal = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    const localAtualizado = await Local.update(id, { nome, descricao });

    if (!localAtualizado) {
      return res.status(404).json({ success: false, message: 'Local não encontrado' });
    }

    res.json({
      success: true,
      message: 'Local atualizado com sucesso',
      data: transformLocalData(localAtualizado)
    });
  } catch (error) {
    console.error('Erro ao atualizar local:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar local' });
  }
};

// DELETE /api/locais/:id
export const deleteLocal = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Local.delete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Local não encontrado' });
    }

    res.json({ success: true, message: 'Local excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir local:', error);
    res.status(500).json({ success: false, message: 'Erro ao excluir local' });
  }
};
