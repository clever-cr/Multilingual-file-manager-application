// import { request } from 'supertest';
// // import app from '../app';// Your Express app
// import app from '../server';

// import User from '../models/user';
// import File from '../models/file';
// import path from 'path';
// import fs from 'fs';

// describe('File Controller', () => {
//   let userId;
//   beforeEach(async () => {
//     const user = await User.create({
//       userName: 'test',
//       email: 'testus@example.com',
//       password: 'password123',
//       language: 'en',
//     });
//     userId = user._id;
//   });

//   it('should upload a file', async () => {
//     const response = await request(app)
//       .post('/files')
//       .field('userId', userId)
//       .field('name', 'testfile.txt')
//       .field('size', 1024)
//       .field('type', 'text/plain')
//       .attach('file', Buffer.from('This is a test file'), 'testfile.txt');

//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty(
//       'message',
//       'File uploaded successfully'
//     );
//     expect(response.body.file).toHaveProperty('name', 'testfile.txt');
//   });

//   it('should get files for a user', async () => {
//     await File.create({
//       userId,
//       name: 'testfile.txt',
//       path: path.join(__dirname, '../uploads', String(userId), 'testfile.txt'),
//       size: 1024,
//       type: 'text/plain',
//     });

//     const response = await request(app).get(`/files/${userId}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveLength(1);
//     expect(response.body[0]).toHaveProperty('name', 'testfile.txt');
//   });
// });

import request from 'supertest'; // Import the request module from supertest
import app from '../server'; // Import the Express app
import User from '../models/user'; // Import the User model
import File from '../models/file'; // Import the File model
import path from 'path'; // Import path module for handling and transforming file paths
import fs from 'fs'; // Import fs module for file system operations
import fileQueue from '../queues/queue'; // Import the fileQueue module

jest.mock('fs'); // Mock the fs module to avoid actual file system operations
jest.mock('../queues/queue'); // Mock the queue to avoid actual queue operations

describe('File Controller', () => {
  let userId; // Variable to hold the user ID

  beforeEach(async () => {
    // Create a test user before each test
    const user = await User.create({
      userName: 'test',
      email: 'testus@example.com',
      password: 'password123',
      language: 'en',
    });
    userId = user._id; // Store the user ID for use in tests
  });

  afterEach(async () => {
    // Clean up the database after each test
    await User.deleteMany({});
    await File.deleteMany({});
  });

  it('should upload a file', async () => {
    // Mock the fs.existsSync method to return false (directory doesn't exist)
    fs.existsSync.mockReturnValue(false);
    // Mock the fs.mkdirSync method to create a directory
    fs.mkdirSync.mockReturnValue();
    // Mock the fs.writeFileSync method to write a file
    fs.writeFileSync.mockReturnValue();

    const response = await request(app)
      .post('/files')
      .field('userId', userId)
      .field('name', 'testfile.txt')
      .field('size', 1024)
      .field('type', 'text/plain')
      .attach('file', Buffer.from('This is a test file'), 'testfile.txt');

    expect(response.status).toBe(201); // Expect the status code to be 201
    expect(response.body).toHaveProperty(
      'message',
      'File uploaded successfully'
    );
    expect(response.body.file).toHaveProperty('name', 'testfile.txt');
    expect(fileQueue.add).toHaveBeenCalled(); // Ensure that the fileQueue.add method was called
  });

  it('should get files for a user', async () => {
    // Create a test file for the user
    await File.create({
      userId,
      name: 'testfile.txt',
      path: path.join(__dirname, '../uploads', String(userId), 'testfile.txt'),
      size: 1024,
      type: 'text/plain',
    });

    const response = await request(app).get(`/files/${userId}`);

    expect(response.status).toBe(200); // Expect the status code to be 200
    expect(response.body).toHaveLength(1); // Expect the response body to have a length of 1
    expect(response.body[0]).toHaveProperty('name', 'testfile.txt');
  });
});
