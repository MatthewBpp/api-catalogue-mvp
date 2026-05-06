# API Catalogue MVP

A full-stack web application for managing an internal API catalogue. Allows teams to discover, document, and track APIs across different lifecycle stages.

## Tech Stack

### Backend
- **Node.js** with **Express** - REST API server
- **TypeScript** - Type safety and developer experience
- **Supabase** - PostgreSQL database with real-time capabilities
- **Jest** - Unit testing framework
- **CORS** - Cross-origin resource sharing for frontend integration

### Frontend
- **React** - Component-based UI library
- **Vite** - Fast build tool and development server
- **TypeScript** - Type safety for React components
- **React Router** - Client-side routing

### Development
- **Dev Containers** - Consistent development environment
- **ESLint** - Code linting
- **GitHub Codespaces** - Cloud-based development

## Architecture

The application follows a client-server architecture:

- **Frontend** (React/Vite): Single-page application with routing, forms, and API integration
- **Backend** (Express): RESTful API with authentication, CRUD operations, and database access
- **Database** (Supabase): Stores users, APIs, and permissions

### Authentication Flow
- User authenticates with a user number (simulated enterprise auth)
- Backend validates user against database and assigns permissions
- User data is attached to requests via middleware
- Role-based access control for API creation/modification

### API Structure
- `GET /apis` - List/search APIs
- `GET /apis/:id` - Get single API
- `POST /apis` - Create API (requires catalogue group)
- `PUT /apis/:id` - Update API (requires catalogue group + ownership)
- `DELETE /apis/:id` - Delete API (requires catalogue group + ownership)

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account and project
- GitHub Codespaces (recommended) or local dev container

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MatthewBpp/api-catalogue-mvp.git
   cd api-catalogue-mvp
   ```

2. **Install dependencies**
   ```bash
   # Root dependencies (if any)
   npm install

   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env` in the backend directory
   - Configure Supabase credentials:
     ```
     SUPABASE_URL=your_supabase_url
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     ```
   - Set up database schema (see database setup below)

## Database Setup

The application uses Supabase with the following tables:

### `users`
- `user_number` (text, primary key)
- `display_name` (text)
- `groups` (text array) - e.g., `['api_catalogue_group']`

### `apis`
- `id` (uuid, primary key)
- `name` (text)
- `base_url` (text)
- `version` (text)
- `lifecycle` (text) - 'design', 'development', 'production', 'deprecated'
- `description` (text)
- `tags` (text array)
- `team` (text)
- `openapi_path` (text)
- `owner_id` (uuid, foreign key to users.profile_id)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Running the Application

### Development Mode

1. **Start the backend**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on http://localhost:4000

2. **Start the frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   App runs on http://localhost:5173

### Production Build

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the backend**
   ```bash
   cd backend
   npm start
   ```

## Testing

Run backend tests:
```bash
cd backend
npm test
```

## API Documentation

### Authentication
All requests require an `x-user-number` header with a valid user number.

### Endpoints

#### Health Check
- `GET /` - Server status

#### Authentication
- `GET /auth/validate` - Validate user number

#### APIs
- `GET /apis` - List APIs (query params: `q` for search, `tag` for filter)
- `GET /apis/:id` - Get API by ID
- `POST /apis` - Create API (requires catalogue group permission)
- `PUT /apis/:id` - Update API (requires catalogue group + ownership)
- `DELETE /apis/:id` - Delete API (requires catalogue group + ownership)

### Request/Response Examples

Create API:
```json
POST /apis
{
  "name": "Payment Service",
  "base_url": "https://api.example.com/payments",
  "version": "v1.0",
  "lifecycle": "production",
  "description": "Handles payment processing",
  "tags": ["payments", "finance"],
  "team": "Platform Team"
}
```

## Development

### Code Structure

```
backend/
├── src/
│   ├── app.ts          # Express app setup and routes
│   ├── server.ts       # Server entry point
│   ├── authMiddleware.ts # Authentication middleware
│   ├── apiService.ts   # API data access
│   ├── userService.ts  # User data access
│   ├── supabaseClient.ts # Database client
│   └── types/          # TypeScript type definitions
└── tests/              # Unit tests

frontend/
├── src/
│   ├── App.tsx         # Main app component and routing
│   ├── apiClient.ts    # API client utilities
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   └── hooks/          # Custom React hooks
└── public/             # Static assets
```

### Key Concepts

- **User Authentication**: Based on user numbers with group-based permissions
- **API Lifecycle**: Tracks APIs from design through production to deprecation
- **Role-Based Access**: Catalogue group members can create/modify APIs
- **Ownership**: Users can only modify APIs they own
- **Search & Filter**: Find APIs by name, tags, or lifecycle stage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Ensure linting passes
5. Submit a pull request