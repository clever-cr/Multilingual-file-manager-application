// import File from "../models/file.js";
// import path from "path";
// import fs from "fs";

// export const createFile = async (req, res) => {
//   try {
//     const { userId, name, size, type } = req.body;
//     const filePath = path.join(__dirname, "../uploads", userId, name);
//     fs.writeFileSync(filePath, req.file.buffer);

//     const file = new File({ userId, name, path: filePath, size, type });
//     await file.save();
//     res.status(201).json(file);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// export const readFiles = async (req, res) => {
//   try {
//     const files = await File.find({ userId: req.params.userId });
//     res.status(200).json(files);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// export const updateFile = async (req, res) => {
//   try {
//     const file = await File.findByIdAndUpdate(req.params.fileId, req.body, {
//       new: true,
//     });
//     res.status(200).json(file);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// export const deleteFile = async (req, res) => {
//   try {
//     await File.findByIdAndDelete(req.params.fileId);
//     res.status(204).send();
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };


import File from '../models/file.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Define __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createFile = async (req, res) => {
  try {
    const { userId, name, size, type } = req.body;
    const uploadDir = path.join(__dirname, '../uploads', userId);

    // Ensure the directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, name);
    fs.writeFileSync(filePath, req.file.buffer);

    const file = new File({ userId, name, path: filePath, size, type });
    await file.save();
    res.status(201).json(file);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const readFiles = async (req, res) => {
  try {
    const files = await File.find({ userId: req.params.userId });
    res.status(200).json(files);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateFile = async (req, res) => {
  try {
    const file = await File.findByIdAndUpdate(req.params.fileId, req.body, {
      new: true,
    });
    res.status(200).json(file);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
    res.status(400).json({ error: error.message });
  }
};
