import File from '../models/file.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fileQueue from '../queues/queue.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createFile = async (req, res) => {
  try {
    const { userId, name, size, type } = req.body;
    const uploadDir = path.join(__dirname, '../uploads', userId);
    const buffer = req.file.buffer;

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, name);
    fs.writeFileSync(filePath, req.file.buffer);
    fileQueue.add({ userId, name, buffer, size, type });

    const file = new File({ userId, name, path: filePath, size, type });
    await file.save();
    res
      .status(201)
      .json({ message: req.t('file_uploaded_successfully'), file });
  } catch (error) {
    res
      .status(400)
      .json({ error: req.t('error_saving_file'), details: error.message });
  }
};

export const readFiles = async (req, res) => {
  try {
    const files = await File.find({ userId: req.params.userId });
    res.status(200).json(files);
  } catch (error) {
    res
      .status(400)
      .json({ error: req.t('error_retrieving_files'), details: error.message });
  }
};

export const updateFile = async (req, res) => {
  try {
    const file = await File.findByIdAndUpdate(req.params.fileId, req.body, {
      new: true,
    });
    res.status(200).json(file);
  } catch (error) {
    res
      .status(400)
      .json({ error: req.t('error_updating_file'), details: error.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (file) {
      fs.unlinkSync(file.path);
      await File.findByIdAndDelete(req.params.fileId);
    }
    res.status(204).send();
  } catch (error) {
    res
      .status(400)
      .json({ error: req.t('error_deleting_file'), details: error.message });
  }
};
