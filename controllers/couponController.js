const couponModel = require("../models/coupon");
const { findOne, updateOne } = require("../models/product");


const couponLoad = async(req,res)=>{

    try {
        const couponData = await couponModel.find({})
        
        res.render('coupon',{couponData})

    } catch (error) {
        console.log(error.message);
    }

}


const addCouponLoad = async(req,res)=>{

    try {
      

        res.render('add-coupon')

    } catch (error) {
        console.log(error.message);
    }
}

const addCoupon = async(req,res)=>{

    try {
        const couponCode = req.body.couponCode
        const title = req.body.title
        const expiryDate = req.body.expiryDate
        const noOfCoupon = req.body.noOfCoupon
        const discount = req.body.discount
        const minPurchaseAmount = req.body.minPurchaseAmount
        const maxDiscountAmount = req.body.maxDiscountAmount

        const coupon = new couponModel({
            couponCode:couponCode,
            title : title,
            expiryDate : expiryDate,
            noOfCoupon : noOfCoupon,
            discount : discount,
            minPurchaseAmount:minPurchaseAmount,
            maxDiscountAmount : maxDiscountAmount
        })

        const save = coupon.save()

        if(save)res.redirect('/admin/coupon')

    } catch(error) {
        console.log(error.message);
    }
}


const deleteCoupon = async(req,res)=>{

    try {
        const id = req.query.id

        const deleted =  await couponModel.deleteOne({_id : id})

        if(deleted){
            res.send({success:true})
        }

        
    } catch (error) {
        console.log(error.message);
    }


}


const editCouponLoad = async(req,res)=>{

    try {

        const couponId = req.query.id

        const couponData =  await couponModel.findOne({_id : couponId})

        const year = couponData.expiryDate.getFullYear();
        const month = String(couponData.expiryDate.getMonth() + 1).padStart(2, '0');
        const day = String(couponData.expiryDate.getDate()).padStart(2, '0');
        const expiryDate = `${year}-${month}-${day}`;

        res.render('edit-coupon',{couponData,expiryDate})


    } catch (error) {
        console.log(Error.message);
    }
}

const editCoupon = async(req,res)=>{

    try {
        
        couponId = req.body.id

        const success =  await couponModel.updateOne({_id : couponId},{$set : {
            couponCode :req.body.couponCode,
            title :  req.body.title,
            expiryDate : req.body.expiryDate,
            minPurchaseAmount : req.body.minPurchaseAmount,
            discount : req.body.discount,
            maxDiscountAmount : req.body.maxDiscountAmount ,
            noOfCoupon : req.body.noOfCoupon }})

            if(success){
                res.redirect('/admin/coupon')
            }

    } catch (error) {
        console.log(error.message);
    }


}




module.exports =  {
    couponLoad,
    addCouponLoad,
    addCoupon,
    deleteCoupon,
    editCouponLoad,
    editCoupon
}

