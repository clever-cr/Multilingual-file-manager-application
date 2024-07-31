import app from '../server';
import User from '../models/user';
import File from '../models/file';
import path from 'path';
import fs from 'fs';
import fileQueue from '../queues/queue';

jest.mock('fs');
jest.mock('../queues/queue');
jest.mock('bcrypt');

describe('File Controller', () => {
  let userId;

  beforeEach(async () => {
    const user = await User.create({
      userName: 'test',
      email: 'testus@example.com',
      password: 'password123',
      language: 'en',
    });
    userId = user._id;
  });

  afterEach(async () => {
    await User.deleteMany({});
    await File.deleteMany({});
  });

  it('should upload a file', async () => {
    fs.existsSync.mockReturnValue(false);

    fs.mkdirSync.mockReturnValue();

    fs.writeFileSync.mockReturnValue();

    const response = await request(app)
      .post('/files')
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
    expect(fileQueue.add).toHaveBeenCalled();
  });

  it('should get files for a user', async () => {
    await File.create({
      userId,
      name: 'testfile.txt',
      path: path.join(__dirname, '../uploads', String(userId), 'testfile.txt'),
      size: 1024,
      type: 'text/plain',
    });

    const response = await request(app).get(`/files/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('name', 'testfile.txt');
  });
});
