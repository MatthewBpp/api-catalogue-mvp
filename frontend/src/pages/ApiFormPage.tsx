import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch, getUserNumber } from '../apiClient';

type ApiRecord = {
  id?: string;
  name: string;
  base_url: string;
  version: string;
  lifecycle: string;
  description: string;
  tags: string[] | null;
  team: string;
  openapi_path: string;
};

type ApiFormPageProps = {
  mode: 'create' | 'edit';
};

const lifecycleOptions = [
  'design',
  'development',
  'production',
  'deprecated'
];

const ApiFormPage: React.FC<ApiFormPageProps> = ({ mode }) => {
  const [form, setForm] = useState<ApiRecord>({
    name: '',
    base_url: '',
    version: '',
    lifecycle: 'design',
    description: '',
    tags: [],
    team: '',
    openapi_path: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(mode === 'edit');
  const navigate = useNavigate();
  const { id } = useParams();

  // Load existing API when editing
  useEffect(() => {
    const userNumber = getUserNumber();
    if (!userNumber) {
      navigate('/login');
      return;
    }

    if (mode === 'edit' && id) {
      const fetchApi = async () => {
        try {
          setLoading(true);

          const data = await apiFetch(`/apis?q=${id}`);
          const api = Array.isArray(data)
            ? data.find((a: any) => a.id === id)
            : data;

          if (!api) {
            setError('API not found');
            return;
          }

          setForm({
            id: api.id,
            name: api.name,
            base_url: api.base_url,
            version: api.version,
            lifecycle: api.lifecycle,
            description: api.description || '',
            tags: api.tags || [],
            team: api.team || '',
            openapi_path: api.openapi_path || ''
          });
        } catch (err: any) {
          setError(err.message || 'Failed to load API');
        } finally {
          setLoading(false);
        }
      };

      fetchApi();
    }
  }, [mode, id, navigate]);

  // Handle input changes
  const handleChange = (field: keyof ApiRecord, value: string) => {
    if (field === 'tags') {
      setForm(prev => ({
        ...prev,
        tags: value
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
      }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        name: form.name,
        base_url: form.base_url,
        version: form.version,
        lifecycle: form.lifecycle,
        description: form.description,
        tags: form.tags,
        team: form.team,
        openapi_path: form.openapi_path
      };

      if (mode === 'create') {
        await apiFetch('/apis', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      } else if (mode === 'edit' && id) {
        await apiFetch(`/apis/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }

      navigate('/apis');
    } catch (err: any) {
      setError(err.message || 'Failed to save API');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h1>{mode === 'create' ? 'Create API' : 'Edit API'}</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>

        {/* Name */}
        <div style={{ marginBottom: 12 }}>
          <label>
            Name
            <input
              type="text"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 4 }}
              required
            />
          </label>
        </div>

        {/* Base URL */}
        <div style={{ marginBottom: 12 }}>
          <label>
            Base URL
            <input
              type="text"
              value={form.base_url}
              onChange={e => handleChange('base_url', e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 4 }}
              required
            />
          </label>
        </div>

        {/* Version */}
        <div style={{ marginBottom: 12 }}>
          <label>
            Version
            <input
              type="text"
              value={form.version}
              onChange={e => handleChange('version', e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 4 }}
              required
            />
          </label>
        </div>

        {/* Lifecycle */}
        <div style={{ marginBottom: 12 }}>
          <label>
            Lifecycle
            <select
              value={form.lifecycle}
              onChange={e => handleChange('lifecycle', e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 4 }}
              required
            >
              {lifecycleOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 12 }}>
          <label>
            Description
            <textarea
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 4 }}
            />
          </label>
        </div>

        {/* Tags */}
        <div style={{ marginBottom: 12 }}>
          <label>
            Tags (comma-separated)
            <input
              type="text"
              value={(form.tags || []).join(', ')}
              onChange={e => handleChange('tags', e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 4 }}
            />
          </label>
        </div>

        {/* Team */}
        <div style={{ marginBottom: 12 }}>
          <label>
            Team
            <input
              type="text"
              value={form.team}
              onChange={e => handleChange('team', e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 4 }}
            />
          </label>
        </div>

        {/* OpenAPI Path */}
        <div style={{ marginBottom: 12 }}>
          <label>
            OpenAPI Path
            <input
              type="text"
              value={form.openapi_path}
              onChange={e => handleChange('openapi_path', e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 4 }}
            />
          </label>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/apis')}
          style={{ marginLeft: 8 }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ApiFormPage;
