# Environment Variables Setup

Create a `.env` file in the `server/` directory with the following content:

```
# Server Configuration
PORT=5000

# MongoDB Configuration
# Format: mongodb://username:password@host:port
# Matches docker-compose.yml credentials
MONGODB_URI=mongodb://admin:password123@localhost:27017
MONGODB_DB_NAME=todo_app

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

## Explanation:

- **PORT=5000** - The port your Express server will run on
- **MONGODB_URI** - Connection string to your MongoDB (will run in Docker on default port 27017)
- **MONGODB_DB_NAME** - The database name where todos will be stored
- **CLIENT_URL** - Your React app URL (Vite's default port is 5173) - needed for CORS

