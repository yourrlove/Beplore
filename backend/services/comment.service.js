const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const User = require("../models/user.model");
const { uploadImage } = require("../services/upload.service");
const { BadRequestError } = require("../core/error.response");
const NotificationService = require("../services/notification.service");

class CommentService {
  static create = async (postId, { userId, content, file }) => {
    const user = await User.findOne({ _id: userId }).lean();
    if (!user) {
      throw new BadRequestError("User not found!");
    }
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      throw new BadRequestError("Post not found!");
    }
    const comment = new Comment({
      userId: userId,
      content: content === "undefined" ? null : content,
      parentComment: postId
    });

    if (file) {
      const { image_url } = await uploadImage({
        path: image.path,
        name: `${user.userName}-${post._id}-${comment._id}`,
      });
      comment.image = image_url;
    }
    await comment.save();
    post.comments.push(comment._id);
    await post.save();

    NotificationService.create(userId, {
      target: {
        userId: null,
        postId: post._id,
        commentId: null,
      },
      type: "replypost",
      content: `${user?.profile.name} has replied your post.`,
    });

    return await Comment.findById(comment._id)
      .select("-__v -updatedAt -postId")
      .populate({
        path: "userId",
        select: ["userName", "profile.avatar"],
      })
      .lean()
      .exec();
  };

  static createSubComment = async (commentId, { userId, content, file }) => {
    const user = await User.findOne({ _id: userId }).lean();
    if (!user) {
      throw new BadRequestError("User not found!");
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new BadRequestError("Post not found!");
    }
    const parentComment = `${comment.parentComment},${commentId}`;
    const subComment = new Comment({
      userId: userId,
      content: content === "undefined" ? null : content,
      parentComment: parentComment,
    });

    if (file) {
      const { image_url } = await uploadImage({
        path: image.path,
        name: `${user.userName}-${subComment._id}`,
      });
      comment.image = image_url;
    }
    await subComment.save();
    comment.replies.push(subComment._id);
    await comment.save();

    NotificationService.create(userId, {
      target: {
        userId: null,
        postId: null,
        commentId: commentId,
      },
      type: "replycomment",
      content: `${user?.profile.name} has replied your comment.`,
    });

    return await Comment.findById(subComment._id)
      .select("-__v -updatedAt")
      .populate({
        path: "userId",
        select: ["userName", "profile.avatar"],
      })
      .lean()
      .exec();
  };

  static updateLikes = async (userId, commentId) => {
    const user = await User.findById(userId).lean();
    if (!user) {
      throw new BadRequestError("User not found!");
    }
    let comment = await Comment.findById({ _id: commentId });
    const userLikedComment = comment.likes.includes(userId);
    if (!userLikedComment) {
      comment = await Comment.findOneAndUpdate(
        { _id: commentId },
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
          postId: null,
          commentId: commentId,
        },
        type: "replycomment",
        content: `${user?.profile.name} has liked your comment.`,
      });
    } else {
      comment = await Comment.findOneAndUpdate(
        { _id: commentId },
        {
          $pull: {
            likes: userId,
          },
        },
        { new: true }
      ).lean();
    }
    return comment;
  };

  static getAllPostComments = async (postId) => {
    const post = await Post.findById(postId).lean();
    if (!post) {
      throw new BadRequestError("Post not found!");
    }

    const comments = await Comment.find({
      _id: { $in: post.comments },
    })
      .select("-__v -updatedAt")
      .populate({
        path: "userId",
        select: ["userName", "profile.avatar"],
      })
      .lean()
      .exec();

    return comments;
  };

  static deleteComment = async (postId, commentId) => {
    const post = await Post.findById(postId);
    if (!post) {
      throw new BadRequestError("Post not found!");
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new BadRequestError("Comment not found!");
    }
    if (comment.replies) {
      await Comment.deleteMany({ parentComment: { $regex: new RegExp(commentId, 'i') } }).exec();
    }
    post.comments = post.comments.filter(comment => comment !== commentId);
    await post.save();
    return await Comment.deleteOne({_id: commentId});
  };

  static deleteSubComment = async (parentCommentId, commentId) => {
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      throw new BadRequestError("Parent comment not found!");
    }
    const deleteComment = await Comment.findById(commentId);
    if (!deleteComment) {
      throw new BadRequestError("Delete Comment not found!");
    }
    if (deleteComment.replies) {
      await Comment.deleteMany({ parentComment: { $regex: new RegExp(commentId, 'i') } }).exec();
    }
    parentComment.replies = parentComment.replies.filter(id => id !== commentId);
    await parentComment.save();
    return await Comment.deleteOne({_id: commentId});
  };

  static getSubComments = async (commentId) => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new BadRequestError("Comment not found!");
    }
    const subComments = await Comment
                              .find({_id: { $in: comment.replies }})
                              .select("-__v -updatedAt")
                              .populate({
                                 path: "userId",
                                 select: ["userName", "profile.avatar"],
                               })
                              .lean()
                              .exec();
    return subComments;
  };

  static getById = async (commentId) => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new BadRequestError("Comment not found!");
    }
    return await Comment
                .findById(commentId)
                .select("-__v -updatedAt")
                .populate({
                   path: "userId",
                   select: ["userName", "profile.avatar", "profile.name"],
                 })
                 .lean()
                 .exec();
  }
}

module.exports = CommentService;
