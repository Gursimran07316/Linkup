import express from 'express';
import {
    createServer,
    getUserServers,
    deleteServer,
    addChannel,
    getServerByInvite,
    joinServer,
    kickMember  } from '../controllers/serverController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', upload.single('icon'), createServer);  
router.get('/', getUserServers); 
router.delete('/:id', deleteServer); 
router.post('/channel', addChannel);
router.get('/invite/:code', getServerByInvite);
router.post('/join/:code', joinServer);
router.put('/:serverId/kick/:userId', kickMember);
export default router;
