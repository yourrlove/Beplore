const express = require('express');
const   router = express.Router();
const CommentController = require('../controllers/comment.controller');
const { uploadDisk } = require('../configs/config.multer');
const asyncHandler = require('express-async-handler');
const { verifyToken } = require('../middlewares/verifyToken');

router.get('/:commentId', asyncHandler (CommentController.getComment ));
router.get('/:commentId/replies', asyncHandler (CommentController.getAllCommentReplies ));
router.post('/:commentId/replies', verifyToken, uploadDisk.single('file'), asyncHandler( CommentController.createSubComment ));
router.delete('/:commentId/replies/:subcommentId', verifyToken, asyncHandler( CommentController.deleteSubComment ));

module.exports = router;