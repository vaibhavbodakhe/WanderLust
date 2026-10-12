const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,("/public"))))


const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust2';
async function main(){
    await mongoose.connect(MONGO_URL);
}

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

//New route
app.get("/listings/new",async(req,res)=>{
    res.render("listings/new.ejs")
})

// show route
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})

//Edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
})

//Update route
app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true });
    res.redirect(`/listings/${id}`);

})

//Create route
app.post("/listings",async(req,res)=>{
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");

})

//Delelte route
app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})



app.get("/listings",async(req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})

app.get("/",(req,res)=>{
    res.send("Hi,this is a root");
});

// app.get("/testListing",async(req,res)=>{
//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description : "By the beach",
//         price : 1200,
//         location : "Calangute Goa",
//         country : "India"
//     });

//     await sampleListing.save();
//     console.log("sample is saved");
//     res.send("Successful testing");
// });


app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
})