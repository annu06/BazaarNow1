# Fix "auth/internal-error" for Google Sign-In

The `auth/internal-error` usually means a required configuration is missing in the Google Cloud project linked to Firebase. Follow these steps:

1. **Set Support Email (Critical)**
   - Go to [Firebase Console](https://console.firebase.google.com/) -> Project Settings (gear icon) -> General.
   - Look for the "Public settings" card.
   - Ensure a **Support email** is selected from the dropdown. This is required for Google OAuth to work.

2. **Re-enable Google Provider**
   - Go to Authentication -> Sign-in method.
   - If Google is enabled, click the pencil icon, note the Client ID/Secret (if visible), and click **Save** again to refresh the config.
   - If it was disabled, enable it and click Save.

3. **Check Authorized Domains**
   - Go to Authentication -> Settings -> Authorized domains.
   - Ensure the domain you are testing on (likely `localhost` or `bazaarnow-d4548.web.app`) is listed.
