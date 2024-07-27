import request from 'supertest';
import app from '../server';
import User from '../models/user';

describe('Auth Controller', () => {
  it('should register a new user', async () => {
    const response = await request(app).post('/api/auth/register').send({
      userName: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      language: 'en',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('username', 'testuser');
    expect(response.body).toHaveProperty('email', 'test@example.com');
  });

  it('should not register a user with existing email', async () => {
    await User.create({
      userName: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      language: 'en',
    });

    const response = await request(app).post('/api/auth/register').send({
      userName: 'anotheruser',
      email: 'test@example.com',
      password: 'password123',
      language: 'en',
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'User already exists');
  });
});
