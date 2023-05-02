const bannerModel = require('../models/banner')

const bannerLoad = async(req,res)=>{

    try {
        let index;
        if(req.query.index){
            index = req.query.index
        }else{
            index = null;
        }

        const bannerData = await bannerModel.find({});

        const bannerOne = bannerData.filter(element => element.flag === 1);
        const bannerTwo = bannerData.filter(element => element.flag === 2);
 

        res.render('banner',{bannerData,index,bannerOne,bannerTwo})

    } catch (error) {
        console.log(error);
    }

}

const addBanner = async(req,res)=>{

    try {

        let image = []
        for(let i=0;i<req.files.length;i++){
            image[i]=req.files[i].filename
        }
        
        const title = req.body.title
        const description = req.body.description

        const banner = new bannerModel({
            title : title,
            description : description,
            image : image
        })

        await banner.save()

        res.redirect('/admin/banner')

    } catch (error) {
        console.log(error);
    }
}

const editBanner = async(req,res)=>{

    try {
        console.log( req.body,req.files);
        const bannerId = req.query.id
        let image = []
        if(req.files.length !=0){

            for(let i=0;i<req.files.length;i++){
                image[i]=req.files[i].filename
            }
        }
        
        const title = req.body.title
        const description = req.body.description
    if(image.length === 0){

    const bannerUpdate = await bannerModel.updateOne({_id : bannerId},{
        $set:{title:title,description:description }
    })
    }else{
    const bannerUpdate = await bannerModel.updateOne({_id : bannerId},{
        $set:{title:title,description:description,image: image }
    })
    }
        
    res.redirect('/admin/banner')

    } catch (error) {
        console.log(error.message);
    }
}

const deleteBanner = async(req,res)=>{

    try {
        
        const bannerId = req.query.id

        await bannerModel.deleteOne({_id : bannerId})
        
        res.redirect('/admin/banner')

    } catch (error) {
        console.log(error.message);
    }
}

const applyBanner = async(req,res)=>{

    try {

        const id = req.query.id
        const flagIndex = req.body.flagIndex

        console.log(flagIndex);

        currentBanner = await bannerModel.findOneAndUpdate({flag : flagIndex},{flag : 0})

        await bannerModel.updateOne({_id : id},{$set :{flag : flagIndex}})

        res.redirect('/admin/banner')

    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    bannerLoad,
    addBanner,
    deleteBanner,
    editBanner,
    applyBanner

}