const mongoose=require('mongoose')
const otpSchema=new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    otp: {
        type: Number,
        required: true
    },
    expiry: {
        type: Date,
        required: true
    }
}, { timestamps: true }
)
module.exports=mongoose.model('Otp', otpSchema)