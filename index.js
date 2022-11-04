const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rwqozng.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollections = client.db('geniusCar').collection('services');
        const orderCollections = client.db('geniusCar').collection('orders');

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollections.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollections.findOne(query);
            res.send(service);

        })

        app.get('/orders', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email,
                }
            }
            const cursor = orderCollections.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        })
        // order api

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollections.insertOne(order);
            res.send(result);
        })

        app.patch('/orders/:id', async (req, res) => {
            const status = req.body.status;
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    status: status
                }
            }
            const result = await orderCollections.updateOne(query, updatedDoc);
            res.send(result);
        })

        app.delete('/orders/:id',async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollections.deleteOne(query);
            res.send(result);
        })
    }
    finally {
        
    }
}
run().catch(error => console.error(error));


app.get('/', (req, res) => {
    res.send("Server is running");
})

app.listen(port, () => {
    console.log(`App listening port ${port}`);
})