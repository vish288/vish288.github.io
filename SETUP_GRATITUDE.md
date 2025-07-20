# Gratitude System Setup

The gratitude message system is now implemented and ready for use. Follow these steps to complete the setup:

## 1. Create GitHub Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "Gratitude Messages API"
4. Set expiration as needed (recommend 90 days or no expiration)
5. Select the following scopes:
   - **`repo`** - Full control of private repositories (includes issues access)

**Note**: The `repo` scope includes access to issues, pull requests, and all repository content. There's no separate "issues" permission.

## 2. Configure Environment Variables

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your token:
   ```
   VITE_GITHUB_TOKEN=ghp_your_token_here
   VITE_GITHUB_OWNER=vish288
   VITE_GITHUB_REPO=gratitude-messages
   ```

## 3. System Components

### Message Storage

- Messages are stored as GitHub Issues in the private `vish288/gratitude-messages` repository
- Each message becomes an issue with labels: `gratitude`, `message`
- Issues contain structured data: name, email, message, timestamp, user agent

### Bot Protection

- Simple CAPTCHA using math problems (addition, subtraction, multiplication)
- Users must solve before submitting

### Admin Dashboard

- **Messages**: `/admin/gratitude` - View and monitor gratitude messages
- **User Management**: `/admin/users` - Manage who can access the admin panel
- **Simple GitHub authentication**: Just enter your GitHub username to access
- **User-based access control**: Only authorized users can access (configured in `githubOAuth.ts`)
- **Your token powers everything**: Uses your personal token for all API calls
- **Persistent admin toast**: Shows admin mode status when authenticated
- **Unauthorized access page**: Polite message for users without permission
- Currently authorized users: `vish288` (modify `ALLOWED_USERS` in `src/services/githubOAuth.ts`)

## 4. Testing

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Test the gratitude form at `/gratitude`
3. Test the admin dashboard at `/admin/gratitude`
   - Click "Sign in with GitHub" (standard OAuth flow)
   - Redirected to GitHub for authentication
   - Authorize the app and return automatically
   - Admin navigation appears with persistent toast notification
4. Test user management at `/admin/users`
   - Search for GitHub users to add to authorized list
   - Remove users from access (except primary admin)
   - Changes are demonstrated but not persisted in this setup

## 5. Deployment

For production deployment:

1. Set the environment variables in your hosting platform
2. Ensure the GitHub token has the correct permissions
3. The system will automatically handle message storage and notifications

## Security Notes

- The GitHub token should be kept secure and not committed to the repository
- The gratitude-messages repository is private to protect user data
- Messages include minimal metadata for debugging (user agent, timestamp)
- Admin access is controlled via GitHub authentication and user whitelist

## Configuring Admin Access

To add or remove users who can access the admin dashboard:

1. Edit `src/services/githubAuth.ts`
2. Modify the `ALLOWED_USERS` array:
   ```typescript
   const ALLOWED_USERS = ['vish288', 'another_user', 'third_user']
   ```
3. Rebuild and deploy

Users will authenticate using their GitHub personal access token, and the system will verify they're in the allowed users list.
