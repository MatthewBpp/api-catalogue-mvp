import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch, getUserNumber } from '../apiClient';

type ApiRecord = {
  id: string;
  name: string;
  base_url: string;
  version: string;
  lifecycle: string;
  description: string;
  tags: string[] | null;
  team: string;
  openapi_path: string;
};

const lifecycleOptions = [
  'design',
  'development',
  'production',
  'deprecated'
];

const ApiListPage: React.FC = () => {
  const [apis, setApis] = useState<ApiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [lifecycleFilter, setLifecycleFilter] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const userNumber = getUserNumber();
    if (!userNumber) {
      navigate('/login');
      return;
    }

    const fetchApis = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (search) params.set('q', search);
        if (tagFilter) params.set('tag', tagFilter);
        if (lifecycleFilter) params.set('lifecycle', lifecycleFilter);

        const data = await apiFetch(`/apis?${params.toString()}`);
        setApis(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load APIs');
      } finally {
        setLoading(false);
      }
    };

    fetchApis();
  }, [search, tagFilter, lifecycleFilter, navigate]);

  const allTags = Array.from(
    new Set(apis.flatMap(api => api.tags || []))
  );

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h1>API Catalogue</h1>

      <div style={{ marginBottom: 16 }}>
        <button onClick={() => navigate('/apis/new')}>New API</button>
        <button onClick={() => navigate('/login')} style={{ marginLeft: 8 }}>
          Change user
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search by name or description"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />

        <select
          value={tagFilter}
          onChange={e => setTagFilter(e.target.value)}
        >
          <option value="">All tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <select
          value={lifecycleFilter}
          onChange={e => setLifecycleFilter(e.target.value)}
        >
          <option value="">All lifecycles</option>
          {lifecycleOptions.map(lc => (
            <option key={lc} value={lc}>
              {lc}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && apis.length === 0 && <p>No APIs found.</p>}

      {/* API List */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {apis.map(api => (
          <li
            key={api.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 16,
              marginBottom: 16
            }}
          >
            <h2 style={{ margin: 0 }}>{api.name}</h2>

            <p><strong>Base URL:</strong> {api.base_url}</p>
            <p><strong>Version:</strong> {api.version}</p>
            <p><strong>Lifecycle:</strong> {api.lifecycle}</p>

            {api.description && (
              <p><strong>Description:</strong> {api.description}</p>
            )}

            {api.team && (
              <p><strong>Team:</strong> {api.team}</p>
            )}

            {api.openapi_path && (
              <p><strong>OpenAPI Path:</strong> {api.openapi_path}</p>
            )}

            {/* Tags as chips */}
            {api.tags && api.tags.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <strong>Tags:</strong>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                  {api.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        background: '#eee',
                        padding: '4px 8px',
                        borderRadius: 12,
                        fontSize: 12
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 12 }}>
              <Link to={`/apis/${api.id}/edit`}>Edit</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApiListPage;
