const express = require('express');
const router = express.Router();
const Post = require('../models/Post');


//Routes
// Get method
// Home route
router.get('', async (req,res)=>{
 
    try {
        const locals = {
            title: "Blog_Project",
            description: "First projects using node js, mongodb and express"
        }
        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate( [ { $sort: { createdAt: -1 }  } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();    
        
        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage)
        



        res.render('index', {
             locals,
             data, 
             current: page,
             nextPage: hasNextPage ? nextPage : null,
             currentRoute: '/'
            });
    } catch (error) {
        console.log(error)
    }
    
});

// router.get('', async (req,res)=>{
//     const locals = {
//         title: "Blog_Project",
//         description: "First projects using node js, mongodb and express"
//     }

//     try {
//         const data = await Post.find();
//         res.render('index', { locals, data });
//     } catch (error) {
//         console.log(error)
//     }
    
// });

// Get method
// Post: id

router.get('/post/:id', async (req,res)=>{

    try {  
        let slug = req.params.id;

        const data = await Post.findById({ _id: slug });

        const locals = {
            title: data.title,
            description: "First projects using node js, mongodb and express",
            
        }

        res.render('post', { locals, data, currentRoute: `/post/${slug}` });
    } catch (error) {
        console.log(error)
    }
    
});

// Post method
// Post: searchTerm

router.post('/search', async (req,res)=>{
    
    try {
        const locals = {
            title: "Search",
            description: "First projects using node js, mongodb and express"
        }
        let searchTerm = req.body.searchTerm;
        // console.log(searchTerm);
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "")


        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i' )}},
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i' )}}
            ]
        });
        
        res.render("search", {
            data,
            locals,
            currentRoute: '/search'
        });
    } catch (error) {
        console.log(error)
    }
    
});








/*function insertPostData(){
    Post.insertMany([
        {
            title: "Building a blog",
            body: "Hello World"
        },
        {
            title: "Building a project",
            body: "NodeJs & MongoDb"
        }
    ])
}
insertPostData();*/


router.get('/about', (req,res)=>{
    res.render('about', {
        currentRoute: '/about'
    });
});

router.get('/contact', (req,res)=>{
    res.render('contact', {
        currentRoute: '/contact'
    });
});

module.exports = router;