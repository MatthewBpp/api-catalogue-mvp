import express, { type Application } from 'express';
import cors from 'cors';
import { supabase } from './supabaseClient';
import { authMiddleware, requireCatalogueGroup } from './authMiddleware';
import { listApis } from './apiService';

const app: Application = express();

/**
 * FIX 1 — Configure CORS to allow requests from the frontend
 */
app.use(cors({
  origin: [
    /^https:\/\/.*-5173\.app\.github\.dev$/,  // frontend
    /^https:\/\/.*-4000\.app\.github\.dev$/   // backend
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-user-number', 'x-Custom-Preflight']

}));

/**
 * FIX 2 — Let CORS handle OPTIONS preflight
 * (This must run BEFORE authMiddleware)
 */
app.options(/.*/, cors());

app.use(express.json());

/**
 * FIX 3 — Auth middleware must come AFTER CORS preflight
 */
app.use(authMiddleware);

// List & search
app.get('/apis', async (req, res) => {
  try {
    const { q, tag } = req.query;
    const apis = await listApis(
      q ? String(q) : undefined,
      tag ? String(tag) : undefined
    );
    res.json(apis);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch APIs' });
  }
});

// Create (requires catalogue group)
app.post('/apis', requireCatalogueGroup, async (req, res) => {
  try {
    const userId = req.user!.id;
    const body = req.body;

    const payload = {
      ...body,
      owner_id: userId,
      tags: Array.isArray(body.tags) ? body.tags : []
    };

    const { data, error } = await supabase
      .from('apis')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create API' });
  }
});

// Update (requires catalogue group + ownership)
app.put('/apis/:id', requireCatalogueGroup, async (req, res) => {
  try {
    const apiId = req.params.id;
    const userId = req.user!.id;

    const { data: api, error: fetchError } = await supabase
      .from('apis')
      .select('owner_id')
      .eq('id', apiId)
      .single();

    if (fetchError || !api) {
      return res.status(404).json({ error: 'API not found' });
    }

    if (api.owner_id !== userId) {
      return res.status(403).json({ error: 'Not authorised to update this API' });
    }

    const body = req.body;

    const payload = {
      ...body,
      tags: Array.isArray(body.tags) ? body.tags : []
    };

    const { data, error } = await supabase
      .from('apis')
      .update(payload)
      .eq('id', apiId)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: 'Failed to update API' });
  }
});

// Delete (requires catalogue group + ownership)
app.delete('/apis/:id', requireCatalogueGroup, async (req, res) => {
  try {
    const apiId = req.params.id;
    const userId = req.user!.id;

    const { data: api, error: fetchError } = await supabase
      .from('apis')
      .select('owner_id')
      .eq('id', apiId)
      .single();

    if (fetchError || !api) {
      return res.status(404).json({ error: 'API not found' });
    }

    if (api.owner_id !== userId) {
      return res.status(403).json({ error: 'Not authorised to delete this API' });
    }

    const { error } = await supabase
      .from('apis')
      .delete()
      .eq('id', apiId);

    if (error) throw error;
    res.status(204).send();
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: 'Failed to delete API' });
  }
});

export default app;
