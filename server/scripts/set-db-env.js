// Script to set the database environment variables
const fs = require('fs');
const path = require('path');

// External database connection string
const DATABASE_URL = "postgresql://neondb_owner:npg_U9fXMreBqW0m@ep-twilight-sound-a4ixfs06.us-east-1.aws.neon.tech/neondb?sslmode=require";

// Export the environment variable
process.env.DATABASE_URL = DATABASE_URL;
console.log("Database environment variable set successfully!");