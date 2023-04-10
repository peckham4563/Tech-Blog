const router = require('express').Router()
const {User} = require('../../models')

router.post('/',async (req,res) => {
    const body = req.body;
    try {
        const newUser = await User.create({
            username: req.body.username, 
            password: req.body.password
        });
        req.session.save(() => {
            req.session.userId = newUser.id;
            req.session.username = newUser.username;
            req.session.loggedIn = true
        })
        res.json(newUser)
    }
    catch (err){
        res.status(500).json(err)
    }
})
router.post('/login',async (req,res) => {
    try {
        const user = await User.findOne({
            username: req.body.username, 
            password: req.body.password
        });
        if (!user){
            res.status(400).json({
                message: 'Cannot find User'
            })
            return;
        }
        const isValid = user.checkPassword(req.body.password);
        if(!isValid){
            res.status(400).json({
                message: 'Cannot find User'
            })
            return;
        }
        req.session.save(() => {
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.loggedIn = true
            res.json({
                user,message: 'Logged In'
            })
        })
    }
    catch (err){
        res.status(400).json({
            message: 'Cannot find User'
        })
    }
})
router.post('/logout',(req,res) => {
    if(req.session.loggedIn){
        req.session.destroy(() => {
            res.status(204).end()
        })
    }else{
        res.status(404).end()
    }
})
module.exports = router