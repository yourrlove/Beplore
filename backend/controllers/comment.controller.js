const CommentService = require('../services/comment.service');
const { CREATED, OK } = require('../core/success.response');

class CommentController {
    createSubComment = async (req, res, next) => {
        new CREATED({
            message: "Comment created successfully",
            metadata: await CommentService.createSubComment(req.params.commentId, {...req.body, file: req.file})
        }).send(res);
    }

    getAllCommentReplies = async (req, res, next) => {
        new OK({
            message: 'SubComment replies retrieved successfully',
            metadata: await CommentService.getSubComments(req.params.commentId)
        }).send(res);
    }

    deleteSubComment = async (req, res, next) => {
        new OK({
            message: 'SubComment deleted successfully',
            metadata: await CommentService.deleteSubComment(req.params.commentId, req.params.subcommentId)
        }).send(res);
    }

    getComment = async (req, res, next) => {
        new OK({
            message: 'Comment retrieved successfully',
            metadata: await CommentService.getById(req.params.commentId)
        }).send(res);
    }
}


module.exports = new CommentController();
