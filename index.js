
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config()


// Middleware
app.use(cors());
app.use(express.json());


// MongoDB

const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

//console.log(dbUser,dbPass)

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.bruzsiw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    //await client.connect();

    const spotCollection = client.db('touristsSpotDB').collection('spots')
    const userCollection = client.db('touristsSpotDB').collection('users')

    app.post("/allTouristSpots",async(req,res)=>{
        const newSpot = req.body;
        //console.log(newSpot)
        const result = await spotCollection.insertOne(newSpot)
        res.send(result)
    })

    app.get("/allTouristSpots",async(req,res)=>{
        const cursor = spotCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get("/allTouristSpots/:id",async(req,res)=>{
        const id = req.params.id
        //console.log(id)
        const query = {_id: new ObjectId(id)}
        const result = await spotCollection.findOne(query)
        
        res.send(result)
    })

    app.delete("/allTouristSpots/:id",async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await spotCollection.deleteOne(query)
      res.send(result)
    })

    app.put("/allTouristSpots/:id", async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options  = {upsert:true}
      const updatedSpot = req.body
      //console.log(updatedSpot)
      const newSpot = {
        $set:{
          imageUrl:updatedSpot.imageUrl,
          touristSpotName:updatedSpot.touristSpotName,
          countryName:updatedSpot.countryName,
          location:updatedSpot.location,
          description:updatedSpot.description,
          averageCost:updatedSpot.averageCost,
          seasonality:updatedSpot.seasonality,
          travelTime:updatedSpot.travelTime,
          totalVisitorsPerYear:updatedSpot.totalVisitorsPerYear,
          totalVisitorsPerYear:updatedSpot.totalVisitorsPerYear,
          userEmail:updatedSpot.userEmail,
          userName:updatedSpot.userName,
          }
    }
    const result = await spotCollection.updateOne(filter,newSpot,options)
    res.send(result)
    })

    // User

    app.post("/users",async(req,res)=>{
      const user = req.body;
      const result = await userCollection.insertOne(user)
      res.send(result)
    })
    app.get("/users",async(req,res)=>{
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



// Server
app.get("/",(req,res)=>{
    res.send("Cholo is running.....")
})

app.listen(port,()=>{
    console.log(`ChoLo is running on port --> ${port}`)
})