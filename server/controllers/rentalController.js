import {Rental} from '../models/Rental.js';

export const getRentals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    const result = await Rental.findAll(limit, offset, search);

    res.json({
      success: true,
      data: result.rentals,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit)
    });
  } catch (error) {
    console.error('Get rentals error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao carregar locações'
    });
  }
};

export const getRental = async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await Rental.findById(id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Locação não encontrada'
      });
    }

    res.json({
      success: true,
      data: rental
    });
  } catch (error) {
    console.error('Get rental error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao carregar locação'
    });
  }
};

export const createRental = async (req, res) => {
  try {
    const {
      lockerId,
      studentId,
      startDate,
      endDate,
      monthlyPrice,
      totalAmount,
      status,
      paymentStatus,
      notes
    } = req.body;

    if (!lockerId || !studentId || !startDate || !endDate || !monthlyPrice || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: armário, aluno, datas, preço mensal e valor total'
      });
    }

    const rental = await Rental.create({
      locker_id: lockerId,
      student_id: studentId,
      start_date: startDate,
      end_date: endDate,
      monthly_price: monthlyPrice,
      total_amount: totalAmount,
      status: status || 'active',
      payment_status: paymentStatus || 'pending',
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Locação criada com sucesso',
      data: rental
    });
  } catch (error) {
    console.error('Create rental error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar locação'
    });
  }
};

export const updateRental = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      lockerId,
      studentId,
      startDate,
      endDate,
      monthlyPrice,
      totalAmount,
      status,
      paymentStatus,
      notes
    } = req.body;

    const updateData = {
      ...(lockerId && { locker_id: lockerId }),
      ...(studentId && { student_id: studentId }),
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
      ...(monthlyPrice && { monthly_price: monthlyPrice }),
      ...(totalAmount && { total_amount: totalAmount }),
      ...(status && { status }),
      ...(paymentStatus && { payment_status: paymentStatus }),
      ...(notes !== undefined && { notes })
    };

    const rental = await Rental.update(id, updateData);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Locação não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Locação atualizada com sucesso',
      data: rental
    });
  } catch (error) {
    console.error('Update rental error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar locação'
    });
  }
};

export const deleteRental = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Rental.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Locação não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Locação excluída com sucesso'
    });
  } catch (error) {
    console.error('Delete rental error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir locação'
    });
  }
};