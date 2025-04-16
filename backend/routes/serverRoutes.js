import express from 'express';
import { createServer } from '../controllers/serverController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', upload.single('icon'), createServer);

export default router;
