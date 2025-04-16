import express from 'express';
import { createServer } from '../controllers/serverController.js';

const router = express.Router();

router.post('/', createServer); // POST /api/servers

export default router;
