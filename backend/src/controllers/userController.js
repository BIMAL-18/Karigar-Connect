const getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
};

const updateProfile = async (req, res, next) => {
  try {
    const user = req.user;

    const {
      name,
      phone,
      avatar
    } = req.body;

    if (name !== undefined) {
      user.name = name;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile
};