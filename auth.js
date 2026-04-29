// =============================================
//  DIGITAL DIARIES — auth.js
//  Handles: Google OAuth, Email/Password login
// =============================================

// 🔧 REPLACE THESE with your Supabase project values
//    (you'll get these in Step 2 of the README)
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjem9hZ252c2xldnZ0Ym55bHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NjgxMTMsImV4cCI6MjA5MzA0NDExM30.6HFWkCYo8KcXXxa615JLohKnhzxVpo5NRANtbY_-k08';

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Redirect if already logged in ---
(async () => {
  const { data: { session } } = await sb.auth.getSession();
  if (session) window.location.href = 'dashboard.html';
})();

// --- Google OAuth ---
async function signInWithGoogle() {
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/dashboard.html' }
  });
  if (error) showMsg(error.message, 'error');
}

// --- Email Sign In ---
async function signInWithEmail() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (!email || !password) return showMsg('Please fill in email and password.', 'error');

  showMsg('Signing in...', 'success');
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return showMsg(error.message, 'error');
  window.location.href = 'dashboard.html';
}

// --- Email Sign Up ---
async function signUpWithEmail() {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;

  if (!name || !email || !password) return showMsg('Please fill in all fields.', 'error');
  if (password.length < 6) return showMsg('Password must be at least 6 characters.', 'error');

  showMsg('Creating your account...', 'success');
  const { error } = await sb.auth.signUp({
    email, password,
    options: { data: { full_name: name } }
  });
  if (error) return showMsg(error.message, 'error');
  showMsg('✅ Account created! Check your email to confirm, then sign in.', 'success');
}

// --- Forgot Password ---
async function forgotPassword() {
  const email = document.getElementById('login-email').value.trim();
  if (!email) return showMsg('Enter your email above first.', 'error');
  const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/index.html'
  });
  if (error) return showMsg(error.message, 'error');
  showMsg('📧 Password reset email sent! Check your inbox.', 'success');
}

// --- Tab switching ---
function switchTab(tab) {
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
  document.getElementById('form-login').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('form-signup').style.display = tab === 'signup' ? 'block' : 'none';
}

// --- Message helper ---
function showMsg(msg, type) {
  const el = document.getElementById('auth-msg');
  el.textContent = msg;
  el.className = 'auth-msg ' + type;
  el.classList.remove('hidden');
}
