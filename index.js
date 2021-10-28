const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectID = require('mongodb').ObjectId
const cors = require("cors");
require('dotenv').config();
const app = express();
const port =process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yjiyu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("CarMechanic");
    const servicesCollection = database.collection("service");
    
     // *GET API*
    app.get('/services', async(req, res) =>{
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services)
      })

    // *GET Single API*
    app.get('/services/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectID(id)};
        const service = await servicesCollection.findOne(query);
        res.json(service);
    })

    // *DELETE API*
    app.delete('/services/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectID(id)}
      const result = await servicesCollection.deleteOne(query);
      console.log('id',query)
      res.json('result',result);
    })
    
  //update product
  app.put('/services/:id', async (req, res) => {
    const id = req.params.id;
    console.log("update", id);
    const updatedName = req.body;
    const filter = {_id: ObjectID(id)};
    const options = {upseert : true}
    const updateDoc ={
      $set:{
        name: updatedName.name,
        email: updatedName.email
      }
    }
    const result = await servicesCollection.updateOne(filter, updateDoc, options)
    res.json(result)
  })





    // *POST API*
    app.post('/services', async(req, res) =>{
        const service = req.body;
          const result = await servicesCollection.insertOne(service);
          res.json(result)
      });
    
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Genius Server");
});

app.listen(port, () => {
  console.log("running genius server", port);
});
