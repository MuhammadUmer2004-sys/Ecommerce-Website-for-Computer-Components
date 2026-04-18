const express = require("express")
const app = express();
require('dotenv').config();
const cors = require('cors'); // This imports the cors package
const corsOptions = {
    origin: '*', // Replace with your frontend URL 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  };
app.use(cors(corsOptions));

//Handles Error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
  });
  
// middleware
const {
    authenticateToken,
    authorizeRole
} = require("./middleware/auth.js")

app.use(express.json());

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/Category.js');
const productRoutes = require('./routes/Product.js');
const cartRoutes = require('./routes/Cart');
const orderRoutes = require('./routes/Order');
const shippingAddressRoutes = require('./routes/ShippingAddress');
const wishlistRoutes = require('./routes/Wishlist');
const userRoutes = require("./routes/User.js");
const reviewRoutes = require('./routes/Review');
const paymentRoutes = require('./routes/Payment')

//utils
const { scheduleTokenCleanup } = require('./utils/scheduler');
scheduleTokenCleanup();

//Category Routes
app.use('/api/categories', categoryRoutes);

//Product Routes
app.use('/api/products', productRoutes);

//Cart Routes
app.use('/api/cart', cartRoutes);

//Order Routes
app.use('/api/orders', orderRoutes);

//ShippingAddress Routes
app.use('/api/shipping-address', shippingAddressRoutes);

//Wishlist Routes
app.use('/api/wishlist', wishlistRoutes);

//User Routes
app.use('/api/profile', userRoutes);

//Review Routes
app.use('/api/reviews', reviewRoutes);

//Payment Routes
app.use('/api/payments', paymentRoutes);

//Authentication Routes {login, register}
app.use('/api/auth', authRoutes);

// Protected Route for Customers
app.get('/customer', authenticateToken, authorizeRole('customer'), (req, res) => {
    res.json({ message: `Welcome, customer ${req.user.email}!` });
});

// Protected Route for Admins
app.get('/admin',/* authenticateToken, authorizeRole('admin'),*/ (req, res) => { 
    res.json({ message: `Welcome, admin !` });
});//${req.user.email}

app.listen(5000,'0.0.0.0', ()=>{
    console.log("App is listening on port 5000")
})



