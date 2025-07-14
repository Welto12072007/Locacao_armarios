import express from 'express';
import {
  getRentals,
  getRental,
  createRental,
  updateRental,
  deleteRental
} from '../controllers/rentalController.js';
import { Rental } from '../models/Rental.js';

const router = express.Router();

// Get all rentals with pagination and search
router.get('/', getRentals);

// Get rental stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await Rental.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get rental stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao carregar estatísticas'
    });
  }
});

// Get rentals by student
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const rentals = await Rental.findByStudentId(studentId);
    
    res.json({
      success: true,
      data: rentals
    });
  } catch (error) {
    console.error('Get rentals by student error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao carregar locações do aluno'
    });
  }
});

// Get rentals by locker
router.get('/locker/:lockerId', async (req, res) => {
  try {
    const { lockerId } = req.params;
    const rentals = await Rental.findByLockerId(lockerId);
    
    res.json({
      success: true,
      data: rentals
    });
  } catch (error) {
    console.error('Get rentals by locker error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao carregar locações do armário'
    });
  }
});

// Get single rental
router.get('/:id', getRental);

// Create new rental
router.post('/', createRental);

// Update rental
router.put('/:id', updateRental);

// Delete rental
router.delete('/:id', deleteRental);

export default router;