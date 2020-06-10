const express= require('express')
const cors =require('cors');
const mongoose=require('mongoose');
const config=require('./config')
const http=require('http')
const UsersRoutes=require('./router/userRouter')
const helmet=require('helmet')
const app=express()
const port =process.env.PORT || 5000;
app.use(helmet())

app.use(cors())
app.use(express.json())
mongoose.connect(config.mongoURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false})

const connection=mongoose.connection
connection.once('open',()=>{
    console.log("Mongodb database connection successfully")
})




app.use('/', UsersRoutes);

var server = http.createServer(app);

server.listen(port ,()=>{
    console.log(`server is runing on port ${port}`)
 })
