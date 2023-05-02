//--------------------------------------------------------------------------
const multer = require('multer')
const storage = multer.diskStorage({
    destination:function(req,file,cb){
       
       cb(null,'./public/productimages',function(err,sucess){
          if(err){
             throw err
          }
       })
    },
    filename:function(req,file,cb){
       const name = Date.now()+'-'+file.originalname
       cb(null,name,function(error,sucess){
          if(error)
          {
             throw error
          }
       })
    }
 })

//image validation:::::::::::::::::::::::::::::::::::::::::::::----------------------
 const fileFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
const uploadMulter = multer({storage:storage,fileFilter:fileFilter})
//----------------------------------------------------------------------------------//

module.exports = {uploadMulter}