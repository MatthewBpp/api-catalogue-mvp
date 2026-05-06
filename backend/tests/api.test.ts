// Set environment variables before importing app to avoid initialization errors
process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key-12345678901234567890123456789012';
import { Request } from 'express';

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

  describe('CRUD operations with different permission levels', () => {
    const viewerNumber = '11223344'; // viewer only, no api_catalogue_group
    const creatorNumber = '12345678'; // api_catalogue_group member

    const newApiPayload = {
      name: 'Test API',
      base_url: 'https://api.example.com/test',
      version: 'v1',
      lifecycle: 'development',
      description: 'A test API',
      tags: ['test', 'dev'],
      team: 'Platform',
      openapi_path: '/openapi.json'
    };

    it('viewer cannot create an API (403 Forbidden)', async () => {
      const res = await request(app)
        .post('/apis')
        .set('x-user-number', viewerNumber)
        .send(newApiPayload);

      expect(res.status).toBe(403);
      expect(res.body.error).toBeDefined();
      expect(res.body.error).toContain('permission');
    });

    it('creator can create an API (201 Created)', async () => {
      const res = await request(app)
        .post('/apis')
        .set('x-user-number', creatorNumber)
        .send(newApiPayload);

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe(newApiPayload.name);
      expect(res.body.owner_id).toBeDefined();
    });

    it('viewer cannot update an API (403 Forbidden)', async () => {
      const res = await request(app)
        .put('/apis/non-existent-id')
        .set('x-user-number', viewerNumber)
        .send({ name: 'Updated Name' });

      expect(res.status).toBe(403);
    });

    it('viewer cannot delete an API (403 Forbidden)', async () => {
      const res = await request(app)
        .delete('/apis/non-existent-id')
        .set('x-user-number', viewerNumber);

      expect(res.status).toBe(403);
    });
  });

  describe('Error handling edge cases', () => {
    it('rejects request with missing x-user-number header (401)', async () => {
      const res = await request(app)
        .get('/apis')
        .set('X-Custom-Preflight', 'true');

      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Missing');
    });

    it('rejects unrecognised user number (401)', async () => {
      const res = await request(app)
        .get('/apis')
        .set('x-user-number', '999999999'); // non-existent user

      expect(res.status).toBe(401);
      expect(res.body.error).toContain('not recognised');
    });

    it('returns 404 when fetching non-existent API', async () => {
      const res = await request(app)
        .get('/apis/00000000-0000-0000-0000-000000000000')
        .set('x-user-number', '11223344');

      expect(res.status).toBe(404);
      expect(res.body.error).toContain('not found');
    });

    it('returns 404 when updating non-existent API', async () => {
      const res = await request(app)
        .put('/apis/00000000-0000-0000-0000-000000000000')
        .set('x-user-number', '12345678')
        .send({ name: 'Updated' });

      expect(res.status).toBe(404);
    });

    it('returns 404 when deleting non-existent API', async () => {
      const res = await request(app)
        .delete('/apis/00000000-0000-0000-0000-000000000000')
        .set('x-user-number', '12345678');

      expect(res.status).toBe(404);
    });

    it('validates auth/validate endpoint rejects unknown user', async () => {
      const res = await request(app)
        .get('/auth/validate')
        .set('x-user-number', '999999999');

      expect(res.status).toBe(401);
      expect(res.body.error).toContain('not recognised');
    });

    it('validates auth/validate endpoint accepts known user', async () => {
      const res = await request(app)
        .get('/auth/validate')
        .set('x-user-number', '11223344');

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.user_number).toBe('11223344');
    });
  });
});


//This tells TypeScript: “Every Express Request may have a user object with id, email, and groups.”