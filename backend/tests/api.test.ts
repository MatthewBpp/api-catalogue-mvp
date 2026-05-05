import request from 'supertest';
import app from '../src/app';

describe('API catalogue', () => {
  it('rejects invalid user number', async () => {
    const res = await request(app).get('/apis');
    expect(res.status).toBe(401);
  });

  it('allows valid viewer to list APIs', async () => {
    const res = await request(app)
      .get('/apis')
      .set('x-user-number', '11223344'); // viewer
    expect(res.status).toBe(200);
  });
});


//This tells TypeScript: “Every Express Request may have a user object with id, email, and groups.”