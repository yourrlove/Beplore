const Post = require('../models/post.model');
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/user.model');
const { uploadImage, destroyImage } = require('./upload.service');
const { BadRequestError } = require('../core/error.response');

class PostService {
    static create = async ({ userId, content, file }) => {
        const user = await User.findOne({ _id: userId }).lean();
        if (!user) {
            throw new BadRequestError("User not found!");
        }
        const post = new Post({
            content: content,
            postedBy: userId,
        })
        const { image_url } = await uploadImage({
            path: file.path,
            name: `${user.userName}-${post._id}`,
        });

        post.image = image_url;
        await post.save();
        return post;
    }

    static update = async ({ userId, postId, content, file }) => {
        console.log(userId);
        const user = await User.findOne({ _id: userId }).lean();
        if (!user) {
            throw new BadRequestError("User not found!");
        }
        const post = await Post.findOne({ _id: postId });
        if(!post) {
            throw new BadRequestError("Post not found!");
        }
        if(file) {
            if(post.image) {
                await destroyImage(post.image);
            }
            const { image_url } = await uploadImage({
                path: file.path,
                name: `${user.userName}-${post._id}`,
            });
            post.image = image_url;

        }
        return await post.save();
    }

    static updateLikes = async (userId, postId) => {
        let post = await Post.findById({ _id: postId });
        const userLikedPost = post.likes.includes(userId);
        if(!userLikedPost) {
            post = await Post.findOneAndUpdate({ _id: postId }, {
                $addToSet: {
                    likes: userId,
                }
            }, { new: true }).lean();
        } else {
            post = await Post.findOneAndUpdate({ _id: postId }, {
                $pull: {
                    likes: userId,
                }
            }, { new: true }).lean();
        }
        return post;
    }

    static getById = async (postId) => {
        let post = await Post
                            .findById({ _id: postId })
                            .select("-__v")
                            .lean()
                            .populate("postedBy", 'userName profile.avatar')
                            .populate("comments", "-createdAt -updatedAt -__v")
                            .exec();
        return post;
    }
    
    static getAll = async () => {
        let posts = await Post
                           .find()
                           .select("-__v")
                           .lean()
                           .populate("postedBy", 'userName profile.avatar')
                           .populate({
                                path: 'comments',
                                select: 'userId',
                                populate: {
                                    path: 'userId',
                                    select: 'userName profile.avatar'
                                }
                           })
                           .exec();
        return posts;
    }
}

module.exports = PostService;