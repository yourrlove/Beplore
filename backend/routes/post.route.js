const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { uploadDisk } = require('../configs/config.multer');
const asyncHandler = require('express-async-handler');
const { verifyToken } = require('../middlewares/verifyToken');

router.get('/:postId/comments', asyncHandler( postController.getAllPostComments));

router.post('/', uploadDisk.single('file'), asyncHandler( postController.createPost ));
router.get('/', asyncHandler( postController.getAllPosts ));
router.get('/feeds/following', verifyToken, asyncHandler( postController.getFeedPostsFllowing ));
router.get('/feeds/search', verifyToken, asyncHandler( postController.getSearchPosts ));

router.put('/comments/:commentId/likes', verifyToken, asyncHandler( postController.updateCommentLikes ));
router.put('/:postId/likes', verifyToken, asyncHandler( postController.updatePostLikes ));



router.get('/:postId', asyncHandler( postController.getPost ));
router.post('/:postId/comments', uploadDisk.single('file'), verifyToken, asyncHandler( postController.addCommentToPost ));
router.get('/user/:userName', verifyToken, asyncHandler( postController.getUserPosts ));
router.delete('/:postId', verifyToken, asyncHandler( postController.deletePost ));
router.delete('/:postId/comments/:commentId', verifyToken, asyncHandler( postController.deleteComment ));
router.put('/:postId/edit',  uploadDisk.single('file'), asyncHandler( postController.editPost ));




module.exports = router;