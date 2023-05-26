
const jwt = require('jsonwebtoken');
const JWT_SECRET='varadkasignature';

const fetchuser=(req,res,next)=>{

    try{
    const token=req.header('auth-token');
    if(!token){
        res.status(401).send('Unauthorized');
    }
    const data=jwt.verify(token,JWT_SECRET);
    req.user=data.user;
    next();
}catch(error){
    res.status(401).send('Unauthorized');
}
}

module.exports=fetchuser;