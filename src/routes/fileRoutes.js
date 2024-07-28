import express from 'express';
import {
  createFile,
  readFiles,
  updateFile,
  deleteFile,
} from '../controllers/fileController.js';
import upload from '../config/multerConfig.js';

const router = express.Router();

router.post('/files', upload.single('file'), createFile);
router.get('/files/:userId', readFiles);
router.put('/files/:fileId', updateFile);
router.delete('/files/:fileId', deleteFile);

export default router;
