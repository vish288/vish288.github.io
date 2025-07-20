# GitHub OAuth App Setup

To enable proper "Sign in with GitHub" functionality, you need to create a GitHub OAuth App.

## Steps to Create GitHub OAuth App

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/applications/new
   - Or navigate: GitHub → Settings → Developer settings → OAuth Apps → New OAuth App

2. **Fill in Application Details**

   ```
   Application Name: Gratitude Dashboard
   Homepage URL: https://vish288.github.io
   Application Description: Admin dashboard for gratitude messages
   Authorization callback URL: https://vish288.github.io/admin/callback
   ```

   For development, you might also want to add:

   ```
   Authorization callback URL: http://localhost:3001/admin/callback
   ```

3. **Get Client Credentials**
   - After creating the app, you'll get:
     - **Client ID** (public, can be in frontend)
     - **Client Secret** (private, needs backend or secure storage)

4. **Update Environment Variables**
   ```bash
   # Add to your .env file
   VITE_GITHUB_CLIENT_ID=your_client_id_here
   # Note: Client secret cannot be used in frontend for security
   ```

## Security Note

GitHub OAuth requires a **client secret** that cannot be safely stored in frontend code. This presents two options:

### Option 1: Full OAuth with Backend (Recommended for Production)

- Create a simple backend endpoint to exchange authorization code for token
- Frontend sends code to your backend, backend exchanges for token
- Most secure, industry standard

### Option 2: Simplified Flow (Current Implementation)

- Use GitHub's public API to verify user identity
- Store user info locally after verification
- Less secure but simpler for personal projects

For now, I'll implement Option 2 with improvements, but can upgrade to Option 1 if you prefer.
