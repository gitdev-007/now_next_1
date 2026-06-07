#!/usr/bin/env python3
"""
LayoverX Complete Build Script
Generates all pages, components, and assets with proper architecture.
"""

import os, shutil

BASE = 'frontend'

os.makedirs(f'{BASE}/pages', exist_ok=True)
os.makedirs(f'{BASE}/css', exist_ok=True)
os.makedirs(f'{BASE}/js', exist_ok=True)
os.makedirs(f'{BASE}/components', exist_ok=True)

# Shared design tokens
LINKED_CSS = '<link rel="stylesheet" href="css/design-system.css"/>'
LINKED_JS   = '<script src="js/app.js" defer></script>'

NAV_LINKS = """<div class="hidden lg:flex items-center gap-7">
  <a class="nav-link text-white/90 hover:text-white text-sm font-medium" href="hotels.html">Hotels</a>
  <a class="nav-link text-white/90 hover:text-white text-sm font-medium" href="restaurants.html">Restaurants</a>
  <a class="nav-link text-white/90 hover:text-white text-sm font-medium" href="experiences.html">Experiences</a>
  <a class="nav-link text-white/90 hover:text-white text-sm font-medium" href="airport-transfers.html">Airport Transfers</a>
  <a class="nav-link text-white/90 hover:text-white text-sm font-medium" href="how-it-works.html">How It Works</a>
  <a class="nav-link text-white/90 hover:text-white text-sm font-medium" href="contact.html">Contact</a>
  <a href="plan-my-layover.html" class="px-5 py-2.5 bg-white text-sky-600 font-semibold rounded-xl hover:bg-white/90 text-sm shadow-lg">Plan My Layover</a>
</div>
"""

MOBILE_MENU = """<div class="lg:hidden hidden bg-white/95 backdrop-blur-xl rounded-2xl mt-2 p-4 shadow-xl mx-4 border border-gray-100" id="mobile-menu">
  <a class="block text-gray-800 py-3 px-4 rounded-xl hover:bg-gray-50 text-sm font-medium" href="hotels.html">Hotels</a>
  <a class="block text-gray-800 py-3 px-4 rounded-xl hover:bg-gray-50 text-sm font-medium" href="restaurants.html">Restaurants</a>
  <a class="block text-gray-800 py-3 px-4 rounded-xl hover:bg-gray-50 text-sm font-medium" href="experiences.html">Experiences</a>
  <a class="block text-gray-800 py-3 px-4 rounded-xl hover:bg-gray-50 text-sm font-medium" href="airport-transfers.html">Airport Transfers</a>
  <a class="block text-gray-800 py-3 px-4 rounded-xl hover:bg-gray-50 text-sm font-medium" href="how-it-works.html">How It Works</a>
  <a class="block text-gray-800 py-3 px-4 rounded-xl hover:bg-gray-50 text-sm font-medium" href="contact.html">Contact</a>
  <a href="plan-my-layover.html" class="mt-2 block w-full text-center py-3 bg-sky-500 text-white font-semibold rounded-xl">Plan My Layover</a>
</div>
"""

FOOTER = """<footer class="bg-gray-900 text-white pt-16 pb-8">
  <div class="container">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
      <div class="md:col-span-1">
        <a href="/" class="flex items-center gap-2 mb-4">
          <div class="w-9 h-9 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
          </div>
          <span class="text-xl font-bold">LayoverX</span>
        </a>
        <p class="text-gray-400 text-sm leading-relaxed">Transform your Mumbai layover into an adventure. Premium hotels, restaurants, spas, tours & transfers.</p>
      </div>
      <div>
        <h4 class="font-semibold mb-4">Explore</h4>
        <ul class="space-y-2">
          <li><a class="text-gray-400 hover:text-white text-sm" href="hotels.html">Hotels</a></li>
          <li><a class="text-gray-400 hover:text-white text-sm" href="restaurants.html">Restaurants</a></li>
          <li><a class="text-gray-400 hover:text-white text-sm" href="experiences.html">Experiences</a></li>
          <li><a class="text-gray-400 hover:text-white text-sm" href="airport-transfers.html">Airport Transfers</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-semibold mb-4">Company</h4>
        <ul class="space-y-2">
          <li><a class="text-gray-400 hover:text-white text-sm" href="how-it-works.html">How It Works</a></li>
          <li><a class="text-gray-400 hover:text-white text-sm" href="contact.html">Contact</a></li>
          <li><a class="text-gray-400 hover:text-white text-sm" href="faq.html">FAQ</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-semibold mb-4">Legal</h4>
        <ul class="space-y-2">
          <li><a class="text-gray-400 hover:text-white text-sm" href="privacy.html">Privacy</a></li>
          <li><a class="text-gray-400 hover:text-white text-sm" href="terms.html">Terms</a></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p class="text-gray-500 text-xs">&copy; 2025 LayoverX. All rights reserved.</p>
      <div class="flex items-center gap-4">
        <a class="text-gray-500 hover:text-white text-xs" href="privacy.html">Privacy</a>
        <a class="text-gray-500 hover:text-white text-xs" href="terms.html">Terms</a>
      </div>
    </div>
  </div>
</footer>
"""

