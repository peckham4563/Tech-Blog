const router = require('express').Router()
const {Post} = require('../../models/Post')
const auth = require('../../utils/auth')

router.post('/', auth, async (req,res) => {
    const body = req.body;
    try {
        const newPost = await Post.create({
            ...body,userId: req.session.userId
        });
        res.json(newPost)
    }
    catch (err){
        res.status(500).json(err)
    }
})

router.delete('/:id', auth, async (req,res) => {
    try {
        const [editPost] = Post.destroy({
            where:{
                id: req.params.id
            },
        })
        if (editPost > 0){
            res.status(200).end()
        }else {
            res.status(404).end()
        }
    }catch (err){
        res.status(500).json(err)
    }
})

router.put('/:id', auth, async (req,res) => {
    try {
        const [editPost] = await Post.update(req.body, {
            where:{
                id: req.params.id
            },
        })
        if (editPost > 0){
            res.status(200).end()
        }else {
            res.status(404).end()
        }
    }catch (err){
        res.status(500).json(err)
    }
})

module.exports = router;