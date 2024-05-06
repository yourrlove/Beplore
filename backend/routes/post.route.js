const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { uploadDisk } = require('../configs/config.multer');
const asyncHandler = require('express-async-handler');

router.post('/', uploadDisk.single('file'), asyncHandler( postController.createPost ));
router.get('/', asyncHandler( postController.getAllPosts ));

router.put('/:userId/:postId/likes', asyncHandler( postController.updatePostLikes ));

router.post('/:postId/comments', asyncHandler( postController.addCommentToPost ));
router.put('/:userId/comments/:commentId/likes', asyncHandler( postController.updateCommentLikes ));

router.get('/:postId', asyncHandler( postController.getPost ));

router.put('/:postId/edit',  uploadDisk.single('file'), asyncHandler( postController.editPost ));

module.exports = router;