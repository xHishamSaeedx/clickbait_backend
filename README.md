# Clickbait Backend

A Node.js backend API with Firebase integration for the Clickbait application.

## Setup Instructions

### 1. Environment Variables

1. Copy the example environment file:

   ```bash
   cp env.example .env
   ```

2. Update the `.env` file with your actual Firebase service account credentials.

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Endpoints

- `GET /` - Basic API status
- `GET /health` - Health check
- `GET /api` - API working status
- `GET /api/status` - Detailed API status
- `GET /api/firebase-test` - Test Firebase connection

## Firebase Integration

The backend is configured with Firebase Admin SDK and includes:

- **Firestore Database** - For data storage
- **Firebase Auth** - For user authentication
- **Firebase Storage** - For file storage

### Firebase Services Available

- `getFirestore()` - Access Firestore database
- `getAuth()` - Access Firebase Authentication
- `getStorage()` - Access Firebase Storage

## Project Structure

```
src/
├── config/
│   └── firebase.js      # Firebase configuration
├── controllers/         # Route controllers
├── middleware/          # Custom middleware
├── models/             # Data models
└── routes/
    └── api.js          # API routes
```

## Environment Variables

Required environment variables (see `env.example`):

- `FIREBASE_TYPE` - Service account type
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_PRIVATE_KEY_ID` - Private key ID
- `FIREBASE_PRIVATE_KEY` - Private key (with newlines)
- `FIREBASE_CLIENT_EMAIL` - Client email
- `FIREBASE_CLIENT_ID` - Client ID
- `FIREBASE_AUTH_URI` - Auth URI
- `FIREBASE_TOKEN_URI` - Token URI
- `FIREBASE_AUTH_PROVIDER_X509_CERT_URL` - Auth provider cert URL
- `FIREBASE_CLIENT_X509_CERT_URL` - Client cert URL
- `FIREBASE_UNIVERSE_DOMAIN` - Universe domain
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
