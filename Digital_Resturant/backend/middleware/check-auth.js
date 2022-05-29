const jwt = require('jsonwebtoken')

function authenticate(req, res, next){
    try{
        // console.log('authenticate middleware');
        const token = req.headers.authorization.split(' ')[1]
        // console.log(token);
        const decodedToken = jwt.verify(token, 'SECRET_key')
        // console.log(decodedToken, decodedToken.id);
        req.userdetails = {userid:decodedToken.id, userRole: decodedToken.role}
        next()
    }
    catch(err){
        res.status(401).json({msg: "Auth failed"})
    }
}

module.exports = authenticate