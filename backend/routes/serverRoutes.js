import express from 'express';
import {
    createServer,
    getUserServers,
    deleteServer,
    addChannel
  } from '../controllers/serverController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', upload.single('icon'), createServer);
  
  router.get('/', getUserServers); 
  router.delete('/:id', deleteServer); 
  router.post('/channel', addChannel);
export default router;
