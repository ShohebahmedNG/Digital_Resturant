require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path')

mongoose.connect(mongoose.connect('mongodb://localhost/MyRestu', {useNewUrlParser: true, useUnifiedTopology: true}))
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log(err))


const db = mongoose.connection;
db.on('error', (error )=>console.log(error ));
db.once('open', ()=>console.log('Connected to Database'));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers',
    " X-Requested-With, Content-Type, Accept, authorization")
    res.setHeader('Access-Control-Allow-Methods',
    "GET, PUT, PATCH, DELETE, POST, OPTIONS")
    next()
})

app.use(express.static('routes/images'))

app.use(express.json())//allowing to get json requests
app.use(express.urlencoded({extended: true}));

app.use(express.static('routes'))
const itemsRouter = require('./routes/items');
app.use('/items', itemsRouter)
const userRouter =  require('./routes/users')
app.use('/user', userRouter)
const shoppingRoute = require('./routes/userShopping')
app.use('/shopping', shoppingRoute)

app.listen(3000, ()=>console.log('Server Started'));