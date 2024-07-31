// import fileQueue from '../queues/queue';
// import File from '../models/file';
// import path from 'path';
// import fs from 'fs';
// import crypto from 'crypto';

// function generateMongoObjectId() {
//   const timestamp = Math.floor(Date.now() / 1000).toString(16);
//   const randomValue = crypto.randomBytes(5).toString('hex');
//   const counter = crypto.randomBytes(3).toString('hex');
//   return timestamp + randomValue + counter;
// }

// // describe('Queue', () => {
// //   it('should process file upload job', async () => {
// //     const jobData = {
// //       userId: generateMongoObjectId(),
// //       name: 'testfile.txt',
// //       buffer: Buffer.from('This is a test file').toString('base64'),
// //       size: 1024,
// //       type: 'text/plain',
// //     };

// //     fileQueue.process(async (job, done) => {
// //       try {
// //         console.log('job data', job.data);
// //         const { userId, name, buffer, size, type } = job.data;

// //         // Convert base64 string back to Buffer
// //         const bufferData = Buffer.from(buffer, 'base64');

// //         const uploadDir = path.join(__dirname, '../uploads', userId);

// //         // Ensure the directory exists
// //         if (!fs.existsSync(uploadDir)) {
// //           fs.mkdirSync(uploadDir, { recursive: true });
// //         }

// //         const filePath = path.join(uploadDir, name);
// //         fs.writeFileSync(filePath, bufferData);

// //         const file = new File({ userId, name, path: filePath, size, type });
// //         await file.save();

// //         processDone();
// //         done();
// //       } catch (error) {
// //         done(error);
// //       }
// //     });

// //     const job = await fileQueue.add(jobData);
// //     const result = await job.finished();

// //     expect(result).toBeUndefined(); // done() does not return a value
// //     const savedFile = await File.findOne({
// //       userId: jobData.userId,
// //       name: jobData.name,
// //     });
// //     expect(savedFile).not.toBeNull();
// //     expect(savedFile).toHaveProperty('name', 'testfile.txt');
// //   });
// // });

// describe('Queue', () => {
//   it('should process file upload job', async (done) => {
//     const jobData = {
//       userId: generateMongoObjectId(),
//       name: 'testfile.txt',
//       buffer: Buffer.from('This is a test file').toString('base64'), // Convert Buffer to base64 string
//       size: 1024,
//       type: 'text/plain',
//     };

//     await fileQueue.add(jobData);

//     fileQueue.process(async (job, processDone) => {
//       try {
//         console.log('job data', job.data);
//         const { userId, name, buffer, size, type } = job.data;

//         // Convert base64 string back to Buffer
//         const bufferData = Buffer.from(buffer, 'base64');

//         const uploadDir = path.join(__dirname, '../uploads', userId);

//         // Ensure the directory exists
//         if (!fs.existsSync(uploadDir)) {
//           fs.mkdirSync(uploadDir, { recursive: true });
//         }

//         const filePath = path.join(uploadDir, name);
//         fs.writeFileSync(filePath, bufferData);
//         console.log(' before save');

//         const file = new File({ userId, name, path: filePath, size, type });
//         console.log(' before after save');
//         // await file.save();
//         console.log('after save');

//         processDone();
//         done(); // Indicate the test is complete
//       } catch (error) {
//         processDone(error);
//         done(error); // Indicate the test is complete with an error
//       }
//     });
//   }, 10000); // Extend the timeout to 10 seconds
// });

import File from '../models/file.js';
import path from 'path';
import fs from 'fs';
import fileQueue from './queue.js';
import crypto from 'crypto';

const __dirname = path.dirname(__filename);

function generateMongoObjectId() {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const randomValue = crypto.randomBytes(5).toString('hex');
  const counter = crypto.randomBytes(3).toString('hex');
  return timestamp + randomValue + counter;
}

describe('Queue', () => {
  it('should process file upload job', async () => {
    const jobData = {
      userId: generateMongoObjectId(),
      name: 'testfile.txt',
      buffer: Buffer.from('This is a test file').toString('base64'), // Convert Buffer to base64 string
      size: 1024,
      type: 'text/plain',
    };

    // Add the job to the queue
    await fileQueue.add(jobData);

    return new Promise((resolve, reject) => {
      fileQueue.process(async (job, processDone) => {
        try {
          console.log('job data', job.data);
          const { userId, name, buffer, size, type } = job.data;

          // Convert base64 string back to Buffer
          const bufferData = Buffer.from(buffer, 'base64');

          const uploadDir = path.join(__dirname, '../uploads', userId);

          // Ensure the directory exists
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const filePath = path.join(uploadDir, name);
          fs.writeFileSync(filePath, bufferData);

          const file = new File({ userId, name, path: filePath, size, type });
          await file.save();

          processDone();
          resolve(); // Resolve the promise to indicate the test is complete
        } catch (error) {
          processDone(error);
          reject(error); // Reject the promise to indicate the test failed
        }
      });
    });
  }, 10000); // Extend the timeout to 10 seconds
});
