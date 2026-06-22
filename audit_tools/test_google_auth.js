const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error' && msg.text().includes('identitytoolkit')) return;
    console.log('PAGE LOG:', msg.text());
  });

  // MOCK GOOGLE AUTH POPUP
  await page.route('**/identitytoolkit.googleapis.com/v1/accounts:signInWithIdp*', async route => {
    console.log('Intercepted Firebase Google OAuth Request');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        oauthAccessToken: "mock-oauth-token",
        oauthIdToken: "mock-oauth-id-token",
        localId: "mock-google-uid-456",
        email: "googleuser@example.com",
        displayName: "Google User",
        idToken: "mock-id-token",
        registered: true,
        refreshToken: "mock-refresh-token",
        expiresIn: "3600"
      })
    });
  });

  await page.route('**/firestore.googleapis.com/v1/projects/*/databases/(default)/documents/users/*', async route => {
    console.log('Intercepted Firestore Profile Insert');
    await route.fulfill({ status: 200 });
  });

  // Intercept and mock layoverxAuth before the page scripts load
  await page.addInitScript(() => {
    const mockAuthObj = {
      listeners: [],
      currentUser: null,
      onAuthStateChanged(callback) {
        this.listeners.push(callback);
        // immediately call it with current user
        callback(this.currentUser);
        return () => {
          this.listeners = this.listeners.filter(l => l !== callback);
        };
      },
      async signInWithPopup(provider) {
        console.log('Mocked signInWithPopup called');
        const mockUser = {
          uid: 'mock-google-uid-456',
          email: 'googleuser@example.com',
          displayName: 'Google User',
          updateProfile: async () => {}
        };
        this.currentUser = mockUser;
        for (const listener of this.listeners) {
          listener(mockUser);
        }
        return {
          user: mockUser
        };
      },
      async signOut() {
        this.currentUser = null;
        for (const listener of this.listeners) {
          listener(null);
        }
      }
    };

    Object.defineProperty(window, 'layoverxAuth', {
      get() {
        return mockAuthObj;
      },
      set(val) {
        console.log('layoverxAuth set intercepted, keeping mock');
      },
      configurable: true
    });
  });

  await page.goto('http://localhost:8001/#login', { waitUntil: 'load' });
  await page.waitForSelector('#modal-login', { state: 'visible' });

  console.log('Clicking Google Login...');
  await page.click('button[onclick*="layoverx.socialLogin(\'google\')"]');
  
  await page.waitForTimeout(2000);
  
  const isAuthUserVisible = await page.evaluate(() => {
    return document.querySelector('.auth-user').style.display === 'flex';
  });
  
  console.log(`UI Updated? User Visible: ${isAuthUserVisible}`);

  await browser.close();
  console.log('Playwright Google Auth Test Complete.');
  if (!isAuthUserVisible) {
    console.error('Google Auth Test FAILED: Auth user elements are not visible.');
    process.exit(1);
  }
})();
