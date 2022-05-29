const express = require('express')
const User = require('../models/user')
const Item = require('../models/item')
const Cart = require('../models/cart')
const checkAuth = require('../middleware/check-auth')

const router = express.Router()

router.post('/',checkAuth, (req, res)=>{
    // console.log(req.body.allitems);
    
    const newcart = new Cart({
    allitems: req.body.allitems,
    userid: req.body.userid, 
    })
    // console.log(req.body);
    // return res.json({msg:"ok"})
    
    let selectedItems = req.body.allitems.map(item=>{
        return item.itemtaken
    })

    let totalamt = 0
    
    Item.find({
        _id:{$in:selectedItems}
    })
    .then(item=>{
        
        item.forEach((x,i)=>{
        totalamt += x.price * (req.body.allitems[i].qty)

        })
        newcart.totalPrice = totalamt
        newcart.save()
        
        res.status(200).json({totalamt})
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({err})
    })

    
})

router.get('/:id',checkAuth, (req, res)=>{
    Cart.find({userid:req.params.id})
    .then(orders=>{
        if(!orders || orders.length==0){
            return res.status(200).json({msg: "No purchase is made so far"})
        }

        res.status(200).json({msg:"order fetched successfully",orders})
    })
    .catch(err=>{
        res.status(500).json({err})
    })
})



module.exports = router