const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new mongoose.Schema({
    title : {
        type : String,
        

    },

    description : {
        type : String,
        
    },

    image : {
        filename : String,
        url : {
            type : String,
            default : "https://unsplash.com/photos/people-on-wooden-lookout-above-beach-aZRA7hvgzyg",
            set : (v)=> v === "" ? "https://unsplash.com/photos/people-on-wooden-lookout-above-beach-aZRA7hvgzyg" : v,
        },
    },

    price : {
        type : Number,
        
    },

    location : {
        type : String,
    },

    country : {
        type : String,
    },
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;