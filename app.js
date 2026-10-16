const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError")
const {listingSchema} = require("./schema.js")


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

// New route
app.get("/listings/new", wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
})
)

const validateListing = (req, res, next) =>{
    let {error} = listingSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el)=> el.message).join(",");
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }

}

// show route
app.get("/listings/:id",wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        return res.status(404).send("Listing not found");
    }

    res.render("listings/show.ejs", { listing });
})
)

//Edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
})
)

//Update route
app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true });
    res.redirect(`/listings/${id}`);

})
)

//Create route
app.post("/listings",validateListing,
    wrapAsync (async(req,res,next)=>{
        let result = listingSchema.validate(req.body);
        console.log(result);
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
})
)

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

app.all("/{*splat}",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.render("error.ejs",{message})
    // res.status(statusCode).send(message);
})

app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
})