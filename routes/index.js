const express = require('express');
const router = express.Router();

router.get('/', ensureAutehnticated ,(req, res) =>{
    res.render('index');
});

function ensureAutehnticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/users/login');
    }
}

module.exports = router;
