import express from 'express';
import {
  getAllLocais,
  getLocalById,
  createLocal,
  updateLocal,
  deleteLocal
} from '../controllers/locais.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllLocais);
router.get('/:id', getLocalById);
router.post('/', createLocal);
router.put('/:id', updateLocal);
router.delete('/:id', deleteLocal);

export default router;
