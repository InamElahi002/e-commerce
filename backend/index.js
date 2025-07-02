// const port = 4000;
const express = require("express");
const app = express();


const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const { log } = require("console");

// Auto-create upload/images folder if not exists
const uploadPath = "./upload/images";
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

app.use(express.json());
app.use(cors());

require("dotenv").config();

const port = process.env.PORT || 4000;
// const JWT_SECRET = process.env.JWT_SECRET;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

mongoose.connect(process.env.MONGODB_URI)








// Test API route
app.get("/", (req, res) => {
    res.send("Express App is Running");
});

// Image storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Serve static files from 'upload/images'
app.use('/images', express.static(uploadPath));

// Upload endpoint for images
app.post("/upload", upload.single('product'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: 0, message: "No file uploaded" });
    }

    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// Product Schema and Model
const Product = mongoose.model("Products", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
});

// Add Product Route
app.post('/addproduct', async (req, res) => {
    const products = await Product.find({});
    let id;


    //for uniqe id
    if (products.length > 0) {
        let last_product = products[products.length - 1];
        id = last_product.id + 1;
    } else {
        id = 1;
    }

    try {
        const newProduct = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category || "default",
            new_price: Number(req.body.new_price),
            old_price: Number(req.body.old_price),
        });

        await newProduct.save();
        console.log("Product saved:", newProduct);
        res.json({ success: true, name: newProduct.name });

    } catch (error) {
        console.error("Error saving product:", error.message);
        res.status(500).json({ success: false, message: "Failed to save product" });
    }
});


//creating api for deleting products

app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed")
    res.json({
        success: true,
        name: req.body.name
    });
})

//creating api for getting all products
app.get('/allproducts', async (req, res) => {

    let products = await Product.find({});
    console.log("All Products Fetched")
    res.send(products)
})


// MongoDB connection
mongoose.connect("mongodb+srv://inamelahi:inamelahi1122@cluster0.ojlld.mongodb.net/e-commerce")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB Connection Error:", err));






// Schema for User model
const Users = mongoose.model("Users", {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cartData: {
        type: Array,
        default: []
    },
    date: {
        type: Date,
        default: Date.now
    }
})


//creating endpoint for registering the user

app.post('/signup', async (req, res) => {

    let check = await Users.findOne({ email: req.body.email })
    if (check) {
        return res.status(400).json({ success: false, errors: "existing user found with same email address " })
    }
    let cart = []

    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new Users({

        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,

    })
    await user.save();

    const data = {
        user: {
            id: user.id
        }
    }


    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token });


})

//creating endpoint for user login
app.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, errors: "Wrong Password " })
        }
    }
    else {
        res.json({ success: false, errors: "Wrond Email id" })
    }

})

//creating endpoint for new collection data;
app.get('/newcollections', async (req, res) => {
    let products = await Product.find({});
    let newcollections = products.slice(1).slice(-8);
    console.log("NewCollection Fetched")
    res.send(newcollections)


})

//creating endpoint for popular in women in women section
app.get('/popularinwomen', async (req, res) => {
    let products = await Product.find({ category: "women" });
    let popular_in_women = products.slice(0, 4);
    console.log("Popular in women Fetched");
    res.send(popular_in_women);
});




//creating middleware for fetch user

const fetchUser = async (req, res, next) => {


    const JWT_SECRET = "yourSecretKey"; // use env var in real app

    const token = req.header('auth-token')
    if (!token) {
        res.status(401).send({ errors: "Please authenticate using vaild token" })

    }
    else {
        try {
            const data = jwt.verify(token, 'secret_ecom')
            req.user = data.user
            next();
        }

        catch (error) {

            res.status(401).send({ errors: "Please authenticate using vaild token " })

        }
    }

}

//creating endpoint for adding products in cart
app.post('/addtocart', fetchUser, async (req, res) => {
    console.log("Added", req.body.itemid)
    //   console.log(req.body,req);

    let userData = await Users.findOne({ _id: req.user.id })
    userData.cartData[req.body.itemid] += 1;
    await Users.findByIdAndUpdate({ _id: req.user.id }, { cartData: userData.cartData })

    res.json({ success: true, message: "Added to cart" });

})

