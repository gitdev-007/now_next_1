const { supabaseAdmin } = require('../config/supabase');
const { hashPassword, verifyPassword } = require('../utils/passwordHelper');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwtHelper');
const { ApiError } = require('../middleware/errorMiddleware');
const crypto = require('crypto');

/**
 * Handle user signup registration
 */
const signup = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  try {
    // 1. Check if user already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (checkError) throw checkError;
    if (existingUser) {
      return next(new ApiError('Email address is already registered', 400));
    }

    // 2. Hash password
    const passwordHash = await hashPassword(password);

    // 3. Create user record
    const { data: newUser, error: createError } = await supabaseAdmin
      .from('users')
      .insert([{ email: email.toLowerCase(), password_hash: passwordHash }])
      .select()
      .single();

    if (createError) throw createError;

    // 4. Create associated profile record
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([{ id: newUser.id, full_name: fullName }]);

    if (profileError) {
      // Rollback user creation on profile insertion error
      await supabaseAdmin.from('users').delete().eq('id', newUser.id);
      throw profileError;
    }

    // 5. Generate Access & Refresh tokens
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      accessToken,
      refreshToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle user login authentication
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 1. Retrieve user credentials
    const { data: user, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!user) {
      return next(new ApiError('Invalid email address or password', 401));
    }

    // 2. Verify hashed password
    const isMatch = await verifyPassword(password, user.password_hash);
    if (!isMatch) {
      return next(new ApiError('Invalid email address or password', 401));
    }

    // 3. Fetch user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) throw profileError;

    // 4. Generate Tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: profile ? profile.full_name : 'User',
        avatarUrl: profile ? profile.avatar_url : null
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle user logout sign-out
 */
const logout = async (req, res, next) => {
  try {
    // In stateless JWT architectures, the client discards the tokens.
    // To support server-side token invalidation, we confirm successful receipt and flag client cleanup.
    res.status(200).json({
      success: true,
      message: 'Logout successful. Please discard access and refresh tokens.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle forgot password token request
 */
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    // 1. Verify user exists
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (userError) throw userError;
    if (!user) {
      // Respond with 200 to prevent user enumeration security disclosure
      return res.status(200).json({
        success: true,
        message: 'If the email matches a registered account, a password reset link has been generated.'
      });
    }

    // 2. Generate secure random token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Expires in 1 hour

    // 3. Save password reset record
    const { error: resetError } = await supabaseAdmin
      .from('password_resets')
      .insert([{ email: email.toLowerCase(), token, expires_at: expiresAt.toISOString() }]);

    if (resetError) throw resetError;

    // 4. Simulated Email Sending (Production: Integrate nodemailer, SendGrid, or AWS SES)
    console.log(`[EMAIL DISPATCH] Password Reset requested for ${email}. Token: ${token}. Use POST /api/auth/reset-password to update.`);

    res.status(200).json({
      success: true,
      message: 'If the email matches a registered account, a password reset link has been generated.',
      // Expose reset token in development for QA / manual testing
      resetToken: process.env.NODE_ENV === 'development' ? token : undefined
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle password reset implementation
 */
const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  try {
    // 1. Find valid reset token
    const { data: reset, error: resetError } = await supabaseAdmin
      .from('password_resets')
      .select('*')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (resetError) throw resetError;
    if (!reset) {
      return next(new ApiError('Invalid or expired password reset token', 400));
    }

    // 2. Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // 3. Update user password
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ password_hash: newPasswordHash })
      .eq('email', reset.email);

    if (updateError) throw updateError;

    // 4. Delete consumed reset token
    await supabaseAdmin
      .from('password_resets')
      .delete()
      .eq('id', reset.id);

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new credentials.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword
};
