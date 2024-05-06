const PostService = require('../services/post.service');
const CommentService = require('../services/comment.service');
const { CREATED } = require('../core/success.response');

class PostController {
    createPost = async (req, res, next) => {
        new CREATED({
            message: "Post created successfully",
            metadata: await PostService.create({...req.body, file: req.file})
        }).send(res);
    }
    
    addCommentToPost = async (req, res, next) => {
        try {
            return res.json(await CommentService.create(req.params.postId, req.body));
        } catch (err) {
            console.log(err);
        }
    } 

    updatePostLikes = async (req, res, next) => {
        try {
            return res.json(await PostService.updateLikes(req.params.userId, req.params.postId));
        } catch (err) {
            console.log(err);
        }
    }  

    updateCommentLikes = async (req, res, next) => {
        try {
            return res.json(await CommentService.updateLikes(req.params.userId, req.params.commentId));
        } catch (err) {
            console.log(err);
        }
    }

    getPost = async (req, res, next) => {
        try {
            return res.json(await PostService.getById(req.params.postId));
        } catch (err) {
            console.log(err);
        }
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
}

module.exports = new PostController();