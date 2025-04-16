import express from 'express';
import {
    createServer,
    getUserServers,
    deleteServer,
  } from '../controllers/serverController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', upload.single('icon'), createServer);
  
  router.get('/', getUserServers); 
  router.delete('/:id', deleteServer); 
  
export default router;
