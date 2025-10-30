# Todo App - Full Stack Learning Project

A full-stack todo application built with Express, MongoDB, and React - designed for learning backend development concepts.

## 🎯 Learning Objectives

This project demonstrates:
- **Backend**: Express.js with native MongoDB driver (no ORM)
- **Database**: Direct MongoDB operations, connection pooling, CRUD
- **Frontend**: React with TypeScript and shadcn/ui
- **Architecture**: Separation of concerns (routes, controllers, database layer)
- **Docker**: Containerized MongoDB

## 📁 Project Structure

```
todo-app/
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── db/            # Database operations (CRUD)
│   │   ├── controllers/   # Request handlers & business logic
│   │   ├── routes/        # API endpoint definitions
│   │   └── server.js      # Application entry point
│   └── package.json
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ui/        # shadcn/ui components
│   │   │   ├── TodoItem.tsx
│   │   │   └── AddTodoForm.tsx
│   │   ├── lib/           # Utilities (API, utils)
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Main component
│   └── package.json
│
└── docker-compose.yml      # MongoDB container
```

## 🚀 Getting Started

### Prerequisites

- **Docker** and Docker Compose (that's it!)
- A terminal/command line

### Option 1: Start Everything with Docker (Recommended for Quick Start)

In the root directory, run **one command**:

**Windows:**
```bash
start.bat
```

**Mac/Linux:**
```bash
chmod +x start.sh
./start.sh
```

**Or directly with Docker Compose:**
```bash
docker-compose up --build
```

This will:
- 📦 Build and start MongoDB
- 🚀 Build and start the Express server
- ⚛️ Build and start the React client
- 🔗 Connect everything together

**Access the app:**
- Frontend: **http://localhost:5173**
- Backend API: **http://localhost:5000**
- MongoDB: **localhost:27017**

**Stop everything:**
```bash
docker-compose down
```

### Option 2: Manual Setup (For Development)

If you prefer to run things manually for better control:

#### 1. Start MongoDB Only

```bash
docker-compose up mongodb -d
```

#### 2. Set Up the Server

```bash
cd server
npm install

# Create .env file (see server/ENV_SETUP.md)
# Add these contents:
PORT=5000
MONGODB_URI=mongodb://admin:password123@localhost:27017
MONGODB_DB_NAME=todo_app
CLIENT_URL=http://localhost:5173

npm run dev
```

#### 3. Set Up the Client

In a new terminal:

```bash
cd client
npm install
npm run dev
```

Visit **http://localhost:5173** 🎉

## 📚 What You'll Learn

### Backend Concepts

#### 1. **Native MongoDB Driver**
- Direct database operations without ORM abstraction
- Connection pooling and singleton pattern
- CRUD operations: `insertOne`, `find`, `findOneAndUpdate`, `deleteOne`
- ObjectId handling

#### 2. **Express Middleware**
- CORS for cross-origin requests
- Body parsers for JSON data
- Custom middleware (logging, error handling)
- Middleware execution order

#### 3. **RESTful API Design**
- Resource-based URLs (`/api/todos`)
- HTTP methods (GET, POST, PATCH, DELETE)
- Status codes (200, 201, 400, 404, 500)
- Consistent response format

#### 4. **Separation of Concerns**
- **Routes**: Define endpoints
- **Controllers**: Handle business logic
- **Database Layer**: Manage data operations
- **Config**: Environment setup

#### 5. **Error Handling**
- Try-catch blocks
- Error responses with proper status codes
- Graceful shutdown (close DB connections)

### Frontend Concepts

#### 1. **React Hooks**
- `useState` - Managing component state
- `useEffect` - Side effects and data fetching

#### 2. **Component Patterns**
- Container components (App) - manage state
- Presentation components (TodoItem) - display data
- Props and callbacks

#### 3. **State Management**
- Immutable updates (never mutate state)
- Derived state (computed values)
- Loading and error states

#### 4. **TypeScript**
- Interface definitions
- Type safety for API calls
- Generic types (`ApiResponse<T>`)

#### 5. **API Communication**
- Fetch API for HTTP requests
- Async/await pattern
- Error handling

## 🛠️ Technologies Used

### Backend
- **Express.js** - Web framework
- **MongoDB Native Driver** - Database client
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons

### Infrastructure
- **Docker** - Full-stack containerization
- **Docker Compose** - Multi-container orchestration

## 🔍 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos |
| GET | `/api/todos/:id` | Get single todo |
| POST | `/api/todos` | Create new todo |
| PATCH | `/api/todos/:id` | Update todo |
| DELETE | `/api/todos/:id` | Delete todo |
| PATCH | `/api/todos/:id/toggle` | Toggle completion |
| GET | `/health` | Server health check |

## 💡 Key Learning Points

### Why Native MongoDB Instead of Mongoose?

**Mongoose** is great for production, but for learning:
- Native driver shows how MongoDB actually works
- You learn connection management
- You understand pooling and performance
- No magic - every operation is explicit

### Why This Architecture?

**Separation of Concerns**:
- Routes don't know about database details
- Controllers don't know about MongoDB specifics
- Database layer is reusable and testable
- Easy to swap MongoDB for another database

### Best Practices Demonstrated

1. **Environment Variables** - Never hardcode secrets
2. **Error Handling** - Always catch and handle errors
3. **Validation** - Validate user input
4. **Immutable State** - Never mutate React state
5. **Type Safety** - TypeScript prevents bugs
6. **Connection Pooling** - Reuse database connections
7. **Graceful Shutdown** - Clean up resources

## 🎓 Next Steps to Learn More

1. **Add Authentication** - Learn about JWTs and sessions
2. **Add Data Validation** - Try a library like Zod
3. **Add Testing** - Learn Jest and React Testing Library
4. **Add Pagination** - Handle large datasets
5. **Add Search** - MongoDB text search
6. **Add Real-time Updates** - WebSockets or Server-Sent Events
7. **Deploy** - Learn about production hosting

### Docker & Deployment

#### **Docker Concepts**
1. **Containerization** - Each service runs in isolation
2. **docker-compose.yml** - Defines multi-container setup
3. **Dockerfile** - Instructions to build each container
4. **Volumes** - Persist data (MongoDB) and enable hot-reload
5. **Networks** - Allow containers to communicate
6. **depends_on** - Start containers in correct order
7. **Health checks** - Ensure services are ready

## 🐛 Troubleshooting

### Using Docker (Option 1)

**Services won't start:**
```bash
# Check logs
docker-compose logs

# Rebuild containers
docker-compose up --build

# Clean restart
docker-compose down -v
docker-compose up --build
```

**Port already in use:**
```bash
# Check what's using the port
# Windows:
netstat -ano | findstr :5173

# Stop specific service
docker-compose stop client
```

### Manual Setup (Option 2)

**Server won't start:**
- Check MongoDB is running: `docker ps`
- Check `.env` file exists in `server/` directory
- Check port 5000 isn't in use

**Client can't connect to server:**
- Check server is running on port 5000
- Check no CORS errors in browser console
- Verify `CLIENT_URL` in server `.env`

**MongoDB connection errors:**
- Ensure Docker is running
- Check credentials match in `.env` and `docker-compose.yml`
- Try: `docker-compose down && docker-compose up -d`

## 📝 License

This is a learning project - feel free to use and modify as you learn!

---

**Happy Learning! 🚀**


