const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h2wm7t6.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const topCollegesCollection = client.db("CollegeSpotlight").collection("TopColleges");
    const allCollegesCollection = client.db("CollegeSpotlight").collection("allColleges");
    const galleryCollegesCollection = client.db("CollegeSpotlight").collection("galleryCollege");
    const researchPaperCollection = client.db("CollegeSpotlight").collection("researchPaper");
    const admissionCollection = client.db("CollegeSpotlight").collection("admissionCollege");
    const reviewsCollection = client.db("CollegeSpotlight").collection("reviews");

    app.get('/topColleges', async (req, res) => {
      const result = await topCollegesCollection.find().toArray();
      res.send(result)
    })

    app.get('/allColleges', async (req, res) => {
      const result = await allCollegesCollection.find().toArray();
      res.send(result)
    })

    app.get('/galleryColleges', async (req, res) => {
      const result = await galleryCollegesCollection.find().toArray();
      res.send(result)
    })

    app.get('/researchPaper', async (req, res) => {
      const result = await researchPaperCollection.find().toArray();
      res.send(result)
    })

    app.get('/admissionCollege/:email', async (req, res) => {
      const email = req.params.email;
      try {
        const result = await admissionCollection.find({ candidateEmail: email }).toArray();
        res.send(result);
      } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).send('Error retrieving data from the server.');
      }
    });

    app.get('/reviews', async (req, res) => {
      try {
        const reviews = await reviewsCollection.find().toArray();
        res.json(reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Error fetching reviews' });
      }
    });

    app.post('/admissionCollege', async (req, res) => {
      const item = req.body;
      const result = await admissionCollection.insertOne(item)
      res.send(result)
    })

    app.post('/reviews', async (req, res) => {
      const reviewData = req.body;
    
      try {
        const result = await reviewsCollection.insertOne(reviewData);
        res.status(200).json(result);
      } catch (error) {
        console.error('Error saving review:', error);
        res.status(500).json({ error: 'Error saving review' });
      }
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
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})