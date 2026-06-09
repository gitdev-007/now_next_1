const { supabaseAdmin } = require('../config/supabase');
const { ApiError } = require('../middleware/errorMiddleware');

/**
 * Retrieve current user profile details
 */
const getProfile = async (req, res, next) => {
  const userId = req.user.id; // Populated by authenticateToken middleware

  try {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('full_name, avatar_url, updated_at')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    if (!profile) {
      return next(new ApiError('User profile details not found', 404));
    }

    res.status(200).json({
      success: true,
      profile: {
        id: userId,
        email: req.user.email,
        fullName: profile.full_name,
        avatarUrl: profile.avatar_url,
        updatedAt: profile.updated_at
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update current user profile details
 */
const updateProfile = async (req, res, next) => {
  const userId = req.user.id;
  const { fullName, avatarUrl } = req.body;

  try {
    const updates = {
      updated_at: new Date().toISOString()
    };

    if (fullName !== undefined) updates.full_name = fullName;
    if (avatarUrl !== undefined) updates.avatar_url = avatarUrl;

    const { data: updatedProfile, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!updatedProfile) {
      return next(new ApiError('Unable to update user profile', 400));
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: {
        id: userId,
        email: req.user.email,
        fullName: updatedProfile.full_name,
        avatarUrl: updatedProfile.avatar_url,
        updatedAt: updatedProfile.updated_at
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile
};
