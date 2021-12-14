const jwt = require('jsonwebtoken');

const authVerifyToken = (req,res,next) => {

const token = req.body.token || req.query.token || req.headers['access-token'];

if(!token) {

    return res.status(403).send("A token is required for authentication");
}

try {

    const dataFromToken = jwt.verify(token,process.env.TOKEN_SECRET_KEY);
    req.user = dataFromToken.userId;
    console.log(req.user);

}

catch(err) {

    return res.status(401).send("Invalid token");
}

    return next();

}

module.exports = authVerifyToken;