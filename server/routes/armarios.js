import express from 'express';
import { listarArmarios } from '../controllers/armarios';

const router = express.Router();

router.get('/', listarArmarios);

export default router;
