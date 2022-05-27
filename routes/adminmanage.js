const router = require("express").Router();
const mongoose = require('mongoose'); 
const User = mongoose.model('User');
const Forum = mongoose.model('Forum');
const Reply = mongoose.model('Reply');
const WordFilter = mongoose.model('WordFilter');


// *************** Admin Dashboard REST Methods **************

//Get User Count / Forum Count & Comment Count
router.get('/admindashboard/countdata', async (req, res)=>{

        try{
            const userCount = await User.countDocuments();
            const forumCount = await Forum.countDocuments();
            const replyCount = await Reply.countDocuments();

            console.log(userCount)
            return res.status(200).json({ 
                      userCount, 
                      forumCount,
                      replyCount,
            });

        }catch{
            return res.status(400).json({ error: "Can't calculate the counting data" });
        }
  
 });


 router.get('/admindashboard/toptable', async (req,res)=>{
    
        try{
            //Display the date in descending order in using commenting count
            const forumData = await Forum.find().sort ( { "Body" : 1 } );
                
                return res.status(200).json({
                    success:true,
                    existingForum:forumData
                });

        }catch{
            return res.status(400).json({ error: "Can't Find the top forum data" });
        }

});



// *************** Admin Dashboard REST Methods End **************

// *************** Admin Manage WordFiltering REST Methods **************

//Create WordFilter
router.post("/adminmanage/wordfilter/create", async (req, res) => {
    const {word, wcategory} = req.body;
  try {
        if(!word || !wcategory){
            return res.status(422).json({ error: "Please fill all the field" });
        }
        const lowerCaseWord = word.toLowerCase();
        let findWord = await WordFilter.findOne({ word:lowerCaseWord });
        if (findWord) {
          return res.status(400).json({ error: "This Word already exists" });
        }

        newWordFilter = new WordFilter({
            word:lowerCaseWord,
            wcategory,
         });
        const WordFilterCreated = await newWordFilter.save()
        if(WordFilterCreated){
            return res.status(201).json({ message: "Word Filter created successfully" });
        } 

    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
  }
});


//Get WordFilter
router.get('/adminmanage/wordfilter', async (req,res)=>{
    
    try{
        WordFilter.find().then((WordsList)=>{
            res.status(200).json(WordsList)
        }).catch((err)=>{
            console.log(err);
        })
    }catch{
        return res.status(400).json({ error: "Can't Find the top forum data" });
    }

});


//update wordfilter
router.put('/adminmanage/wordfilter/update/:id', async (req,res)=>{

    const {word, wcategory} = req.body;
  try {
        if(!word || !wcategory){
            return res.status(422).json({ error: "Please fill all the field" });
        }

        const lowerCaseWord = word.toLowerCase();
        let findWord = await WordFilter.findOne({ word:lowerCaseWord });
        if (findWord) {
          return res.status(400).json({ error: "This Word already exists" });
        }

        else{
            WordFilter.findByIdAndUpdate(
                req.params.id,{
                    word:lowerCaseWord,
                    wcategory,
                },
                (err,post)=>{
                    if(err){
                        return res.status(400).json({
                            error:err 
                        });
                    }

                    return res.status(200).json({
                        success:"Word Filter Updated Successfully"
                    });
                }
            );
        }

  }catch{

  }
});


//delete wordfilter
router.delete('/adminmanage/wordfilter/delete/:id',(req,res)=>{
    WordFilter.findByIdAndRemove(req.params.id).exec((err,deletedWordfilter) =>{

        if(err){
            return res.status(400).json({
                message:"Wordfilter Delete unsuccessfully" ,err
            });
        }

        return res.status(200).json({
            message:"Wordfilter Delete successfully",deletedWordfilter
        });
    });
});  

// *************** Admin Manage WordFiltering REST Methods End **************


module.exports = router;