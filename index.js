const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const { request } = require('express')
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
        console.log('Database Connected')

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
            console.log(result)
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