# Fix Google Sign-In Error

If you see `Error: Connection failed` or `auth/network-request-failed`, follow these steps to enable Google Sign-In manually (required security step):

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **BazaarNow** (`bazaarnow-d4548`)
3. Click on **Authentication** in the left sidebar
4. Click the **Sign-in method** tab
5. Click **Add new provider** -> Select **Google**
6. Toggle **Enable** switch to ON
7. Allow **bazaarnow-d4548.firebaseapp.com** in the Authorized Domains list (below the providers list) if not already there.
8. Click **Save**

Once enabled, refresh your app and try logging in again.
