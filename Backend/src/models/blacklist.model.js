const mongoose = require("mongoose")

const balckListScema = new mongoose.Schema({
    token:{
        type:String,
        require:[true,"token is required for blackListing"]
    }
},{
  timestamps:true  
})

const blackListModel = mongoose.model("blackList",balckListScema)

module.exports = blackListModel