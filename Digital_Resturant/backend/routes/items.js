const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const multer = require('multer')
const path = require('path')
const checkAuth = require('../middleware/check-auth')

const MIME_type_mp = {
    'image/png':'png',
    'image/jpeg':'jpg',
    'image/jpg':'jpg'
}

const storage = multer.diskStorage({
    destination: (req,file, cb)=>{
        let isValid = MIME_type_mp[file.mimetype]
        let error = new Error('file mime type not valid')
        if (isValid){
            error = null
        }
        cb(error, path.join(__dirname,'images'))
    },
    filename:(req,file,cb)=>{
        const name= file.originalname.split(' ').join('-')
        const ext = MIME_type_mp[file.mimetype]
        cb(null, name+'-'+Date.now()+'.'+ext)
    }

})

router.get('/', async (req,res)=>{
    
    try{
        const items = await Item.find();
        res.json(items)
    }
    catch(err){
        res.status(501).json ({msg:err.message})
    }
})

router.get('/:id',getItem, (req,res)=>{
    res.json(res.item)
})

router.post('/',checkAuth,multer({storage:storage}).single('image'), async(req,res)=>{
    console.log('post req');
    if(req.userdetails.userRole!="admin") 
    return res.status(401).json({msg: "user do not have the right for this operation"})  
    
    const url = req.protocol+'://'+req.get('host')
    const item = new Item({
        name:req.body.name,
        price:req.body.price,
        description:req.body.description,
        imagePath:url+'/' +req.file.filename,
    })
    
    try{
        const newItem = await item.save()        
        res.status(201).json(newItem)
    }
    catch(err){
        res.status(400).json({msg:err.message})
    }
})

router.put('/:id',checkAuth, multer({storage:storage}).single('image'), async(req,res)=>{
    if(req.userdetails.userRole!="admin") 
    return res.status(401).json({msg: "user do not have the right for this operation"})  
    let imgurl
    if(typeof req.file==='undefined'){
        imgurl = req.body.imagePath
    }
    else{
        imgurl = req.protocol+'://'+req.get('host')+'/' +req.file.filename
    }

    const item = new Item({
        _id:req.body.id,
        name:req.body.name,
        price:req.body.price,
        description:req.body.description,
        imagePath:imgurl,
    })
    
    Item.updateOne({_id: req.body.id}, item)
    .then(result =>{
        console.log(result.nModified)
        res.status(200).json({msg:'updated successfully'})
    })
    .catch(err=>{
        res.status(400).json({msg:err.message})
    })
})

// router.patch('/:id',getItem, async (req,res)=>{
//     if(req.body.name!=null){
//         res.item.name = req.body.name
//     }
//     if(req.body.price!=null){
//         res.item.price = req.body.price
//     }
//     if(req.body.description!=null){
//         res.item.description = req.body.description
//     }
//     if(req.body.imagePath!=null){
//         res.item.imagePath = req.body.imagePath
//     }
//     try{
//         const updatedItem = await res.item.save();
//         res.json(updatedItem);
//     }
//     catch(err){
//         res.status(400).json({msg:err.message});
//     }
// })

router.delete('/:id',checkAuth, getItem, async(req,res)=>{
    if(req.userdetails.userRole!="admin") 
    return res.status(401).json({msg: "user do not have the right for this operation"})  
   try{
    await res.item.remove()
    res.json({msg:'Deleted item'})
   } 
   catch(err){
    res.status(500).json({msg:err.message})
   }
})



async function getItem(req, res, next){
    let item
    try{
        item = await Item.findById(req.params.id)
        if(item==null)
        return res.status(404).json({msg:"Item not found!.."})
    }
    catch(err){
        return res.status(500).json({msg:err.message})
    }
    res.item = item
    next()
}
module.exports = router;