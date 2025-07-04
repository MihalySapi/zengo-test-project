# Zengo Test Project

- **Backend**: ASP.NET Core 9 Minimal API
- **Frontend**: React 18 + TypeScript + Material UI
- **Database**: SQLite
- **Build Tool**: Vite

### Start the app
```bash
# Backend
cd src/WebAPI
dotnet run # 'http' launch settings

# Frontend  
cd src/Frontend
npm install
npm run dev
```

## Database
The SQLite database is **automatically created** by the backend:
- Database file: `location.db`

## Access
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5213

## API Endpoints
- `GET /api/counties` - Get counties
- `GET /api/counties/{id}/cities` - Get cities in a county
- `POST /api/counties/{id}/cities` - Create city
- `PUT /api/cities/{id}` - Update city
- `DELETE /api/cities/{id}` - Delete city