AUTH_MODALS = """<!-- Auth Modals -->
<div id="modal-login" class="modal-overlay" data-modal="login" role="dialog" aria-modal="true" aria-labelledby="login-title">
  <div class="modal-content">
    <button class="modal-close" aria-label="Close" onclick="layoverx.closeModal('login')">&times;</button>
    <div class="auth-form">
      <h2 id="login-title">Welcome Back</h2>
      <p>Sign in to save and manage your layover plans</p>
      <form id="form-login" onsubmit="layoverx.handleLogin(event)">
        <div class="form-group">
          <label class="form-label" for="login-email">Email</label>
          <input id="login-email" type="email" class="form-input" placeholder="you@example.com" required/>
        </div>
        <div class="form-group">
          <label class="form-label" for="login-password">Password</label>
          <input id="login-password" type="password" class="form-input" placeholder="Password" required/>
        </div>
        <div class="flex items-center justify-between">
          <label class="form-checkbox"><input type="checkbox"/> Remember me</label>
          <a href="#" class="auth-link text-sm" onclick="layoverx.openModal('forgot');return false;">Forgot Password?</a>
        </div>
        <button type="submit" class="btn btn-primary w-full">Continue</button>
      </form>
      <div class="divider">OR</div>
      <button class="social-btn" onclick="layoverx.socialLogin('google')">Continue with Google</button>
      <button class="social-btn mt-2" onclick="layoverx.socialLogin('apple')">Continue with Apple</button>
      <p class="text-sm">Don't have an account? <a href="#" class="auth-link" onclick="layoverx.switchModal('login','signup');return false;">Create Account</a></p>
    </div>
  </div>
</div>

<div id="modal-signup" class="modal-overlay" data-modal="signup" role="dialog" aria-modal="true" aria-labelledby="signup-title">
  <div class="modal-content">
    <button class="modal-close" aria-label="Close" onclick="layoverx.closeModal('signup')">&times;</button>
    <div class="auth-form">
      <h2 id="signup-title">Create Your Account</h2>
      <p>Save plans, bookmarks and personalized itineraries</p>
      <form id="form-signup" onsubmit="layoverx.handleSignup(event)">
        <div class="form-group">
          <label class="form-label" for="signup-name">Full Name</label>
          <input id="signup-name" type="text" class="form-input" placeholder="John Doe" required/>
        </div>
        <div class="form-group">
          <label class="form-label" for="signup-email">Email</label>
          <input id="signup-email" type="email" class="form-input" placeholder="you@example.com" required/>
        </div>
        <div class="form-group">
          <label class="form-label" for="signup-password">Password</label>
          <input id="signup-password" type="password" class="form-input" placeholder="Create a password" required/>
        </div>
        <button type="submit" class="btn btn-primary w-full">Create Account</button>
      </form>
      <div class="divider">OR</div>
      <button class="social-btn" onclick="layoverx.socialLogin('google')">Continue with Google</button>
      <button class="social-btn mt-2" onclick="layoverx.socialLogin('apple')">Continue with Apple</button>
      <p class="text-sm">Already have an account? <a href="#" class="auth-link" onclick="layoverx.switchModal('signup','login');return false;">Sign In</a></p>
    </div>
  </div>
</div>

<div id="modal-forgot" class="modal-overlay" data-modal="forgot" role="dialog" aria-modal="true">
  <div class="modal-content">
    <button class="modal-close" aria-label="Close" onclick="layoverx.closeModal('forgot')">&times;</button>
    <div class="auth-form">
      <h2>Reset Password</h2>
      <p>Enter your email and we'll send you reset instructions</p>
      <div class="form-group">
        <label class="form-label" for="forgot-email">Email</label>
        <input id="forgot-email" type="email" class="form-input" placeholder="you@example.com"/>
      </div>
      <button class="btn btn-primary w-full" onclick="layoverx.handleForgot()">Send Reset Link</button>
      <p class="text-sm"><a href="#" class="auth-link" onclick="layoverx.switchModal('forgot','login');return false;">Back to login</a></p>
    </div>
  </div>
</div>
"""

print("Build script ready")
