const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authVerifyToken = require('../middlewares/authCheck');


// * LOGIN ROUTE ------- >>>>

router.post('/api/authenticate', async (req,res) => {
        
        try {
            const {password} = req.body;
            const email = req.body.email.toLowerCase();

            if(!(email && password)) {

                res.status(401).send("Missing credentials !");
            }
                const matchedUser = await User.findOne({email});
                const passMatch = await bcrypt.compare(password, matchedUser.password);

                if(matchedUser && passMatch) {

                    const token_data = {
                        userId : matchedUser._id,
                        email : matchedUser._email
                    }

                    const gen_token = jwt.sign(
                        token_data, process.env.TOKEN_SECRET_KEY
                    )

                    console.log(gen_token);

                    matchedUser.token = gen_token;
                    await matchedUser.save();
                    return res.send({Token: matchedUser.token});
                }

                res.status(400).send( "Invalid credentials");
            }


        catch(err) {
            console.log(err);
            res.status(500).send("Internal server error! Try again", err.message);
        }

})




        















module.exports = router;