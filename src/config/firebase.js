const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Create service account credentials from environment variables
    const serviceAccount = {
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url:
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
    };

    // Initialize Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });

    console.log("✅ Firebase Admin SDK initialized successfully");
    return admin;
  } catch (error) {
    console.error("❌ Error initializing Firebase Admin SDK:", error);
    throw error;
  }
};

// Initialize Firebase and get Firestore instance
let db;
try {
  initializeFirebase();
  db = admin.firestore();
} catch (error) {
  console.warn("⚠️ Firebase not available, some features may be limited");
  db = null;
}

// Export Firebase services
const getFirestore = () => admin.firestore();
const getAuth = () => admin.auth();
const getStorage = () => admin.storage();

module.exports = {
  initializeFirebase,
  getFirestore,
  getAuth,
  getStorage,
  admin,
  db, // Export db directly
};
