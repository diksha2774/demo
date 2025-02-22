const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://dikshasugandhi277:diksha2774@cluster0.xzbbccc.mongodb.net/EventDemo");
const EventSchema = new mongoose.Schema({
    title:String,
    description:String,
    start_date:Date,
    end_date:Date,
    start_time:String,
    end_time:String,
    venue:String,
    event_type:String,
    chief_guest:{
        type:String,
        default:""
    },
    public_event:{
        type:Boolean,
        default:true
    }
});


const Event = mongoose.model("Event",EventSchema);
module.exports=Event;