//creating endpoint for remove products from cartData
app.post('/removefromcart', fetchUser, async (req, res) => {
    console.log("removed", req.body.itemid)

    let userData = await Users.findOne({ _id: req.user.id })
    if (userData.cartData[req.body.itemid] > 0)
        userData.cartData[req.body.itemid] -= 1;
    await Users.findByIdAndUpdate({ _id: req.user.id },
        { cartData: userData.cartData })

    res.json({ success: true, message: "Removed from cart" });

})

//creating endpoint to get cartdata
app.post('/getcart', fetchUser, async (req, res) => {
    console.log("GetCart");
    let userData = await Users.findOne({ _id: req.user.id })

    res.json({ cartData: userData.cartData });



})







//Schema model for PlaceOrder
const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    deliveryInfo: {
        firstName: String,
        lastName: String,
        email: String,
        city: String,
        state: String,
        country: String,
        zipCode: String,
        phone: String
    },
    cartItems: [
        {
            id: Number,
            name: String,
            new_price: Number,
            quantity: Number
        }
    ],
    totalAmount: Number,
    orderDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Completed', 'Out for Delivery', 'Delivered' ],
        default: 'Pending'
    }

});

const Order = mongoose.model('Order', OrderSchema);




// api for Place Order
app.post("/api/order/place", fetchUser, async (req, res) => {
    try {
        const { deliveryInfo, cartItems, totalAmount } = req.body;

        if (!deliveryInfo || !cartItems || !totalAmount) {
            return res.status(400).json({ success: false, message: "Missing order fields" });
        }

        const newOrder = new Order({
            user: req.user.id,
            deliveryInfo,
            cartItems,
            totalAmount
        });

        await newOrder.save();

        // Clear cart data
        await Users.findByIdAndUpdate(req.user.id, { cartData: Array(300).fill(0) });

        res.json({
            success: true,
            message: "Order placed successfully",
            redirect_url: "http://localhost:3000/order/success"
        });

    } catch (error) {
        console.error("Order placement error:", error);
        res.status(500).json({ success: false, message: "Failed to place order" });
    }
});

//api for  Get Orders of Logged-In User to myorder
app.get("/api/order/myorders", fetchUser, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ orderDate: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Fetching my orders error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
});




//api for admin/Order/Product
app.put("/api/admin/updateorder/:orderId", async (req, res) => {
    try {
        const { status } = req.body;

        if (!['Pending', 'Completed'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const updated = await Order.findByIdAndUpdate(
            req.params.orderId,
            { status },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, order: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update order status" });
    }
});



//api for check section in stripe
// const stripe = require('stripe')('sk_test_51RSxs4I5c2bVmMJGW0CpHDqyBNm1ivdNHvdLYbOeSM3sf3mZDtZzQsIEo8OT31lo7kJqdLvZTweDaqIB1Hqudwg900TIMnig2E'); 
// 
// 
// Use env var in production

app.post('/api/create-checkout-session', async (req, res) => {
    const { cartItems, deliveryInfo, totalAmount } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: cartItems.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.new_price * 100, // Stripe expects amount in cents
                },
                quantity: item.quantity,
            })),
            mode: 'payment',

            // ✅ These URLs must be live if you're deploying
            success_url: 'http://localhost:3000/order/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/cart',
            metadata: {
                deliveryInfo: JSON.stringify(deliveryInfo),
                totalAmount: totalAmount.toString(),
            },
        });

        res.json({ id: session.id }); // ✅ correct

    } catch (error) {
        console.error("Stripe session error:", error);
        res.status(500).json({ error: 'Stripe session creation failed' });
    }
});



//api for order/success page
app.get("/api/verify-session", async (req, res) => {
    const { session_id } = req.query;

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status === "paid") {
            return res.status(200).json({ success: true });
        } else {
            return res.status(400).json({ success: false });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});







// Admin - Get All Orders
app.get("/api/admin/allorders", async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ orderDate: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Admin fetch orders error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch all orders" });
    }
});


// Update Order Status via Body (Admin Panel)
app.put("/api/admin/order/status", async (req, res) => {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
        return res.status(400).json({ success: false, message: "Order ID and status are required" });
    }

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.json({ success: true, message: "Status updated" });


    } catch (error) {
        console.error("Update status error:", error);
        res.status(500).json({ success: false, message: "Failed to update order status" });
    }
});


// Delete order by ID (Admin only)
app.delete("/api/admin/order/:orderId", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ success: false, message: "Failed to delete order" });
  }
});













// Start server
app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on port", port);
    } else {
        console.log("Error:", error);
    }
});







