# LayoverX Production Backend API

Production-ready, high-security Node.js/Express REST API integrated with Supabase PostgreSQL, custom JWT Authentication, Rate Limiting, CORS, and deployment settings.

---

## 📂 Backend Architecture Folder Structure

```
backend/
├── config/
│   └── supabase.js         # Administrative Supabase client
├── controllers/
│   ├── authController.js   # Registrations, Sessions, and Password Resets
│   └── userController.js   # Profile retrievals and modifications
├── middleware/
│   ├── authMiddleware.js   # JWT verification guards
│   ├── errorMiddleware.js  # Central server-exception handler
│   ├── rateLimiter.js      # Endpoint security protection
│   └── corsConfig.js       # CORS headers configurations
├── routes/
│   ├── authRoutes.js       # Auth endpoint registry
│   ├── userRoutes.js       # Protected profile endpoint registry
│   └── healthRoutes.js     # Server health metrics checker
├── validators/
│   ├── authValidator.js    # Sign-up and login schema validation
│   └── userValidator.js    # Profile update schema validation
├── utils/
│   ├── jwtHelper.js        # Access & Refresh tokens generator
│   └── passwordHelper.js   # Secure bcrypt comparison
├── app.js                  # Express middleware pipeline orchestrator
├── server.js               # Main bootstrap entry point
├── package.json            # Node.js NPM registry manifest
├── .env.example            # Boilerplate configuration values
├── schema.sql              # Database DDL initialization script
└── render.yaml             # Render deployment blueprint
```

---

## 🛠️ Local Development Installation Guide

### Prerequisite Setup
- Make sure Node.js (version 18 or above) is installed.
- Ensure a Supabase Postgres account is active.

### Steps
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize configuration file:
   - Copy `.env.example` into a new `.env` file:
     ```bash
     cp .env.example .env
     ```
   - Fill in your local variables:
     - `PORT`: Server port (e.g. `5000`)
     - `SUPABASE_URL`: Your Supabase Project API Endpoint (found under Project Settings -> API)
     - `SUPABASE_SERVICE_ROLE_KEY`: Service Role API Key (found under Project Settings -> API. Keep hidden!)
     - `JWT_SECRET` & `JWT_REFRESH_SECRET`: Secure cryptographic strings.
     - `FRONTEND_URL`: URL of your running frontend application (e.g. `http://localhost:8000`).

4. Fire up the development environment with hot-reloading:
   ```bash
   npm run dev
   ```

---

## 🗄️ Supabase PostgreSQL Setup

