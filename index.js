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

        // Get Categories Data
        app.get('/categories', async (req, res) => {
            const query = {};
            const result = await categoriesCollection.find(query).toArray();
            res.send(result);
        })

        // Get Single Category Details
        app.get('/category/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            results = await categoriesCollection.findOne(query);
            res.send(results)
        })



        //get all users
        app.get('/users', async (req, res) => {
            const query = {};
            const result = await userCollection.find(query).toArray();
            res.send(result)

        })

        //get all buyers or Sellers
        app.get('/user/:role', async (req, res) => {
            const role = req.params.role
            const query = { role: role };
            const result = await userCollection.find(query).toArray();
            res.send(result)
        })


        // Get Advertise Product For Home Page 
        app.get('/products', async (req, res) => {
            const query = { 'advertisement': true, 'status': 'available' }
            const results = await productsCollection.find(query).toArray();
            res.send(results)
        })

        // Get Category Wise Products
        app.get('/products/:category', async (req, res) => {
            const category = req.params.category
            const query = { category: category }
            results = await productsCollection.find(query).toArray();
            res.send(results)
        })

        // Get Single Product Details
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            results = await productsCollection.findOne(query);
            res.send(results)
        })

        // Add Reported Product
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const reported = req.body
            const updateDoc = {
                $set: {
                    reported: true
                }
            }
            const result = await productsCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        app.get('/reported', async (req, res) => {
            const query = {}
            results = await productsCollection.find(query).toArray();
            res.send(results)
        })


        // Verify Sellers
        app.put('/user/:id', async (req, res) => {
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