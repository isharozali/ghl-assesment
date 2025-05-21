# GHL OAuth Integration

A Node.js application that handles GHL (Go High Level) OAuth authentication and API integration.

## Authentication Flow

1. **Initiate Auth**
   - Visit `/auth/initiate`
   - User is redirected to GHL authorization page
   - Required scopes: `contacts.readonly`, `calendars.readonly`, `campaigns.readonly`

2. **Callback**
   - GHL redirects to your callback URL (`/auth/callback`)
   - Application exchanges code for tokens
   - Tokens are stored in MongoDB

3. **Token Refresh**
   - Access tokens expire after 1 hour
   - Use `/auth/refresh` endpoint with refresh token
   - New tokens are automatically stored

### GHL API

Available endpoints:
- `/calendars/` - Get calendar information
- `/contacts/` - Get contact information
- `/campaigns/` - Get campaign information


## Setup Instructions

1. **Environment Variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=3000

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/ghl-auth

   # GHL OAuth Configuration
   GHL_CLIENT_ID=your_client_id_here
   GHL_CLIENT_SECRET=your_client_secret_here
   GHL_REDIRECT_URI=http://localhost:3000/auth/callback
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Application**
   Development mode:
   ```bash
   npm run dev
   ```
   Production mode:
   ```bash
   npm start
   ```