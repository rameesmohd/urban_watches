const productModel = require("../models/product")
const categoryModel = require('../models/category')
const { findOne, deleteOne } = require("../models/userModel")
let message;


const productLoad = async(req,res)=>{
    try {
        const productData = await productModel.find().populate('category')
        
        const category = await categoryModel.find()
      
        res.render('products',{products : productData,category})

    } catch (error) {
        console.log(message.error);
    }
}

const addProductLoad = async(req,res)=>{
    try {
    const refCategory = await categoryModel.find()
    
        
     res.render('addProduct',{category : refCategory,message})
     message=null;   

    } catch (error) {
        console.log(error.message);
    }
}

const addProduct = async(req,res)=>{

    try {

    if(req.body.price > 0 && req.body.stock > 0){ 

    const refCategory = await categoryModel.findOne({name : req.body.category})

    let images = []
        for(let i=0;i<req.files.length;i++){
            images[i]=req.files[i].filename
        }

    const name = req.body.name;
    const price = req.body.price;
    const meterial = req.body.meterial
    const description = req.body.description
    const gender = req.body.gender
    const category = refCategory
    const stock = req.body.stock

    const product = new productModel({
        name:name,
        price:price,
        meterial:meterial,
        description:description,
        stock:stock,
        gender:gender,
        category:category,
        image : images
    })

    const productData = await product.save()

    if(productData){
     
        res.redirect('/admin/products')
    }
    }else{
        message ="Invalid values entered";
        res.redirect("/admin/add-product")
    }

    
    } catch (error) {
        console.log(error.message);
    }
}


const editProductload = async(req,res)=>{

    try {
        const id = req.query.id
        const productData = await productModel.findById({_id : id})
        const category = await categoryModel.find()
        if(productData){
            res.render('edit-product',{product : productData,category})
        }
        
    } catch (error) {
        console.log(error.message);
    }

}



const imageRemove = async(req,res)=>{
    try {
    const file = req.query.file
    
    const productId = req.query.productId
        console.log(file,productId,'dfhhdgfh');
    await productModel.updateOne({_id:productId},{ $pull:{image : file}})
        res.send({success:true,janu:'dddd'})
        
    } catch (error) {
        console.log(error.message);
    }
}



const editProduct = async(req,res)=>{

    try {
    
    let images = []
    for(let i=0;i<req.files.length;i++){
            images[i]=req.files[i].filename
    }
    

    const id = req.body.id
    const product = await productModel.findById({_id : id})
    const refCategory = await categoryModel.find({name:req.body.category})

    if(images.length==0){
            await productModel.updateOne({_id : product._id},{$set :{name : req.body.name,price : req.body.price,meterial:req.body.material,description:req.body.description,stock:req.body.stock,gender:req.body.gender,category:refCategory._id}})
            res.redirect('/admin/products')
    }else{
        await productModel.updateOne({_id : product._id},{$set :{name : req.body.name,price : req.body.price,meterial:req.body.material,description:req.body.description,stock:req.body.stock,gender:req.body.gender,category:refCategory._id,image : images}})
        res.redirect('/admin/products')

    }


    } catch (error) {
        console.log(error.message);
    }
}



const deleteProduct = async(req,res)=>{
    try {
    const id = req.query.id
    
    await productModel.deleteOne({_id : id})
    res.redirect("/admin/products")
        
    } catch (error) {
        console.log(error.message);
    }
}



const flagProduct = async(req,res)=>{
    try {
    const id = req.query.id
    
    await productModel.updateOne({_id : id},{$set:{is_flaged:1}})
    res.redirect("/admin/products")
        
    } catch (error) {
        console.log(error.message);
    }
}


const unflagProduct = async(req,res)=>{
    try {
    const id = req.query.id
    
    await productModel.updateOne({_id : id},{$set:{is_flaged:0}})
    res.redirect("/admin/products")
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    productLoad,
    addProductLoad,
    addProduct,
    editProductload,
    imageRemove,
    editProduct,
    flagProduct,
    unflagProduct,
    deleteProduct
}