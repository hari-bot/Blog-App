import express from "express";
import morgan from "morgan"

const app=express();
const port=3000;

const posts=[];

// Define a custom token for Morgan
morgan.token('flask-style', (req, res) => {
    const method = req.method;
    const url = req.originalUrl || req.url;
    const status = res.statusCode;
    const contentLength = res._headers['content-length'] || '0';
    const referrer = req.headers['referer'] || req.headers['referrer'] || '-';
    const userAgent = req.headers['user-agent'] || '-';

    return `${method} ${url} ${status} ${contentLength} - ${referrer} ${userAgent}`;
});

// Middle ware
app.use(morgan(':flask-style'));
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));


app.get("/",(req,res)=>{
    res.render("index.ejs",{heading:genHeading(),date:getCurrentDate(),posts:posts},);
})

app.get("/create",(req,res)=>{
    res.render("create.ejs")
})


// Creating a new post
app.post("/create/submit",(req,res)=>{
    posts.push({
        heading:req.body["heading"],
        content:req.body["content"],
        author:req.body["author"],
        date:getCurrentDate()
    });
    res.redirect("/create");
})



app.get("/update",(req,res)=>{
    res.render("update.ejs",{posts:posts})
})

// delete post
app.post("/update/delete",(req,res)=>{
    let indexToDelete=Number(req.body["deletePost"]);
    deletePost(indexToDelete);

    res.redirect("/update");
})

// view post
app.get('/post/:index', (req, res) => {
   const index=req.params.index;

   if(index>=0 && index< posts.length){
    const post= posts[index];
    res.render("post.ejs",{post});
   }else{
    res.status(404).send("Post not found")
   }
  });

// edit post
app.get('/edit/:index', (req, res) => {
const index=req.params.index;

if(index>=0 && index< posts.length){
    const post= posts[index];
    res.render("edit.ejs",{post,index});
}else{
    res.status(404).send("Post not found")
}
});

//submit edited post
app.post('/edit/:index/submit',(req,res)=>{
    const index=req.params.index;
    if(index>=0 && index< posts.length){
        posts[index].heading=req.body.heading;
        posts[index].content=req.body.content;
        posts[index].author=req.body.author; 
        posts[index].date=getCurrentDate();
        res.redirect(`/edit/${index}`);
    }else{
        res.status(404).send("Post not found")
    }
    });

app.get("/about",(req,res)=>{
    res.render("about.ejs");
})

app.listen(port,()=>{
    console.log(`Application is live on http://localhost:${port}`);
})


function genHeading(){
    const blogHeadings = [
        "Daily Dose of Insights",
        "Discover Today's Highlights",
        "Exploring Today's Blogosphere",
        "Today's Featured Posts",
        "Browsing Today's Blog Gems",
        "Unveiling Today's Top Picks",
        "Journey Through Today's Posts",
        "Today's Blog Chronicles",
        "Dive into Today's Blogosphere",
        "Your Daily Read: Today's Posts"
      ];

    return blogHeadings[Math.floor(Math.random() * 10)];
}

function getCurrentDate() {
    const currentDate = new Date();
  
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  
    const formattedDate = currentDate.toLocaleDateString(undefined, options);
  
    return formattedDate;
  }

  function deletePost(indexToDelete){
    if (indexToDelete >= 0 && indexToDelete < posts.length) {
        posts.splice(indexToDelete, 1);
      }else {
        console.error("Invalid index");
      }
  }
