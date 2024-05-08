const PostService = require('../services/post.service');
const CommentService = require('../services/comment.service');
const { CREATED, OK } = require('../core/success.response');

class PostController {
    createPost = async (req, res, next) => {
        new CREATED({
            message: "Post created successfully",
            metadata: await PostService.create({...req.body, file: req.file})
        }).send(res);
    }
    
    addCommentToPost = async (req, res, next) => {
        new CREATED({
            message: "Comment created successfully",
            metadata: await CommentService.create(req.params.postId, {...req.body, file: req.file})
        }).send(res);
    } 

    updatePostLikes = async (req, res, next) => {
        new OK({
            message: 'Post likes updated successfully',
            metadata: await PostService.updateLikes(req.user._id, req.params.postId)
        }).send(res);
    }

    updateCommentLikes = async (req, res, next) => {
        try {
            return res.json(await CommentService.updateLikes(req.params.userId, req.params.commentId));
        } catch (err) {
            console.log(err);
        }
    }

    getPost = async (req, res, next) => {
        new OK({
            message: 'Post retrieved successfully',
            metadata: await PostService.getById(req.params.postId)
        }).send(res);
    }

    getAllPosts = async (req, res, next) => {
        try {
            return res.json(await PostService.getAll());
        } catch (err) {
            console.log(err);
        }
    }

    editPost = async (req, res, next) => {
        const { file } = req;
        try {
            return res.json(await PostService.update({ postId: req.params.postId, file, ...req.body }));
        } catch (err) {
            console.log(err);
        }
    }

    getFeedPostsFllowing = async (req, res, next) => {
        new OK({
            message: 'Feed posts retrieved successfully',
            metadata: await PostService.getAllPostsFollowing(req.user._id)
        }).send(res);
    }

    getUserPosts = async (req, res, next) => {
        new OK({
            message: 'User posts retrieved successfully',
            metadata: await PostService.getAllUserPosts(req.params.userName)
        }).send(res);
    }

    deletePost = async (req, res, next) => {
        new OK({
            message: 'User post deleted successfully',
            metadata: await PostService.delete(req.params.postId)
        }).send(res);
    }
}

module.exports = new PostController();