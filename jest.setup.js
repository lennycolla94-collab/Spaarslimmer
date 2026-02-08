// Load environment variables for tests
require('dotenv').config();

// Set test encryption key if not present
if (!process.env.ENCRYPTION_KEY) {
  process.env.ENCRYPTION_KEY = 'd66f10bccca4d06a5bb56dbc06e5645b79517e640f84307342aeb9df09205797';
}
