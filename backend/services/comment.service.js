const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const User = require("../models/user.model");
const { uploadImage } = require("../services/upload.service");
const { BadRequestError } = require("../core/error.response");

class CommentService {
  static create = async (
    postId,
    { userId, text, file, parentComment = null }
  ) => {
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
      postId: postId,
      text: text === "undefined" ? null : text,
      parentComment: parentComment,
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

    return await Comment.findById(comment._id)
      .select("-__v -updatedAt -postId")
      .populate({
        path: "userId",
        select: ["userName", "profile.avatar"],
      })
      .lean()
      .exec();
  };

  static updateLikes = async (userId, commentId) => {
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
}

module.exports = CommentService;
