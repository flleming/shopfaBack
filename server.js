const express= require('express')
const cors =require('cors');
const mongoose=require('mongoose');
const config=require('./config')
const http=require('http')
const UsersRoutes=require('./router/userRouter')
const helmet=require('helmet')
const app=express()
const formidableMiddleware=require("express-formidable")
const SellsRouter=require('./router/sellsRouter')
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
app.get('/', (req, res) => {
  res.send('Express server is up and runnings.');
})
const events = [
    {
      event: 'fileBegin',
      action: function (req, res, next, name, file) { /* your callback */ }
    },
    {
      event: 'field',
      action: function (req, res, next, name, value) {
        if (!req.myFields) {
          req.myFields = {}
        }
        if (req.myFields[name] == undefined) {
          req.myFields[name] = value
        } else {
          let aux = req.myFields[name]
          if (Array.isArray(req.myFields[name])) {
            req.myFields[name].push(value)
          } else {
            req.myFields[name] = [aux, value]
          }
        }
      }
    }
  ];
  app.use(formidableMiddleware({
    encoding: 'utf-8',
    uploadDir: './public/files',
    multiples: true,
  }, events));


const AdminRouter=require('./router/adminRouter')
app.use('/upload',express.static('upload'))
app.use('/user', UsersRoutes);
app.use('/admin',AdminRouter)
app.use('/sells',SellsRouter)
var server = http.createServer(app);

server.listen(port ,()=>{
    console.log(`server is runing on port ${port}`)
 })
