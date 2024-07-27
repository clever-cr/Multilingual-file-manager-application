import fileQueue from './queue.js';
import File from '../models/file.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

fileQueue.process(async (job, done) => {
  try {
    const { userId, name, buffer, size, type } = job.data;
    const uploadDir = path.join(__dirname, "../uploads", userId);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, name);
    fs.writeFileSync(filePath, buffer);

    const file = new File({ userId, name, path: filePath, size, type });
    await file.save();

    job.progress(100); // Update progress
    done();
  } catch (error) {
    done(error);
  }
});
