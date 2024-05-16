const User = require("../models/user.model");
const { BadRequestError } = require("../core/error.response");
const { getInfoData, flattenNestedObject } = require("../utils/index");
const { createKeyToken } = require("../utils/authUtils");
const bcrypt = require("bcrypt");
const { uploadImage, destroyImage } = require("../services/upload.service");
const NotificationService = require("../services/notification.service");

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
      user: getInfoData(
        ["_id", "userName", "avatar"],
        flattenNestedObject(user, ["profile"])
      ),
    };
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
      process.env.ACCESS_TOKEN_KEY_SECRET
    );

    return {
      token: token,
      user: getInfoData(
        ["_id", "userName", "avatar", "following"],
        flattenNestedObject(user, ["profile"])
      ),
    };
  };

  static logout = async (userId) => {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new BadRequestError("User not found!");
    }
    return;
  };

  static getUserInfor = async ({ userId }) => {
    const user = await User.findById({ _id: _id });
    if (!user) {
      throw new BadRequestError("User not found!");
    }
    return getInfoData(["userName", "email", "profile"], user);
  };

  static getByUsername = async (username) => {
    const user = await User.findOne({ userName: username });
    if (!user) {
      throw new BadRequestError("User not found!");
    }
    return getInfoData(["_id", "userName", "email", "profile"], user);
  };

  static updateProfile = async (userId, { bio, link, file }) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found!");
    }
    if (file) {
      if (user.profile.avatar) {
        await destroyImage(user.profile.avatar);
      }
      const { image_url } = await uploadImage({
        path: file.path,
        name: `${user.userName}-avatar`,
      });
      user.profile.avatar = image_url;
    }
    if (bio !== "undefined" && bio !== "null") user.profile.bio = bio;
    if (link !== "undefined" && link !== "null") user.profile.link = link;
    await user.save();
    return getInfoData(["_id", "userName", "email", "profile"], user);
  };

  static updateFollow = async (currentUserId, userIdTarget) => {
    let currentUser = await User.findOne({ _id: currentUserId });
    if (!currentUser) {
      throw new BadRequestError("Current user not found!");
    }
    let userTarget = await User.findOne({ _id: userIdTarget });
    if (!userTarget) {
      throw new BadRequestError("Target user not found!");
    }
    if (currentUserId === userIdTarget) {
      throw new BadRequestError("You can't follow yourself!");
    }

    const isFollowing = userTarget.profile.followers.includes(currentUserId);
    if (!isFollowing) {
      // follow
      userTarget = await User.findOneAndUpdate(
        { _id: userIdTarget },
        {
          $addToSet: {
            "profile.followers": currentUserId,
          },
        },
        { new: true }
      ).lean();
      currentUser = await User.findOneAndUpdate(
        { _id: currentUserId },
        {
          $addToSet: {
            "profile.following": userIdTarget,
          },
        },
        { new: true }
      ).lean();
      NotificationService.create(currentUserId, {
        target: {
          userId: userIdTarget,
          postId: null,
          commentId: null,
        },
        type: "user",
        content: `${currentUser?.profile.name} has followed you.`,
      });
    } else {
      // unfollow
      userTarget = await User.findOneAndUpdate(
        { _id: userIdTarget },
        {
          $pull: {
            "profile.followers": currentUserId,
          },
        },
        { new: true }
      ).lean();
      currentUser = await User.findOneAndUpdate(
        { _id: currentUserId },
        {
          $pull: {
            "profile.following": userIdTarget,
          },
        },
        { new: true }
      ).lean();
    }
    return userTarget;
  };

  static updateAvatar = async (userId, file) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found!");
    }
    if (!file) {
      throw new BadRequestError("File missing!");
    }
    if (user.profile.avatar) {
      await destroyImage(user.profile.avatar);
    }
    const { image_url } = await uploadImage({
      path: file.path,
      name: `${user.userName}-avatar`,
    });
    user.profile.avatar = image_url;
    await user.save();
    return getInfoData(
      ["_id", "userName", "avatar"],
      flattenNestedObject(user, ["profile"])
    );
  };

  static getAllUsers = async ({ currentUser, keyword }) => {
    let options = {};
    if (keyword === "undefined") {
      options = { _id: { $ne: currentUser } };
    } else {
      options = {
        _id: { $ne: currentUser },
        $or: [
          { userName: { $regex: new RegExp(keyword, "i") } },
          { "profile.name": { $regex: new RegExp(keyword, "i") } },
        ],
      };
    }
    const users = await User.find(options)
      .select("_id userName profile.name profile.avatar profile.followers")
      .lean();
    if (!users) {
      throw new BadRequestError("Not have any registered user!");
    }
    return users;
  };
}

module.exports = UserService;
