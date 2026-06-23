const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACTS_DIR = 'C:\\Users\\Dev Tinker\\.gemini\\antigravity-ide\\brain\\ce74cb2a-d480-4432-92ad-0dcbb4134f51';

// Helper to create mock upload files
function createMockFiles() {
  const scratchDir = path.join(__dirname, 'mock_uploads');
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir);
  }
  const logoPath = path.join(scratchDir, 'mock_logo.png');
  const licensePath = path.join(scratchDir, 'mock_license.pdf');
  const idPath = path.join(scratchDir, 'mock_id.png');

  fs.writeFileSync(logoPath, 'MOCK_LOGO_CONTENT');
  fs.writeFileSync(licensePath, 'MOCK_LICENSE_CONTENT');
  fs.writeFileSync(idPath, 'MOCK_ID_CONTENT');

  return { logoPath, licensePath, idPath, scratchDir };
}

async function run() {
  console.log('Creating mock files for upload...');
  const { logoPath, licensePath, idPath, scratchDir } = createMockFiles();

  console.log('Starting Supplier Onboarding validation test...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen to browser console and page errors
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.stack || err.message));

  // 0. Inject mock firebase services before any navigation using sessionStorage persistence
  await page.addInitScript(() => {
    // Load mock database from sessionStorage
    let store;
    try {
      const savedStore = sessionStorage.getItem('__mockStore');
      store = savedStore ? JSON.parse(savedStore) : { users: {}, supplier_applications: {} };
    } catch(e) {
      store = { users: {}, supplier_applications: {} };
    }
    
    // Load mock user from sessionStorage
    let currentUser;
    try {
      const savedUser = sessionStorage.getItem('__mockUser');
      currentUser = savedUser ? JSON.parse(savedUser) : null;
      if (currentUser) {
        currentUser.updateProfile = async (profile) => {
          currentUser.displayName = profile.displayName;
          sessionStorage.setItem('__mockUser', JSON.stringify(currentUser));
        };
      }
    } catch(e) {
      currentUser = null;
    }
    
    // Mock Auth state change callbacks
    const authCallbacks = [];
    
    const mockAuth = {
      onAuthStateChanged: (cb) => {
        authCallbacks.push(cb);
        // Fire state callback after short delay so registration scripts finish binding
        setTimeout(() => {
          cb(currentUser);
        }, 50);
      },
      createUserWithEmailAndPassword: async (email, password) => {
        console.log('MOCK AUTH: createUserWithEmailAndPassword called for', email);
        currentUser = {
          uid: 'mock-supplier-uid-123',
          email: email,
          displayName: 'Transit Lounge Partners',
          updateProfile: async (profile) => {
            currentUser.displayName = profile.displayName;
            sessionStorage.setItem('__mockUser', JSON.stringify(currentUser));
          }
        };
        sessionStorage.setItem('__mockUser', JSON.stringify(currentUser));
        
        // Trigger auth state change callbacks
        setTimeout(() => {
          authCallbacks.forEach(cb => cb(currentUser));
        }, 50);
        return { user: currentUser };
      },
      signInWithEmailAndPassword: async (email, password) => {
        currentUser = {
          uid: 'mock-supplier-uid-123',
          email: email,
          displayName: 'Transit Lounge Partners',
          updateProfile: async (profile) => {
            currentUser.displayName = profile.displayName;
            sessionStorage.setItem('__mockUser', JSON.stringify(currentUser));
          }
        };
        sessionStorage.setItem('__mockUser', JSON.stringify(currentUser));
        
        setTimeout(() => {
          authCallbacks.forEach(cb => cb(currentUser));
        }, 50);
        return { user: currentUser };
      },
      signOut: async () => {
        currentUser = null;
        sessionStorage.removeItem('__mockUser');
        setTimeout(() => {
          authCallbacks.forEach(cb => cb(currentUser));
        }, 50);
      },
      get currentUser() {
        return currentUser;
      }
    };
    
    // Mock Firestore
    const mockDb = {
      collection: (name) => {
        if (!store[name]) {
          store[name] = {};
          sessionStorage.setItem('__mockStore', JSON.stringify(store));
        }
        return {
          doc: (id) => {
            return {
              set: async (data, options) => {
                console.log(`MOCK FIRESTORE: set in ${name}/${id}:`, data);
                store[name][id] = data;
                sessionStorage.setItem('__mockStore', JSON.stringify(store));
              },
              get: async () => {
                console.log(`MOCK FIRESTORE: get from ${name}/${id}`);
                const data = store[name][id];
                return {
                  exists: !!data,
                  data: () => data
                };
              }
            };
          },
          where: (field, op, val) => {
            console.log(`MOCK FIRESTORE: query where ${field} ${op} ${val}`);
            return {
              get: async () => {
                const results = [];
                Object.values(store[name] || {}).forEach(doc => {
                  if (doc[field] === val) {
                    results.push({
                      data: () => doc
                    });
                  }
                });
                return {
                  forEach: (cb) => results.forEach(cb)
                };
              }
            };
          }
        };
      }
    };
    
    // Mock Storage
    const mockStorage = {
      ref: () => {
        return {
          child: (path) => {
            console.log('MOCK STORAGE: ref child for path:', path);
            return {
              put: async (file) => {
                console.log('MOCK STORAGE: upload complete for path:', path);
                return {};
              },
              getDownloadURL: async () => {
                const url = `https://firebasestorage.googleapis.com/v0/b/mock/o/${encodeURIComponent(path)}`;
                console.log('MOCK STORAGE: getDownloadURL returning:', url);
                return url;
              }
            };
          }
        };
      }
    };

    const mockSupabase = {
      auth: {
        signUp: async ({ email, password, options }) => {
          console.log('MOCK SUPABASE AUTH: signUp called for', email);
          const result = await mockAuth.createUserWithEmailAndPassword(email, password);
          return { data: { user: result.user }, error: null };
        },
        getSession: async () => {
          return { data: { session: currentUser ? { user: currentUser } : null }, error: null };
        },
        onAuthStateChange: (cb) => {
          mockAuth.onAuthStateChanged((user) => {
            cb('SIGNED_IN', user ? { user } : null);
          });
        }
      },
      from: (table) => {
        return {
          upsert: async (data) => {
            console.log(`MOCK SUPABASE DB: upsert in ${table}:`, data);
            if (!store[table]) store[table] = {};
            const id = data.uid || data.id || 'mock-id';
            store[table][id] = data;
            sessionStorage.setItem('__mockStore', JSON.stringify(store));
            return { error: null };
          },
          insert: async (data) => {
            console.log(`MOCK SUPABASE DB: insert in ${table}:`, data);
            if (!store[table]) store[table] = {};
            const id = data.uid || data.id || 'mock-id';
            store[table][id] = data;
            sessionStorage.setItem('__mockStore', JSON.stringify(store));
            return { error: null };
          }
        };
      }
    };

    // Override the globals immediately. We do NOT override window.firebase itself,
    // so properties like window.firebase.firestore.FieldValue.serverTimestamp remain valid.
    Object.defineProperty(window, 'layoverxAuth', {
      get: () => mockAuth,
      set: () => {},
      configurable: true
    });
    Object.defineProperty(window, 'layoverxDb', {
      get: () => mockDb,
      set: () => {},
      configurable: true
    });
    Object.defineProperty(window, 'layoverxStorage', {
      get: () => mockStorage,
      set: () => {},
      configurable: true
    });
    Object.defineProperty(window, 'supabase', {
      get: () => mockSupabase,
      set: () => {},
      configurable: true
    });
  });

  const baseUrl = 'http://localhost:8001';

  try {
    // Clear session storage at startup
    console.log('Opening Contact page...');
    await page.goto(`${baseUrl}/contact.html`);
    await page.evaluate(() => sessionStorage.clear());
    await page.waitForLoadState('load');

    // 2. Click "Register as Supplier"
    console.log('Clicking Register as Supplier...');
    await page.click('text=Register as Supplier');
    await page.waitForURL('**/partner-registration.html');
    console.log('Successfully redirected to partner-registration.html');
    await page.waitForLoadState('load');

    // 3. Assert Auth Required panel is visible since user is Guest
    console.log('Verifying Auth Required overlay is visible...');
    const authPanel = page.locator('#auth-required-panel');
    await authPanel.waitFor({ state: 'visible', timeout: 5000 });
    const authPanelVisible = await authPanel.isVisible();
    console.log('Auth Required panel visible:', authPanelVisible);

    // 4. Perform User Sign Up
    console.log('Triggering signup modal...');
    await page.click('#auth-required-panel button:has-text("Create New Account")');
    await page.locator('#modal-signup').waitFor({ state: 'visible', timeout: 5000 });
    
    const randomEmail = `supplier_${Date.now()}@test.com`;
    console.log(`Filling out signup details for: ${randomEmail}`);
    await page.fill('#signup-name', 'Transit Lounge Partners');
    await page.fill('#signup-email', randomEmail);
    await page.fill('#signup-password', 'Pass12345678!');
    
    // Submit Sign Up Form
    await page.click('#btn-signup-submit');
    
    // Wait for auth toast confirmation and auth-user state
    console.log('Waiting for toast confirmation...');
    await page.locator('#toast-container').waitFor({ state: 'visible', timeout: 10000 });
    console.log('User signed up successfully. Stepper wizard loaded.');

    // Wait for Wizard Panel to become visible
    const wizardPanel = page.locator('#partner-wizard-panel');
    await wizardPanel.waitFor({ state: 'visible', timeout: 10000 });

    // 5. Complete step-by-step Form Onboarding
    
    // STEP 1: Owner Information
    console.log('Filling out STEP 1: Owner Information...');
    await page.fill('#owner-phone', '+91 99999 88888');
    await page.click('#next-btn');
    await page.waitForTimeout(500);

    // STEP 2: Business details
    console.log('Filling out STEP 2: Business Details...');
    await page.fill('#biz-name', 'Premium Transit Spa sahara');
    await page.selectOption('#biz-category', 'Spa');
    await page.fill('#biz-desc', 'Premium transit massage treatments and sauna relaxation lounges directly outside Mumbai Airport CSIA T2.');
    await page.click('#next-btn');
    await page.waitForTimeout(500);

    // STEP 3: Location details
    console.log('Filling out STEP 3: Location Details...');
    await page.fill('#location-airport', 'Chhatrapati Shivaji Maharaj International Airport (BOM)');
    await page.fill('#location-city', 'Mumbai');
    await page.fill('#location-state', 'Maharashtra');
    await page.fill('#location-country', 'India');
    await page.click('#next-btn');
    await page.waitForTimeout(500);

    // STEP 4: Operational details
    console.log('Filling out STEP 4: Operational Details...');
    await page.fill('#biz-website', 'https://premiumtransitspa.com');
    await page.fill('#biz-maps-link', 'https://maps.google.com/?q=Mumbai+Airport+Spa');
    await page.selectOption('#biz-type', 'Sole Proprietorship');
    await page.selectOption('#biz-pricing-range', 'Premium');
    await page.fill('#biz-services', 'Premium transit massage treatments and relaxation lounges');
    await page.fill('#biz-years', '4');
    await page.fill('#biz-staff', '12');
    await page.click('#next-btn');
    await page.waitForTimeout(500);

    // STEP 5: Document Uploads
    console.log('Uploading mock documents in STEP 5...');
    await page.setInputFiles('#upload-logo', logoPath);
    await page.setInputFiles('#upload-license', licensePath);
    await page.setInputFiles('#upload-id', idPath);
    
    // Wait for file status updates
    await page.locator('#file-logo-status').waitFor({ state: 'visible' });
    await page.locator('#file-license-status').waitFor({ state: 'visible' });
    await page.locator('#file-id-status').waitFor({ state: 'visible' });
    
    await page.click('#next-btn');
    await page.waitForTimeout(500);

    // STEP 6: Review Details & Submit
    console.log('Reviewing details in STEP 6...');
    // Capture layout screenshots of wizard before submission
    console.log('Capturing supplier registration screenshots...');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'supplier_registration_desktop.png') });
    
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'supplier_registration_tablet.png') });

    await page.setViewportSize({ width: 390, height: 800 });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'supplier_registration_mobile.png') });

    // Reset to desktop view
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(300);

    console.log('Submitting application to Firestore and uploading to Storage...');
    await page.click('#submit-btn');

    // 6. Verify success page redirect
    console.log('Waiting for success screen redirect to status page...');
    await page.waitForURL('**/supplier-status.html*');
    await page.waitForLoadState('load');
    console.log('Successfully redirected to supplier-status.html');

    const appId = await page.locator('#status-app-ref').textContent();
    console.log('Onboarding complete! Application reference ID:', appId);

    // 7. Verify Firestore document and Storage objects via direct page injection check
    const appData = await page.evaluate((aid) => {
      const storeStr = sessionStorage.getItem('__mockStore');
      const store = JSON.parse(storeStr);
      return store.supplier_applications[aid];
    }, appId);

    if (!appData) {
      throw new Error(`Firestore document with ID ${appId} was not created!`);
    }
    console.log('Verified Firestore Document matches schema:', appData.applicationId === appId);
    console.log('Firestore Status:', appData.status);
    console.log('Logo URL Uploaded:', appData.documents.logoUrl);

    // 8. Verify Supplier Dashboard Page
    console.log('Navigating to Supplier Dashboard via JS click...');
    await page.evaluate(() => {
      const btn = document.querySelector('main a[href="supplier-dashboard.html"]');
      if (btn) btn.click();
    });
    await page.waitForURL('**/supplier-dashboard.html');
    await page.waitForLoadState('load');

    // Verify dashboard displays the correct application
    const dashAppId = await page.locator('#dash-app-id').textContent();
    console.log('Dashboard Application ID:', dashAppId);
    console.log('Dashboard Application ID matches:', dashAppId === appId);
    
    const dashBizName = await page.locator('#dash-biz-name').textContent();
    console.log('Dashboard Business Name:', dashBizName);

    // Capture dashboard screenshots
    console.log('Capturing supplier dashboard screenshots...');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'supplier_dashboard_desktop.png') });
    
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'supplier_dashboard_tablet.png') });

    await page.setViewportSize({ width: 390, height: 800 });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'supplier_dashboard_mobile.png') });

    console.log('Cleaning up mock files...');
    fs.unlinkSync(logoPath);
    fs.unlinkSync(licensePath);
    fs.unlinkSync(idPath);
    fs.rmdirSync(scratchDir);

    await browser.close();
    console.log('Supplier Onboarding E2E test completed successfully!');
  } catch (err) {
    console.error('Test execution failed! Saving debug screenshot...');
    try {
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'onboarding_error.png'), fullPage: true });
      console.log('Saved debugging screenshot: onboarding_error.png');
    } catch (ssErr) {
      console.error('Could not save screenshot:', ssErr);
    }
    
    // Cleanup files in case of failure too
    try {
      fs.unlinkSync(logoPath);
      fs.unlinkSync(licensePath);
      fs.unlinkSync(idPath);
      fs.rmdirSync(scratchDir);
    } catch(cErr) {}
    
    await browser.close();
    throw err;
  }
}

run().catch(err => {
  console.error('Error running supplier onboarding test:', err);
  process.exit(1);
});
