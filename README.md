# Clickbait Backend

A Node.js Express server for the Clickbait application.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   Create a `.env` file in the root directory with:
   ```
   PORT=3000
   NODE_ENV=development
   ```

3. **Start the server:**
   - Development mode (with auto-restart):
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```

## Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon
- `npm test` - Run tests (not configured yet)

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/test` - Test API endpoint
- `GET /api` - API status
- `GET /api/status` - Detailed server status

## Project Structure

```
clickbait_backend/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── routes/            # API route definitions
├── controllers/       # Route controllers
├── models/           # Data models
├── middleware/       # Custom middleware
└── config/          # Configuration files
```

## Development

The server uses:
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **nodemon** - Auto-restart during development