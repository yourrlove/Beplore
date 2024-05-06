const Post = require('../models/post.model');
const Comment = require('../models/comment.model');

class CommentService {
    static create = async (postId, { userId, text, image, parentComment=null }) => {
        const comment = await Comment.create({
            userId: userId,
            text: text,
            image: image,
            parentComment: parentComment
        }); 
        const post = await Post.findOneAndUpdate({ _id: postId }, {
            $addToSet: {
                comments: comment._id,
            }
        })
        return comment;
    }

    static updateLikes = async (userId, commentId) => {
        let comment = await Comment.findById({ _id: commentId });
        const userLikedComment = comment.likes.includes(userId);
        if(!userLikedComment) {
            comment = await Comment.findOneAndUpdate({ _id: commentId }, {
                $addToSet: {
                    likes: userId,
                }
            }, { new: true }).lean();
        } else {
            comment = await Comment.findOneAndUpdate({ _id: commentId }, {
                $pull: {    
                    likes: userId,
                }
            }, { new: true }).lean();
        }
        return comment;
    }
}

module.exports = CommentService;