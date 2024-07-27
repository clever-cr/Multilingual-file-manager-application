import { request } from 'supertest';
// import app from '../app';// Your Express app
import app from '../server';

import User from '../models/user';
import File from '../models/file';
import path from 'path';
import fs from 'fs';

describe('File Controller', () => {
  let userId;
  beforeEach(async () => {
    const user = await User.create({
      userName: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      language: 'en',
    });
    userId = user._id;
  });

  it('should upload a file', async () => {
    const response = await request(app)
      .post('/api/files')
      .field('userId', userId)
      .field('name', 'testfile.txt')
      .field('size', 1024)
      .field('type', 'text/plain')
      .attach('file', Buffer.from('This is a test file'), 'testfile.txt');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      'message',
      'File uploaded successfully'
    );
    expect(response.body.file).toHaveProperty('name', 'testfile.txt');
  });

  it('should get files for a user', async () => {
    await File.create({
      userId,
      name: 'testfile.txt',
      path: path.join(__dirname, '../uploads', String(userId), 'testfile.txt'),
      size: 1024,
      type: 'text/plain',
    });

    const response = await request(app).get(`/api/files/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('name', 'testfile.txt');
  });
});
