const User = require("../models/user.model");
const { BadRequestError } = require("../core/error.response");
const { getInfoData, flattenNestedObject } = require("../utils/index");
const { createKeyToken } = require("../utils/authUtils");
const bcrypt = require("bcrypt");

class UserService {
  static create = async ({ username, name, email, password }) => {
    const isEmailExist = await User.findOne({ email: email });
    if (isEmailExist) {
      throw new BadRequestError("Email already exist");
    }

    const isUserNameExist = await User.findOne({ userName: username });
    if (isUserNameExist) {
      throw new BadRequestError("Username already exist");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName: username,
      email: email,
      password: passwordHash,
      profile: { name: name },
    });

    const token = createKeyToken(
        { _id: user._id },
        process.env.ACCESS_TOKEN_KEY_SECRET
    );

    return {
      token: token,
      user: getInfoData(['_id', 'userName', 'avatar'], flattenNestedObject(user, ['profile'])),
    }
  };

  static login = async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new BadRequestError("Wrong email!");
    }
    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      throw new BadRequestError("Wrong password!");
    }

    const token = createKeyToken(
      { _id: user._id },
      process.env.ACCESS_TOKEN_KEY_SECRET,
    );

    return {
      token: token,
      user: getInfoData(['_id', 'userName', 'avatar'], flattenNestedObject(user, ['profile'])),
    }
  };

  static logout = async (userId) => {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new BadRequestError("User not found!");
    }
    return;
  }

  static getUserInfor = async ({ userId }) => {
    const user = await User.findById({ _id: _id });
    if (!user) {
      throw new BadRequestError("User not found!");
    }
    return getInfoData(['userName', 'email', 'profile'], user);
  }

  static getByUsername = async ( username ) => {
    const user = await User.findOne({ userName: username });
    if (!user) {
      throw new BadRequestError("User not found!");
    }
    return getInfoData(['_id', 'userName', 'email', 'profile'], user);
  }

  static updateProfile = async ( userId, { bio, link }) => {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          "profile.bio": bio,
          "profile.link": link,
        },
      },
      { new: true }
    );
    if (!user) {
      throw new BadRequestError("User not found!");
    }
    return getInfoData(['_id', 'userName', 'email', 'profile'], user);
  }

  static updateFollow = async (currentUserId, userIdTarget) => {
    let currentUser = await User.findOne({ _id: currentUserId });
    if(!currentUser) {
      throw new BadRequestError("Current user not found!");
    }
    let userTarget = await User.findOne({ _id: userIdTarget });
    if(!userTarget) {
      throw new BadRequestError("Target user not found!");
    }
    if (currentUserId === userIdTarget) {
      throw new BadRequestError("You can't follow yourself!");
    }

    const isFollowing = userTarget.profile.followers.includes(currentUserId);
    if(!isFollowing) {
      // follow
      userTarget = await User.findOneAndUpdate({ _id: userIdTarget }, {
        $addToSet: {
          "profile.followers": currentUserId,
        }
      }, { new: true }).lean();
      currentUser = await User.findOneAndUpdate({ _id: currentUserId }, {
        $addToSet: {
          "profile.following": userIdTarget,
        }
      }, { new: true }).lean();
    } else {
      // unfollow
      userTarget = await User.findOneAndUpdate({ _id: userIdTarget }, {
        $pull: {
          "profile.followers": currentUserId,
        }
      }, { new: true }).lean();
      currentUser = await User.findOneAndUpdate({ _id: currentUserId }, {
        $pull: {
          "profile.following": userIdTarget,
        }
      }, { new: true }).lean();
    }
    return userTarget;
  }
}

module.exports = UserService;
