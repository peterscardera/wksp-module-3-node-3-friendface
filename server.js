'use strict';
const express = require('express');
const morgan = require('morgan');
const { users } = require('./data/users');
const PORT = process.env.PORT || 8000;
let currentUser = null;

const handleHome = (req, res) => {
    //if someone goes to homepage directly
    if(!currentUser) {res.redirect("/signin"); return;}

let picArray = [];
currentUser.friends.forEach((friend)=> {
//curentUser is the specific person obj that matched earlier
//looping through the friends array    
users.forEach((user)=> {
//looping through each person obj and their id === in someons friends array
if(user.id === friend) {
    picArray.push(user)
    } 
    })
})
    res.render("pages/homepage", {
        title: "userNames",
        user: currentUser,
        friends: picArray
        
    })
}

const handleSignIn = (req, res) =>  {

    res.render("pages/signin", {
    title: "Sign in to friendFace!"
    })
    
}

const handleUser = (req, res) => {
    const id = req.params.id;

let friendsPageObj = {};
let friendsArray = [];

    users.forEach((user)=> {
        if(user.id === id) {
            friendsPageObj = user
        }
    })
friendsPageObj.friends.forEach((friend) => {
    users.forEach(user => {
        if(friend === user.id) {
            friendsArray.push(user)
        }
    })
})

res.render("pages/homepage", {
    title: "userNames",
    user: friendsPageObj ,
    friends: friendsArray

})


}

const handleName = (req, res) => {
    const firstName = req.query.firstName; //value of what is typed
    currentUser = users.find(user => user.name === firstName) || null;
    //console.log(currentUser) its the users object in the users.js
    if(currentUser) {
    res.redirect("/");
    return
    }else {
        res.redirect("/signin")
    }
  
    res.send("Name received")
}


// -----------------------------------------------------
// server endpoints
express()
    .use(morgan('dev'))
    .use(express.static('public'))
    .use(express.urlencoded({extended: false}))
    .set('view engine', 'ejs')
    // endpoints

    .get("/",handleHome)
    .get("/signin", handleSignIn)
    .get ("/user/:id", handleUser)   
    .get("/getname", handleName)
    


    .get('*', (req, res) => {
        res.status(404);
        res.render('pages/fourOhFour', {
            title: 'I got nothing',
            path: req.originalUrl
        });
    })
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));