const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion ,ObjectId} = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
// mid wire
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6dqvzgb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("coffeeDB");
    const coffee = database.collection("coffee");
    const users = database.collection("users");


    //  for read
    app.get('/coffee', async(req, res) => {
      const cursor = coffee.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // for create
    app.post('/coffee', async(req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffee.insertOne(newCoffee);
      res.send(result);
    });
    // for delete
    app.delete('/coffee/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffee.deleteOne(query);
      res.send(result);
    });
    // for edit
    app.get('/coffee/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffee.findOne(query);
      res.send(result);
    });
    app.put('/coffee/:id', async(req, res) => {
      const id = req.params.id;
      const updatedCoffee = req.body;
      const query = { _id: new ObjectId(id) };
      const options= { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedCoffee.name,
          quantity: updatedCoffee.quantity,
          supplier: updatedCoffee.supplier,
          photoUrl: updatedCoffee.photoUrl,
          taste: updatedCoffee.taste,
          details: updatedCoffee.details,
          category: updatedCoffee.category,
        },
      };
      const result = await coffee.updateOne(query, updateDoc,options);
      res.send(result);
    });
    
    // user related api
    // create user
    app.post('/users', async(req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await users.insertOne(newUser);
      res.send(result);
    });
    // get user
    app.get('/users', async(req, res) => {
      const cursor = users.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req, res) => {
  res.send('Coffee server is Running')
})

app.listen(port, () => {
  console.log(`Coffee server is Running on port ${port}`)
})