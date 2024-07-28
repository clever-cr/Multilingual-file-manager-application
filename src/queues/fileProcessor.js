import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import File from '../models/file.js';
import fileQueue from './queue.js';

const __dirname = path.dirname(__filename);

fileQueue.process(async (job, done) => {
  try {
    const { userId, name, buffer, size, type } = job.data;
    const uploadDir = path.join(__dirname, '../uploads', userId);

    // Convert base64 string back to buffer
    const bufferData = Buffer.from(buffer, 'base64');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, name);
    fs.writeFileSync(filePath, bufferData);

    console.log(`File processed: ${name}, Path: ${filePath}`);

    const file = new File({ userId, name, path: filePath, size, type });
    console.log('Saving file to database...');
    await file.save();
    console.log('File saved to database successfully');

    job.progress(100); // Update progress
    console.log(`Job completed for file: ${name}`);
    done();
  } catch (error) {
    console.error('Error processing file:', error);
    done(error);
  }
});
