# Todo App - Full Stack Learning Project

A full-stack todo application built with Express, MongoDB, and React - designed for learning backend development concepts.

## ✨ Features

- ✅ **Create, Read, Update, Delete** todos
- 🔄 **Drag-and-drop** to reorder tasks
- 📊 **Dashboard stats** - Total, Completed, Pending counts
- 🎨 **Modern dark theme** with shadcn/ui
- ⚡ **Real-time updates** with optimistic UI
- 📱 **Responsive design** for all screen sizes
- 🐳 **Fully Dockerized** - one command to start everything

## 🎯 Learning Objectives

This project demonstrates:
- **Backend**: Express.js with native MongoDB driver (no ORM)
- **Database**: Direct MongoDB operations, connection pooling, CRUD, ordering
- **Frontend**: React with TypeScript, component composition, and drag-and-drop
- **Architecture**: Separation of concerns (routes, controllers, database layer, utilities)
- **Docker**: Full-stack containerization with hot-reload support
- **UI/UX**: Modern component-based design with shadcn/ui

## 📁 Project Structure

```
todo-app/
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   │   └── database.js
│   │   ├── db/            # Database operations (CRUD)
│   │   │   └── todoDb.js
│   │   ├── controllers/   # Request handlers & business logic
│   │   │   └── todoController.js
│   │   ├── routes/        # API endpoint definitions
│   │   │   └── todoRoutes.js
│   │   ├── utils/         # Utility functions
│   │   │   └── errorHandler.js
│   │   └── server.js      # Application entry point
│   ├── Dockerfile
│   └── package.json
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ui/        # shadcn/ui components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── checkbox.tsx
│   │   │   │   └── input.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── StatsCards.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── TodoList.tsx
│   │   │   ├── TodoItem.tsx
│   │   │   └── AddTodoForm.tsx
│   │   ├── lib/           # Utilities (API, utils)
│   │   │   ├── api.ts
│   │   │   └── utils.ts
│   │   ├── types/         # TypeScript types
│   │   │   └── todo.ts
│   │   ├── App.tsx        # Main component
│   │   └── main.tsx
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml      # Multi-container orchestration
├── start.bat              # Windows startup script
└── start.sh               # Mac/Linux startup script
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
- CRUD operations: `insertOne`, `find`, `findOneAndUpdate`, `deleteOne`, `bulkWrite`
- Modern ObjectId handling with `createFromHexString()`
- Order management for sortable lists

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
- **Utils**: Reusable helper functions

#### 5. **Error Handling**
- Centralized error handler utility
- Try-catch blocks in controllers
- Error responses with proper status codes
- BSONError handling for invalid IDs
- Graceful shutdown (close DB connections)

### Frontend Concepts

#### 1. **React Hooks**
- `useState` - Managing component state
- `useEffect` - Side effects and data fetching
- `useSensor` & `useSensors` - Drag-and-drop sensors

#### 2. **Component Architecture**
- **Container components** (App) - Manage state and logic
- **Presentation components** (Header, StatsCards) - Display only
- **Smart components** (TodoList) - Self-contained logic
- **Compound components** (Card hierarchy)
- Props and callbacks for communication

#### 3. **Component Composition**
- Breaking large components into smaller pieces
- Single Responsibility Principle
- Reusable, testable components
- Clear component boundaries

#### 4. **State Management**
- Immutable updates (never mutate state)
- Derived state (computed values)
- Loading and error states
- Optimistic UI updates
- State hoisting

#### 5. **Drag and Drop**
- `@dnd-kit` library integration
- Sortable lists with keyboard support
- Drag overlay for visual feedback
- Optimistic reordering with API sync

#### 6. **TypeScript**
- Interface definitions
- Type safety for API calls
- Generic types (`ApiResponse<T>`)
- Props typing

#### 7. **API Communication**
- Fetch API for HTTP requests
- Async/await pattern
- Error handling and recovery
- Centralized API layer

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
- **shadcn/ui** - UI component library (dark theme)
- **@dnd-kit** - Drag-and-drop functionality
- **Lucide React** - Icons

### Infrastructure
- **Docker** - Full-stack containerization
- **Docker Compose** - Multi-container orchestration

## 🔍 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos (sorted by order) |
| GET | `/api/todos/:id` | Get single todo |
| POST | `/api/todos` | Create new todo (added at top) |
| PATCH | `/api/todos/:id` | Update todo |
| DELETE | `/api/todos/:id` | Delete todo |
| PATCH | `/api/todos/:id/toggle` | Toggle completion |
| PUT | `/api/todos/reorder` | Reorder todos (drag-and-drop) |
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
2. **Error Handling** - Centralized error handler, consistent responses
3. **Validation** - Validate user input on server and client
4. **Immutable State** - Never mutate React state
5. **Type Safety** - TypeScript prevents bugs
6. **Connection Pooling** - Reuse database connections
7. **Graceful Shutdown** - Clean up resources
8. **Component Composition** - Break down complex components
9. **DRY Principle** - Don't repeat yourself (reusable utilities)
10. **Optimistic UI** - Update UI before server response
11. **Modern MongoDB** - Use current, non-deprecated methods
12. **Separation of Concerns** - Each file has one responsibility

## 📦 Component Architecture

The application follows a component-based architecture with clear separation:

### UI Components (shadcn/ui)
- `button.tsx`, `card.tsx`, `checkbox.tsx`, `input.tsx` - Base UI primitives

### Presentation Components
- **Header** - App branding and title
- **StatsCards** - Dashboard metrics (Total, Completed, Pending)
- **ErrorMessage** - Error display
- **LoadingState** - Loading indicator
- **EmptyState** - Empty list placeholder

### Smart Components
- **TodoList** - Manages drag-and-drop logic and item rendering
- **TodoItem** - Individual todo with checkbox, delete, and drag handle
- **AddTodoForm** - Form with input validation

### Container Component
- **App** - State management, API calls, component orchestration

## 🎓 Next Steps to Learn More

1. **Add Authentication** - Learn about JWTs and sessions
2. **Add Data Validation** - Try a library like Zod or Yup
3. **Add Testing** - Learn Jest and React Testing Library
4. **Add Pagination** - Handle large datasets efficiently
5. **Add Search & Filters** - MongoDB text search and filtering
6. **Add Real-time Updates** - WebSockets or Server-Sent Events
7. **Add Due Dates** - Date handling and sorting
8. **Deploy to Production** - Netlify, Render, MongoDB Atlas

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


