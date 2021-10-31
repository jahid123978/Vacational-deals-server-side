const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 2000;
require('dotenv').config();

//Db_user: tourism-users
//Db_pass: v0uh55Pj7CteHINd

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ywrmz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        await client.connect();
        const database = client.db("tourism-orders");
        const userCollection = database.collection("tourism-information");
        const userOrders = database.collection("user-orders");
        const userDetails = database.collection("user-details");
        //Get API
        app.get('/services', async(req, res)=>{
            const cursor = userCollection.find({});
            const result = await cursor.toArray();
            res.json(result);

        })

        //Post API
        app.post('/orders', async(req, res)=>{
            const newOrders = req.body;
            const result = await userOrders.insertOne(newOrders);
            console.log("result: ", result);
            console.log("Hitting adding orders");
            // res.send("hitting orders");
            res.json(result);

        })

        //Get API for  manage orders
         app.get('/orders', async(req, res)=>{
             const cursor = userOrders.find({});
             const result = await cursor.toArray();
             res.json(result);
         })

         //Delete API for manage orders
         
         app.delete('/orders/:id', async(req, res)=>{
             const id = req.params.id;
             const query = {_id: id};
             const result = await userOrders.deleteOne(query);
             res.json(result);

         })

         //Post API for orders
         app.post('/managers', async (req, res) => {
             const details = req.body;
             console.log(req);
             const result = await userDetails.insertOne(details);
             res.json(result); 
         })

         //GET API for orders
         app.get('/managers', async (req, res) => {
             const cursor = userDetails.find({});
             const result = await cursor.toArray();
             res.json(result);
         })

         //DELETE API for orders users
         app.delete('/managers/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await userDetails.deleteOne(query);
            res.json(result); 
         })
    
         //POST API for adding new services
         app.post('/services', async (req, res) => {
             const newService = req.body;
             const result = await userCollection.insertOne(newService);
             res.json(result); 
         })

         //Update Get api
         app.get('/orders/:id', async (req, res) => {
             const id = req.params.id;
             const query = {_id: id};
             const status = await userOrders.findOne(query);
             res.send(status);
         })

         //Update API for status
         app.put('/orders/:id', async (req, res) =>{
             const id = req.params.id;
             const updateStatus = req.body;
             const filter = {_id: id};
             const options = {upsert: true};
             const UpdateDoc ={
                 $set: {
                     status: updateStatus.status
                 },
             };
             const result = await userOrders.updateOne(filter, UpdateDoc, options);
             res.json(result);
         })
    }
    finally{
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/', async (req, res)=>{
    console.log("tourism server successfully run");
    res.send("Tourism server is running");
})

app.listen(port, ()=>{
    console.log("listening port", port);
})
