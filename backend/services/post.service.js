const Post = require("../models/post.model");
const ObjectId = require("mongoose").Types.ObjectId;
const User = require("../models/user.model");
const Comment = require("../models/comment.model");
const { uploadImage, destroyImage } = require("./upload.service");
const { BadRequestError } = require("../core/error.response");
const NotificationService = require("./notification.service");

class PostService {
  static create = async ({ userId, content, file }) => {
    const user = await User.findOne({ _id: userId }).lean();
    if (!user) {
      throw new BadRequestError("User not found!");
    }
    console.log({ userId, content, file });
    const post = new Post({
      content: content,
      postedBy: userId,
    });
    if (file != undefined) {
      const { image_url } = await uploadImage({
        path: file.path,
        name: `${user._id}-${post._id}`,
      });
      post.image = image_url;
    }
    await post.save();

    NotificationService.create(userId, {
      target: {
        userId: null,
        postId: post._id,
        commentId: null,
      },
      type: "post",
      content: `${user?.profile.name} has posted a new thread.`,
    });

    return await Post.findById(post._id)
      .select("-__v -updatedAt")
      .populate("postedBy", "userName profile.name profile.avatar")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "userName profile.avatar",
        },
      })
      .lean()
      .exec();
  };

  static update = async ({ userId, postId, content, file }) => {
    const user = await User.findOne({ _id: userId }).lean();
    if (!user) {
      throw new BadRequestError("User not found!");
    }
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      throw new BadRequestError("Post not found!");
    }
    if (file) {
      if (post.image) {
        await destroyImage(post.image);
      }
      const { image_url } = await uploadImage({
        path: file.path,
        name: `${user.userName}-${post._id}`,
      });
      post.image = image_url;
    }
    return await post.save();
  };

  static updateLikes = async (userId, postId) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found!");
    }
    let post = await Post.findById({ _id: postId });
    const userLikedPost = post.likes.includes(userId);
    if (!userLikedPost) {
      post = await Post.findOneAndUpdate(
        { _id: postId },
        {
          $addToSet: {
            likes: userId,
          },
        },
        { new: true }
      ).lean();
      NotificationService.create(userId, {
        target: {
          userId: null,
          postId: post._id,
          commentId: null,
        },
        type: "replypost",
        content: `${user?.profile.name} has liked your thread.`,
      });
    } else {
      post = await Post.findOneAndUpdate(
        { _id: postId },
        {
          $pull: {
            likes: userId,
          },
        },
        { new: true }
      ).lean();
    }
    return post;
  };

  static getById = async (postId) => {
    let post = await Post.findById({ _id: postId })
      .select("-__v")
      .lean()
      .populate("postedBy", "userName profile.avatar")
      .populate({
        path: "comments",
        select: "-__v -updatedAt -postId",
        populate: {
          path: "userId",
          select: "userName profile.avatar",
        },
      })
      .exec();
    return post;
  };

  static getAll = async () => {
    let posts = await Post.find()
      .select("-__v")
      .lean()
      .populate("postedBy", "userName profile.avatar")
      .populate({
        path: "comments",
        select: "userId",
        populate: {
          path: "userId",
          select: "userName profile.avatar",
        },
      })
      .exec();
    return posts;
  };

  static getAllPostsFollowing = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found!");
    }
    const posts = await Post.find({
      $or: [
        {
          postedBy: { $in: user.profile.following },
        },
        { postedBy: userId },
      ],
    })
      .select("-__v -updatedAt")
      .populate("postedBy", "userName profile.name profile.avatar")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "userName profile.avatar",
        },
        sort: { createdAt: -1 },
        limit: 3,
      })
      .sort({
        createdAt: -1,
      })
      .lean();
    return posts;
  };

  static getAllUserPosts = async (userName) => {
    const user = await User.findOne({ userName }).lean();
    if (!user) {
      throw new BadRequestError("User not found!");
    }
    const posts = await Post.find({ postedBy: user._id })
      .select("-__v -updatedAt")
      .populate("postedBy", "userName profile.name profile.avatar")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "userName profile.avatar",
        },
      })
      .sort({ createdAt: -1 })
      .lean();
    return posts;
  };

  static getPostsByKeyword = async ({ currentUser, keyword }) => {
    let options = {};
    if (keyword === "undefined") {
      options = {
        postedBy: { $ne: currentUser },
      };
    } else {
      options = {
        postedBy: { $ne: currentUser },
        content: { $regex: new RegExp(keyword, "i") },
      };
    }
    const posts = await Post.find(options)
      .select("-__v -updatedAt")
      .populate("postedBy", "userName profile.name profile.avatar")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "userName profile.avatar",
        },
      })
      .sort({ createdAt: -1 })
      .lean();
    return posts;
  };

  static delete = async (postId) => {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      throw new BadRequestError("Post not found!");
    }
    if (post.image) {
      await destroyImage(post.image);
    }
    if (post.comments) {
      Comment.deleteMany({
        parentComment: { $regex: new RegExp(postId, "i") },
      });
    }
    return await Post.deleteOne({ _id: postId });
  };
}

module.exports = PostService;
