const { deleteOne } = require('../models/cart')
const cartModel = require('../models/cart');
const Coupon = require('../models/coupon');
const productModel = require('../models/product')

let message;
 //:::::::::::::::::::::::::Shoping Cart::::::::::::::

 const cartViewLoad = async(req,res)=>{
    try {
    if(req.session.user_id){
        const session = req.session.user_id

        const cartData = await cartModel.findOne({user : session}).populate('item.product')

        if(cartData){
            
            const outOfStock = cartData.item.map((value)=>value).filter((value)=>{
                return value.product.stock < 1
            })
            
            res.render('shoping-cart',{session,cartData,message,outOfStock})
            message= null;
        
        }else{

            res.render('empty-cart',{session})
        }

    }else{
        res.redirect('/login')
    }
        
    } catch (error) {
        console.log(error.message);
    }
 }

const addToCart = async(req,res)=>{
    try {
        
        const userId = req.session.user_id
        
       if(userId){

        const product = await productModel.findOne({_id : req.query.id})
       
        const cartData =  await cartModel.findOne({user : userId})

        if(cartData){
            
            const alreadyExists =  await cartModel.findOne({user : userId,'item.product' : req.query.id})

            if(alreadyExists){

              const response = {
                success:true,
                message:"Item already exist"
              }

              res.json(response)

            }else{
                await cartModel.updateOne({user : userId},{$push : { item : { product : product._id ,
                    name : product.name ,
                    quantity : 1,
                    price : product.price}}})
    
                    const updatedData =  await cartModel.findOne({user : userId})
                    const total = updatedData.item.map((value)=>value.price).reduce((total,value)=>total = total + value)
                    await cartModel.updateOne({user : userId},{$set : { totalPrice : total }})
    
                    const response = {
                        success:true,
                        message:"Item added to cart"
                      }
        
                      res.json(response)
            }
            
        }else{
        
            const updateData =  await cartModel.insertMany({user : userId,item : { 
                product :  product._id ,
                name : product.name,
                quantity : product.quantity,
                price : product.price }, totalPrice : product.price })

                const response = {
                    success:true,
                    message:"Item added to cart"
                  }
    
                  res.json(response)
        }

       }else{
                res.redirect('/login')
       }

    } catch (error) {
        console.log(error.message);
    }

}


const decrement=async(req,res)=>{

    try {   
      
        let cartData = await cartModel.findOne({user : req.session.user_id}).populate('item.product')
        let Data = cartData.item.filter((value)=>{
            return value._id == req.query.id
        })
        if(cartData.couponID){
            const coupon =await Coupon.findOne({_id:cartData.couponID}) 
            await Coupon.updateOne({_id:cartData.couponID,'users.user':req.session.user_id},{$pull:{users:{user:req.session.user_id}}})
            await cartModel.updateOne({user: req.session.user_id},{$set:{couponID:null,couponDiscount:0}})
        }
        
        message = null
      
        if(Data[0].quantity > 1){
       
        await cartModel.updateOne({user : req.session.user_id,'item._id':req.query.id},{$inc : {'item.$.quantity' : -1}})


        }

        cartData = await cartModel.findOne({user : req.session.user_id}).populate('item.product')

         Data = cartData.item.filter((value)=>{
            return value._id == req.query.id
        })
        
        const newPrice = Data[0].quantity*Data[0].product.price
       
        
        
        await cartModel.updateOne({user : req.session.user_id,'item._id':req.query.id},{$set : { 'item.$.price' : newPrice}})
 
        //--------------------------------------------------------------------------------------------------//
        const updatedData = await cartModel.findOne({user : req.session.user_id,'item._id':req.query.id})

        const total = updatedData.item.map((value)=>value.price).reduce((total,value)=>total = total + value)

        const x =  await cartModel.updateOne({user : req.session.user_id},{$set : { totalPrice : total }})
        //--------------------------------------------------------------------------------------------------//
    
        cartData = await cartModel.findOne({user : req.session.user_id}).populate('item.product')
        
          Data = cartData.item.filter((value)=>{
            return value._id == req.query.id
        })
      
        const quantity = Data[0].quantity
        const totalPrice = Data[0].price
        const grantTotal = cartData.totalPrice
        const couponDiscount=cartData.totalPrice-cartData.couponDiscount
        const discount=cartData.couponDiscount


        res.json({quantity,totalPrice,grantTotal,id:req.query.id,couponDiscount,discount})
        
    } catch (error) {
        console.log(error.message);
    }

}

const increment = async(req,res)=>{
        
    try {

        let cartData = await cartModel.findOne({user : req.session.user_id}).populate('item.product')

        let Data = cartData.item.filter((value)=>{
            return value._id == req.query.id
        })
       

        if(Data[0].product.stock > Data[0].quantity){

            message = null;

        await cartModel.updateOne({user : req.session.user_id,'item._id':req.query.id},{$inc : {'item.$.quantity' : 1}})

        }else{
            
            message = "available stock reached"
        }

         cartData = await cartModel.findOne({user : req.session.user_id}).populate('item.product')

         Data = cartData.item.filter((value)=>{
            return value._id == req.query.id
        })
        
        const newPrice = Data[0].quantity *Data[0].product.price

        await cartModel.updateOne({user : req.session.user_id,'item._id':req.query.id},{$set : { 'item.$.price' : newPrice}})

          //--------------------------------------------------------------------------------------------------//
          const updatedData = await cartModel.findOne({user : req.session.user_id,'item._id':req.query.id})

          const total = updatedData.item.map((value)=>value.price).reduce((total,value)=>total = total + value)
  
          await cartModel.updateOne({user : req.session.user_id},{$set : { totalPrice : total }})
          //--------------------------------------------------------------------------------------------------//  
          
          cartData = await cartModel.findOne({user : req.session.user_id}).populate('item.product')
          Data = cartData.item.filter((value)=>{
            return value._id == req.query.id
        
        })

        const quantity = Data[0].quantity
        const totalPrice = Data[0].price
        const grantTotal = cartData.totalPrice
        const couponDiscount=cartData.totalPrice-cartData.couponDiscount
        const discount=cartData.couponDiscount

        res.json({quantity,totalPrice,grantTotal,id:req.query.id,message,couponDiscount,discount})   

    } catch (error) {
        console.log(error.message);
    }
}

const deleteItem = async(req,res)=>{
    try {
        console.log(req.query);
        await cartModel.updateOne({user : req.session.user_id },{$pull :{item: { _id : req.query.id }}})

        let cartData = await cartModel.findOne({user : req.session.user_id}).populate('item.product')

        
       
        if(cartData.couponID){
            const coupon =await Coupon.findOne({_id:cartData.couponID}) 
            await Coupon.updateOne({_id:cartData.couponID,'users.user':req.session.user_id},{$pull:{users:{user:req.session.user_id}}})
            await cartModel.updateOne({user: req.session.user_id},{$set:{couponID:null,couponDiscount:0}})
        }

         //--------------------------------------------------------------------------------------------------//
          const updatedData = await cartModel.findOne({user : req.session.user_id })
          
          const total = updatedData.item.map((value)=>value.price).reduce((total,value)=>{return total = total + value},0)
            
          await cartModel.updateOne({user : req.session.user_id},{$set : { totalPrice : total }})
           
         //--------------------------------------------------------------------------------------------------//  
  
        res.redirect('/view-cart')

    } catch (error) {
        console.log(error.message);
    }
}



 module.exports = {
    cartViewLoad,
    addToCart,
    increment,
    decrement,
    deleteItem
}

