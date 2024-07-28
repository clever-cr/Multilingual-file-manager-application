import express from 'express';
import {
  createFile,
  readFiles,
  updateFile,
  deleteFile,
} from '../controllers/fileController.js';
import upload from '../config/multerConfig.js';

const router = express.Router();

/**
 * @swagger
 * /files:
 *   post:
 *     summary: Upload a file
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               userId:
 *                 type: string
 *               name:
 *                 type: string
 *               size:
 *                 type: integer
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: Error saving file
 */
router.post('/files', upload.single('file'), createFile);

/**
 * @swagger
 * /files/{userId}:
 *   get:
 *     summary: Get all files for a user
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of files
 *       400:
 *         description: Error retrieving files
 */
router.get('/files/:userId', readFiles);

/**
 * @swagger
 * /files/{fileId}:
 *   put:
 *     summary: Update a file
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: File updated successfully
 *       400:
 *         description: Error updating file
 */
router.put('/files/:fileId', updateFile);

/**
 * @swagger
 * /files/{fileId}:
 *   delete:
 *     summary: Delete a file
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: File deleted successfully
 *       400:
 *         description: Error deleting file
 */
router.delete('/files/:fileId', deleteFile);

export default router;
