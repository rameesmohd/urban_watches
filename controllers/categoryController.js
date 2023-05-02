const categoryModel = require("../models/category");
const productModel = require("../models/product")


const loadCategory = async(req,res)=>{
    try {
        let category = await categoryModel.find()

        res.render('category',{category:category})

    } catch (error) {
        console.log(error.message);
    }
}

const newCategoryLoad = async(req,res)=>{
    try {
        res.render('addCategory')

    } catch (error) {
        
    }
}

const addCategory = async(req,res)=>{
    try {
        
        const name = req.body.name;

        const Data = await categoryModel.findOne({name : name})
        if(Data){
            
            res.render('addCategory',{message : "Category already exists"})

        }else{

            const Newcategory  = new categoryModel({
                name : name
            })
    
            const categoryData = Newcategory.save();
            if(categoryData){
                res.redirect('/admin/category')
            }

        }

    } catch (error) {
        console.log(error.message);
    }
}

const deleteCategory = async(req,res)=>{
    try {
        
        const id = req.query.id;
        await categoryModel.deleteOne({_id:id})
        
        res.redirect('/admin/category')


    } catch (error) {
        console.log(error.message);
    }
}

const  unlistCategory = async(req,res)=>{
    try {
        const id = req.query.id

        await categoryModel.updateOne({_id : id},{$set : {is_listed : 1}})

        await productModel.updateMany({category : id},{$set : {is_flaged : 1}})

        res.redirect('/admin/category')

    } catch (error) {
        console.log(error.message);
    }
}

const  listCategory = async(req,res)=>{
    try {
        const id = req.query.id

        await categoryModel.updateOne({_id : id},{$set : {is_listed : 0}})

        await productModel.updateMany({category : id},{$set : {is_flaged : 0}})

        res.redirect('/admin/category')

    } catch (error) {
        console.log(error.message);
    }
}

const editCategoryload = async(req,res)=>{
    try {
    const id = req.query.id


    const categoryData = await categoryModel.findOne({_id : id})

    //console.log(categoryData);

    res.render('editCategory',{category: categoryData})

    } catch (error) {
        console.log(error.message);
    }
}

const editCategory = async(req,res)=>{
    try {
    const id = req.body.id
    const name = req.body.name
    
    await categoryModel.updateOne({_id:id},{$set : {name : name}})
    res.redirect('/admin/category')
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadCategory,
    addCategory,
    newCategoryLoad,
    deleteCategory,
    unlistCategory,
    listCategory,
    editCategoryload,
    editCategory
}