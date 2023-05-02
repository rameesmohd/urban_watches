const User = require('../models/userModel')

const isBlocked = async(req,res,next)=>{
    try {
            const id = req.session.user_id
            
            if(id){
                const userData=  await User.findOne({_id: id})
                if(userData.is_blocked==1){
                    res.redirect('/logout')
                }else{
                    next()
                }
            }else{
                next()
            }
        
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    isBlocked
}