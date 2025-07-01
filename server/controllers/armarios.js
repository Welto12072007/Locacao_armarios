import { db } from '../config/database.js';

export const listarArmarios = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM armarios');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao listar armários:', error);
    res.status(500).json({ message: 'Erro interno ao buscar armários.' });
  }
};