To initialize your PostgreSQL database schema inside Supabase, follow these instructions:
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project.
3. Open the **SQL Editor** tab from the left sidebar navigation menu.
4. Click **New Query** to create a blank workspace sheet.
5. Open [backend/schema.sql](file:///c:/Users/Dev%20Tinker/Desktop/next_layoverx_1/backend/schema.sql) in your workspace editor, copy the entire SQL script contents, and paste it into the Supabase SQL editor.
6. Click **Run** in the bottom right corner of the dashboard screen.
7. This will automatically:
   - Create tables `users`, `profiles`, `hotels`, `restaurants`, `spa_services`, `gaming_services`, `tours`, `transfers`, `password_resets`.
   - Setup relationships, indexes, constraints, and Row Level Security (RLS) policies.
   - Seed the database lookup tables with the default LayoverX travel marketplace datasets.

---

## 🌐 Render Cloud Deployment

Render allows you to quickly deploy Node.js web applications directly from your Git repository using the declared `render.yaml` configuration.

### Steps
1. Commit the backend repository files to GitHub or GitLab.
2. Sign in to your [Render Dashboard](https://dashboard.render.com).
3. Click **New +** in the navigation header bar and select **Blueprint**.
4. Connect your git repository containing the `backend/` files.
5. Render will automatically parse the `render.yaml` file, identify the service named `layoverx-backend`, and configure it.
6. Provide the environment values when prompted by the blueprint deployer:
   - `SUPABASE_URL`: Your project url.
   - `SUPABASE_SERVICE_ROLE_KEY`: Secret service role key.
   - `JWT_SECRET` and `JWT_REFRESH_SECRET` will generate automatically if left blank.
7. Click **Deploy**. Your API server will compile (`npm install`) and start running (`npm start`) on a secure HTTP link.

---

## 🔌 Frontend Connection Integration Steps

The backend handles requests under standard REST formats. To connect your frontend client forms (like registration, login, and profile modals) to this backend, use these `fetch` implementation templates.

### 1. Signup Form Submission Example
```javascript
async function registerUser(fullName, email, password) {
  const submitButton = document.getElementById('signup-submit');
  const loadingSpinner = document.getElementById('signup-spinner');
  
  // Update UI Loading State
  submitButton.disabled = true;
  loadingSpinner.classList.remove('hidden');

  try {
    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fullName, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle express-validator validation error structures
      const errorMsg = data.errors ? data.errors.map(err => err.msg).join(', ') : data.message;
      throw new Error(errorMsg || 'Failed to complete registration');
    }

    // Success - Store tokens securely (SessionStorage, LocalStorage, or secure HttpOnly cookie)
    localStorage.setItem('layoverx_access_token', data.accessToken);
    localStorage.setItem('layoverx_refresh_token', data.refreshToken);
    localStorage.setItem('layoverx_user', JSON.stringify(data.user));

    alert('Registration successful! Welcome to LayoverX.');
    window.location.reload();
  } catch (error) {
    alert(`Signup Error: ${error.message}`);
  } finally {
    submitButton.disabled = false;
    loadingSpinner.classList.add('hidden');
  }
}
```

### 2. Login Form Submission Example
```javascript
async function loginUser(email, password) {
  const submitButton = document.getElementById('login-submit');
  const loadingSpinner = document.getElementById('login-spinner');
  
  submitButton.disabled = true;
  loadingSpinner.classList.remove('hidden');

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Authentication failed');
    }

    // Success - Save JWT tokens
    localStorage.setItem('layoverx_access_token', data.accessToken);
    localStorage.setItem('layoverx_refresh_token', data.refreshToken);
    localStorage.setItem('layoverx_user', JSON.stringify(data.user));

    alert(`Welcome back, ${data.user.fullName}!`);
    window.location.reload();
  } catch (error) {
    alert(`Login Error: ${error.message}`);
  } finally {
    submitButton.disabled = false;
    loadingSpinner.classList.add('hidden');
  }
}
```

### 3. Logout Integration Example
```javascript
async function logoutUser() {
  const accessToken = localStorage.getItem('layoverx_access_token');

  try {
    // Call server route to notify invalidation (optional but clean)
    await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  } catch (err) {
    console.warn('Logout notification request failed:', err);
  } finally {
    // Clear tokens locally
    localStorage.removeItem('layoverx_access_token');
    localStorage.removeItem('layoverx_refresh_token');
    localStorage.removeItem('layoverx_user');

    alert('You have logged out successfully.');
    window.location.reload();
  }
}
```

### 4. Authenticated API Request (Fetch profile)
```javascript
async function fetchUserProfile() {
  const accessToken = localStorage.getItem('layoverx_access_token');

  if (!accessToken) {
    console.warn('No authentication token found. User is offline.');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const data = await response.json();

    if (response.status === 401) {
      // Access token expired, implement automatic silent token refresh here
      console.warn('Access token expired. Refresh required.');
      return;
    }

    if (!response.ok) throw new Error(data.message);

    console.log('User Profile:', data.profile);
  } catch (error) {
    console.error('Fetch Profile Failure:', error.message);
  }
}
```

---

## 🔒 Production Deployment Security Checklist
* [ ] Change default JWT secrets in the Render environment variables dashboard.
* [ ] Verify Helmet security headers are blocking scripting injection (XSS) and Clickjacking.
* [ ] Tighten `FRONTEND_URL` in env settings to match the exact production URL, removing `*` or wildcard permissions.
* [ ] Ensure database Row Level Security policies (RLS) are active and correct in the Supabase Dashboard.
* [ ] Verify rate limiter middleware rules are active on authentication routes (`/api/auth/login`, `/api/auth/signup`) preventing brute force.
* [ ] Confirm that error middleware suppresses code stack traces on production nodes.
