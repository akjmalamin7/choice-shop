require('dotenv/config')
const app = require('./app')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_LOCAL_URL)
.then(()=>console.log("Connected to MongoDB!"))
.catch((err)=>console.error("MongoDB Connection Failed!"))

const port = process.env.PORT || 3001
app.listen(port, ()=>{
    console.log(`Server is running on port:http:127.0.0.1:${port}`)
})
