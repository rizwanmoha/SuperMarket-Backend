require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const corsOptions=require("./src/config/corsOptions");
const connectDB=require("./src/config/db");
const morgan=require("morgan");
const multer=require("multer");
const rfs=require("rotating-file-stream");
const path = require("path");
const app=express();

const errorMiddleware=require("./src/middlewares/errorMiddleware");
const notFoundMiddleware=require("./src/middlewares/notFoundMIddleware");

const authRouter=require("./src/routers/authRouter");
const userRouter=require("./src/routers/userRouter");
const orderRouter=require("./src/routers/orderRouter");
const blogRouter=require("./src/routers/blogRouter");
const sellerRouter=require("./src/routers/sellerRouter");
const productRouter = require("./src/routers/productRoutes");
const cartRouter=require("./src/routers/cartRouter");
const reviewRouter = require('./src/routers/reviewRouter');
const contactRouter=require('./src/routers/contactRouter');
const adminRouter=require('./src/routers/adminRouter')
const { authenticateToken } = require("./src/middlewares/authMiddleware");

//Database Connection
connectDB();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, "public")));

const publicPath = path.join(__dirname, 'src', 'public');

// Set up Express to serve static files from the public directory
app.use(express.static(publicPath));

const accessStream=rfs.createStream('access.log',{
  interval: "1d",
  path: path.join(__dirname,"log")
});

// morgan.token('id', function getId (req) {
//   return req.id
// })

// app.use(assignId)
// app.use(morgan(':id :method :url :response-time'))

// function assignId (req, res, next) {
//   req.id = uuid.v4()
//   next()
// }

app.use(morgan(":method :url :status - :response-time ms",{ stream: accessStream }));

// Multer file upload
const upload=require("./src/utils/multer");

app.use('/api/auth',authRouter);

app.use('/api/users',userRouter);
app.use('/api/orders',orderRouter);
app.use('/api/blogs',blogRouter);
app.use('/api/seller',sellerRouter);
app.use('/api/products',productRouter);
app.use('/api/cart',cartRouter);
app.use('/api/reviews',reviewRouter);
app.use('/api/contact',contactRouter);
app.use('/api/admin',adminRouter)
// File uploading route
app.post('/api/uploads',authenticateToken, upload.array('files', 6), (req, res) => {

  console.log(req.files);

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  // const imageUrls = req.files.map(file => `${req.protocol}://${req.get('host')}/images/uploads/${file.filename}`);

  const imageUrls = req.files.map(file => ({
    name: `${req.protocol}://${req.get('host')}/images/uploads/${file.filename}` // Assuming you are using S3 or another service that provides a location for uploaded files
}));

  res.status(200).json({ images: imageUrls });
});

app.get("/", (req, res) => {
  return res.json({ msg: "Server running!" });
});

// Route not found
app.use(notFoundMiddleware);

app.use(errorMiddleware);

const PORT=5000;
app.listen(PORT,()=>
{
    console.log(`Server listeing on PORT:${PORT}`);
});