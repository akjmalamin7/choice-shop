require('express-async-errors')
const express = require('express')
const app = express()
const cors = require("cors")
const morgan = require('morgan')
const error = require('./middleware/error')

const userRouter = require('./routes/userRouter')
const categoryRouter = require('./routes/categoryRouter')
const productRouter = require('./routes/productRouter')


app.use(express.json())
app.use(cors())
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
app.get("/", (req, res)=>{
    res.send("Welcome my server")
})
app.use('/api/user', userRouter)
app.use('/api/category', categoryRouter)
app.use('/api/product', productRouter)

app.use(error)

module.exports = app
