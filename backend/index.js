const express = require("express");
const app = express();
const cors = require("cors");
const Event = require("./modules/Event");

app.use(express.json());
app.use(cors());
app.post("/event",async(req,res)=>{
    const event = req.body;
    const newevent = new Event(event);
    await newevent.save();
    res.json({message:"Event created successfully"});
})

app.get("/event",async(req,res)=>{
    const events = await Event.find();
    res.json(events);
})

app.listen(4000,()=>{
    console.log("Server is running on port 3000");    
})


