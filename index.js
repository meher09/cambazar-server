const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const { request, query } = require('express')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// middlewares
app.use(cors())
app.use(express.json())
// app.use(express.urlencoded({ extended: true }));


// Z6oLpoNcLr6tcLSG
// cambazar


const uri = process.env.DB_URI
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});


async function run() {
    try {
        const userCollection = client.db('cambazar').collection('users')
        const categoriesCollection = client.db('cambazar').collection('categories')
        const productsCollection = client.db('cambazar').collection('products')
        const bookingsCollection = client.db('cambazar').collection('bookings')

        // Get Categories Data - Checked
        app.get('/categories', async (req, res) => {
            const query = {};
            const result = await categoriesCollection.find(query).toArray();
            res.send(result);
        })


        // Get Single Category Details
        app.get('/category/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const results = await categoriesCollection.findOne(query);
            res.send(results)
        })



        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        });

        app.get('/bookings/:email', async (req, res) => {
            const email = req.params.email
            const query = { buyer_email: email }
            const result = await bookingsCollection.find(query).toArray();
            res.send(result);
        });




        //get current login users data
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email };
            const result = await userCollection.findOne(query)
            res.send(result)

        })

        //get all buyers or Sellers
        app.get('/user/role/:role', async (req, res) => {
            const role = req.params.role
            const query = { role: role };
            const result = await userCollection.find(query).toArray();
            res.send(result)
        })














        // Verify Sellers
        app.put('/user/verify/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    verified: true
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })


        // User Email and JwT
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email
            const user = req.body
            const filter = { email: email }
            const options = { upsert: true }
            const updateDoc = {
                $set: user
            }
            const result = await userCollection.updateOne(filter, updateDoc, options)
            const token = jwt.sign(user, process.env.JWT_TOKEN_SECRET, { expiresIn: '1d' })
            res.send({
                success: true,
                result: result,
                token: token
            })
        })

        app.delete('/user/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })


        /*
         * Product Query Areas
         */

        // Get Single Product Details
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const results = await productsCollection.findOne(query);
            res.send(results)
        })




        // // Get Advertise Product For Home Page 
        app.get('/products', async (req, res) => {
            const query = { 'advertisement': true, 'status': 'available' }
            const results = await productsCollection.find(query).toArray();
            res.send(results)
        })

        // Get Category Wise Products
        app.get('/products/:category', async (req, res) => {
            const category = req.params.category
            const query = { category: category, status: "available" }
            const results = await productsCollection.find(query).toArray();
            res.send(results)
        })

        // Get my Products
        app.get('/products/seller/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const results = await productsCollection.find(query).toArray();
            res.send(results)
        })



        // // Post Product data
        app.post('/products', async (req, res) => {
            const product = req.body
            const result = await productsCollection.insertOne(product)
            res.send(result)

        })


        // // Advertise Data Product data
        app.put('/products/advertise/:id', async (req, res) => {
            const id = req.params.id
            const data = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: data
            }
            const result = await productsCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        // Add Reported Product
        app.put('/product/reported/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const data = req.body
            const updateDoc = {
                $set: data
            }
            const result = await productsCollection.updateOne(filter, updateDoc, options)
            res.send(result)

        })



        // Get Reported Content
        app.get('/products/reported/items', async (req, res) => {
            const query = { reported: true }
            results = await productsCollection.find(query).toArray();
            res.send(results)
        })

        // Delete Reported Product
        app.delete('/product/reported/item/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(query)
            res.send(result)


        })











    }




    finally { }
}



run().catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send({ msg: 'Server is running...', port: port, application: 'CamBazar', developer: 'Meher Nigar' })
})





app.listen(port, () => {
    console.log(` listening on port ${port}`)
})