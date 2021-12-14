const express = require('express');
const router = express.Router();
const authVerifyToken = require('../middlewares/authCheck');
const User = require('../models/user');

// * GETTING THE USER PROFILE :
router.get('/api/user', authVerifyToken, async (req,res) => {

    try {

        const userId = req.user;
        const userProfile = await User.findById(userId);
        res.send({
            Name: userProfile.fname +" "+userProfile.lname,
            Followers: userProfile.followers.length,
            Followings: userProfile.followings.length
        });

    }
    catch (err) {

        res.status(500).send("Internal server error \n"+err.message);
    }
})


// * FOLLOWING A DIFFERENT USER:
router.post('/api/follow/:id', authVerifyToken, async (req,res) => {

    const userId = req.user;
    const followId = req.params.id;
    
    try {

        const loggedUser = await User.findById(req.user);
        const followUser = await User.findById(req.params.id);

        if(!followUser) {
            return res.status(404).send("User not found to follow");
        }

        if(userId=== followId) {
            return res.status(401).send("you cant follow yourself! Invalid entry")
        }

        const followFlag = (loggedUser.followings && loggedUser.followings.includes(req.params.id))
        if(!followFlag) {

            loggedUser.followings = [...loggedUser.followings, followId];
            await loggedUser.save();

            followUser.followers = [...followUser.followers, userId];
            await followUser.save();

            return res.send([`${loggedUser.fname} followd ${followUser.fname}`,loggedUser, followUser]);
        }

        res.status(400).send("Cannot follow an already followed user again")

        
    }
    catch(err) {
        res.status(500).send(err);
    }
})


// * UNFOLLOW A PARTICULAR USER:
router.post('/api/unfollow/:id', authVerifyToken, async (req, res) => {
    
    const userId = req.user;
    const followId = req.params.id;

    try {

        const loggedUser = await User.findById(req.user);
        const followUser = await User.findById(req.params.id);

        if(!followUser) {
            return res.status(404).send("User not found to unfollow");
        }

        const followFlag = (loggedUser.followings && loggedUser.followings.includes(req.params.id))
        if(followFlag) {

            loggedUser.followings = await loggedUser.followings.filter(e => e != followId);
            await loggedUser.save();

            followUser.followers = await followUser.followers.filter(e => e != userId); 
            await followUser.save();
            return res.send([`${loggedUser.fname} unfollowed ${followUser.fname}`,loggedUser, followUser]);
        }

        res.status(400).send("Cannot unfollow an already unfollowed user again")
    }
    catch(err) {
        res.status(500).send(err.message);
    }
})








module.exports = router;