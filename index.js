const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("CURD operation app");
});

const uri = "mongodb+srv://mayinuddinmunna:O9UjHJtV7FeoBQ85@cluster0.qw4qqcz.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const userDatabase = client.db("userDB").collection("users");

        app.get('/users', async (req, res) => {
            const cursor = userDatabase.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const user = await userDatabase.findOne(query);
            res.send(user);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log("user", user);
            const result = await userDatabase.insertOne(user);
            res.send(result);
        });

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            console.log(id, user);
            const filter = { _id: new ObjectId(id) };
            console.log(filter);
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: user.name,
                    email: user.email
                }
            }
            const result = await userDatabase.updateOne(filter, updateDoc, options)
            res.send(result);
        });


        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('Please delete from database', id);
            const query = { _id: new ObjectId(id) }
            const result = await userDatabase.deleteOne(query);
            res.send(result);
        });


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`CRUD app listening on port ${port}`);
});