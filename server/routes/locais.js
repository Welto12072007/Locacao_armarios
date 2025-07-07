import express from 'express';
import * as locaisController from '../controllers/locais.js';

const router = express.Router();

router.get('/', locaisController.getAllLocais);
router.get('/:id', locaisController.getLocalById);
router.post('/', locaisController.createLocal);
router.put('/:id', locaisController.updateLocal);
router.delete('/:id', locaisController.deleteLocal);

export default router;
