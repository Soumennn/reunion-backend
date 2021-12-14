const express = require('express');
const router = express.Router();
const authVerifyToken = require('../middlewares/authCheck');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

// * SHOWING ALL POSTS ---- 
router.post('/api/all_posts', authVerifyToken, async (req,res) => {

    const acquiredPosts = await Post.find({})
    res.send(acquiredPosts);
})

// * CREATING A NEW POST
router.post('/api/posts', authVerifyToken, async (req,res) => {

    try {
        const postDetails = {
            title: req.body.title,
            description: req.body.description,
            author: req.user,
        }
    
        const createPost = await Post.create(postDetails);
        res.send({
            Post_id: createPost._id,
            Title: createPost.title,
            Description: createPost.description,
            Time: createPost.createdAt
        });
    }
    catch (err) {
        res.send(err.message);
    }

})

// * DISPLAYING A PARTICULAR POST 
router.get('/api/posts/:id', authVerifyToken, async (req,res)=> {
    try {
        const postId = req.params.id
        const showPost = await Post.findById(postId)
        .populate(`comments`)
        .populate('likes');

        res.status(200).send({
            "Displaying a particular post":showPost,
            "Number of likes": showPost.likes.length,
            "Number of comments": showPost.comments.length
        });
    }
    catch(err) {
        res.status(500).send("Internal server error"+err.message);
    }
})


// * DELETING A POST 
router.delete('/api/posts/:id', authVerifyToken, async (req,res)=> {

    try {
        const postId = req.params.id;
        const delPost = await Post.findById(postId);
        const userId = req.user;
        
        if(userId != delPost.author) {
            return res.status(401).send("Can't delete other user's post! Access denied");
        }

        const deletePost = await Post.findByIdAndDelete(postId);
        res.send(["Post deleted successfully",deletePost]);
    }
    catch(err) {
        res.status(500).send("Internal server error \n"+err.message);
    }

})


// * COMMENTING ON A PARTICULAR POST: 
router.post('/api/comment/:id', authVerifyToken, async (req,res) => {

    try {
            const postId = req.params.id;
            const userId = req.user;

            const getPost = await Post.findById(postId);
            
            if(!getPost) {
                return res.status(401).send("No post found!");
            }

            const postDetails = {
                description: req.body.description,
                author: userId
            }

            const createComment = await Comment.create(postDetails);
            await createComment.save();
            getPost.comments = [...getPost.comments, createComment._id];
            await getPost.save();

            res.send({"Your comment was posted successfully":
               { Comment_id:createComment._id,
                Comment_description: createComment.description}
            });

    }

    catch(err) {
            res.status(500).send(["Internal server error !", err.message]);
    }


})


// * LIKING A POST :
router.post('/api/like/:id', authVerifyToken, async (req,res) => {

    try {
            const postId = req.params.id;
            const userId = req.user;

            const foundPost = await Post.findById(postId);
            const currentUser = await User.findById(userId);

            if(!foundPost) {
                res.status(400).send("No such post exits");
            }


            const likePostFlag = (foundPost.likes && foundPost.likes.includes(userId));
            const likeUserFlag = (currentUser.likes && currentUser.likes.includes(postId));

            if(!likePostFlag) {
                
                foundPost.likes = [...foundPost.likes, userId];
                await foundPost.save();
            }

            if(!likeUserFlag) {
                currentUser.likes = [...currentUser.likes, postId];
                await currentUser.save();
            }

            res.send({"You liked the following post":foundPost});
    }
    catch(err) {
            res.status(500).send(["Internal server error",err.message]);
    }
})



// * UNLIKING A POST :
router.post('/api/unlike/:id', authVerifyToken, async (req,res) => {

    try {
            const postId = req.params.id;
            const userId = req.user;

            const foundPost = await Post.findById(postId);
            const currentUser = await User.findById(userId);

            if(!foundPost) {
                res.status(400).send("No such post exits");
            }


            const likePostFlag = (foundPost.likes && foundPost.likes.includes(userId));
            const likeUserFlag = (currentUser.likes && currentUser.likes.includes(postId));

            if(likePostFlag) {
                
                foundPost.likes = await foundPost.likes.filter(e=> e != userId);
                await foundPost.save();
            }

            if(likeUserFlag) {
                currentUser.likes = await currentUser.likes.filter(e=> e != postId);
                await currentUser.save();
            }

            res.send({"You unliked the following post":foundPost});
    }
    catch(err) {
            res.status(500).send(["Internal server error",err.message]);
    }
})





module.exports = router;