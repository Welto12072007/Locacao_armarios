import * as locaisModel from '../models/locais.js';

export async function getAllLocais(req, res) {
  try {
    const locais = await locaisModel.findAll();
    res.status(200).json(locais);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getLocalById(req, res) {
  try {
    const { id } = req.params;
    const local = await locaisModel.findById(id);
    if (!local) return res.status(404).json({ error: 'Local não encontrado' });
    res.status(200).json(local);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createLocal(req, res) {
  try {
    const { nome, descricao } = req.body;
    if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });

    const novoLocal = { nome, descricao };
    const localCriado = await locaisModel.create(novoLocal);
    res.status(201).json(localCriado);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Nome do local já existe' });
    }
    res.status(500).json({ error: error.message });
  }
}

export async function updateLocal(req, res) {
  try {
    const { id } = req.params;
    const { criado_em, ...dadosAtualizacao } = req.body;

    const localAtualizado = await locaisModel.update(id, dadosAtualizacao);
    if (!localAtualizado) return res.status(404).json({ error: 'Local não encontrado' });
    res.status(200).json(localAtualizado);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Nome do local já existe' });
    }
    res.status(500).json({ error: error.message });
  }
}

export async function deleteLocal(req, res) {
  try {
    const { id } = req.params;
    const localDeletado = await locaisModel.remove(id);
    if (!localDeletado) return res.status(404).json({ error: 'Local não encontrado' });
    res.status(200).json({ message: 'Local deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
