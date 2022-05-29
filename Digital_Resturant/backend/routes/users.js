const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()

router.post('/signup', (req, res)=>{
    
    bcrypt.hash(req.body.password, 5)
    .then(hashed=>{
        const newUser = new User({
            email: req.body.email,
            password: hashed,
            role:req.body.role
        })

        newUser.save().
        then(result=>{
            res.status(201).json({
                msg: "new user added!",
                result : result
            })
        })
        .catch(err=>{
            res.status(500).json({
                error: err
            })
        })
    })
})

router.post('/login', (req, res, next)=>{
    let currentUser = ''
    User.findOne({email:req.body.email, role: req.body.role}).
    then(user=>{
        if(!user ) return res.status(401).json({msg: 'authentication failed'})

        currentUser = user 
        bcrypt.compare(req.body.password, user.password)
        .then(result=>{
            if(!result)return res.status(401).json({msg: 'authentication failed'})
            console.log(currentUser.role);
            const token = jwt.sign(
                {id:currentUser._id, role:currentUser.role},
                'SECRET_key',
                {'expiresIn':'1h'})

            res.status(200).json({token:token, duration:3600,
                 userid: currentUser._id,usermail:currentUser.email, role:currentUser.role})


        })
        .catch(err=>{
            return res.status(401).json({error: err})  
        })
    })
    .catch(err=>{
        return res.status(401).json({error: err})  
    })
})

module.exports = router

