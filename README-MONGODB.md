# HVOS Cloud — MongoDB Atlas

HVOS is a static HTML/CSS/Vanilla JS app. This integration adds a Vercel serverless API and MongoDB Atlas persistence without exposing MongoDB credentials in browser code.

## Collections
- \`users\`: account profile and bcrypt password hash.
- \`user_data\`: per-user key/value documents for existing \`hvos_*\` localStorage records.
- \`user_settings\`: user preferences.
- \`activity_logs\`: reserved for audit/activity events.
- \`sessions\`: hashed session tokens with expiration.

## Deploy
1. Import this GitHub repository into Vercel.
2. In Vercel Project Settings → Environment Variables, add:
   - \`MONGODB_URI\`: Atlas connection string for a database user with read/write access to \`hvos_db\`.
   - \`MONGODB_DB\`: \`hvos_db\`
   - \`JWT_SECRET\`: a random secret of at least 32 characters.
3. In MongoDB Atlas Network Access, allow Vercel's outbound connections. For a quick test, Atlas supports allowing access from anywhere; use least-privilege DB credentials and tighten network access for production.
4. Redeploy after setting environment variables.
5. Open the Vercel deployment URL, register an account, and test data on a second device.

## Security
- MongoDB URI and JWT secret are server-side environment variables only.
- Passwords are hashed with bcrypt.
- Authentication uses an HttpOnly, SameSite=Lax cookie.
- Every data read/write is scoped by the authenticated user's ID.
- Only keys beginning with \`hvos_\` are synchronized.
- One stored item is limited to 512 KB.

## Important setup
Create a MongoDB Atlas database user and use its credentials in \`MONGODB_URI\`. Do not put the URI in \`index.html\`, JavaScript, or GitHub commits. Existing browser-only data is uploaded to the cloud only after logging in with that same browser; other devices then load the account's cloud data.