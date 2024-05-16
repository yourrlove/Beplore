const Notification = require("../models/notification.model");
const User = require("../models/user.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const { BadRequestError } = require("../core/error.response");

class NotificationService {
  static create = async (userId, body = {}) => {

    const { postId, commentId } = body.target;
    const [user, post, comment] = await Promise.all([
      User.findById(userId).lean(),
      Post.findById(postId),
      Comment.findById(commentId),
    ]);
    if (!user) {
      throw new BadRequestError("User not found!");
    }
    if (postId && !post) {
      throw new BadRequestError("Post not found!");
    }
    if (commentId && !comment) {
      throw new BadRequestError("Comment not found!");
    }
    if (body.type === "post") {
      const users = await User.find({
        _id: { $in: user.profile.followers },
      });
      await Promise.all(
        users.map(async (user_target) => {
          body.target.userId = user_target._id;
          if (user._id.toString() != body.target.userId.toString()) {
            const notification = new Notification({
              source: {
                userId: user._id,
                userName: user.userName,
                avatar: user.profile.avatar,
              },
              ...body,
            });
            await notification.save();
          }
        })
      );
    } else if (body.type === "replypost") {
    
      const user_target = await User.findById(post.postedBy);
      if (!user_target) {
        throw new BadRequestError("User not found!");
      }
      body.target.userId = user_target._id;
      if (user._id.toString() != body.target.userId.toString()) {
        const notification = new Notification({
          source: {
            userId: user._id,
            userName: user.userName,
            avatar: user.profile.avatar,
          },
          ...body,
        });
        await notification.save();
      }
    } else if (body.type === "replycomment") {
      const user_target = await User.findById(comment.userId);
      if (!user_target) {
        throw new BadRequestError("User not found!");
      }
      body.target.userId = user_target._id;
      if (user._id.toString() != body.target.userId.toString()) {
        const notification = new Notification({
          source: {
            userId: user._id,
            userName: user.userName,
            avatar: user.profile.avatar,
          },
          ...body,
        });
        await notification.save();
      }
    } else if (body.type === "user") {
      if (user._id.toString() != body.target.userId.toString()) {
        const notification = new Notification({
          source: {
            userId: user._id,
            userName: user.userName,
            avatar: user.profile.avatar,
          },
          ...body,
        });
        await notification.save();
      }
    }
    return "Done!";
  };

  static getAllByUserId = async (userId, isRead) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found!");
    }
    isRead = isRead === 'false' ? false : true;
    const notifications = await Notification.find({
      "target.userId": userId,
      isRead: isRead,
    })
    .populate({
      path: "target.postId",
      populate: {
        path: "postedBy",
        select: "userName",
      },
    })
    .populate({
      path: "target.commentId",
      populate: {
        path: "userId",
        select: "userName",
      },
    })
    .exec()
    return notifications;
  };

  static updateRead = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found!");
    }
    const notifications = await Notification.updateMany(
      { "target.userId": userId },
      { $set: { isRead: true } }
    );
    return notifications;
  }
}

module.exports = NotificationService;
