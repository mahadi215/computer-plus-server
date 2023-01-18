const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//midlleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x4kttba.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {

        const categoriesMenu = client.db('computerPlusDB').collection('Categories_menu')
        const allProducts = client.db('computerPlusDB').collection('allProducts')
        const subCategories = client.db('computerPlusDB').collection('subCategories')
        const cartCollection = client.db('computerPlusDB').collection('cartInfo')
        const orderCollection = client.db('computerPlusDB').collection('orderCollection')

        app.get('/categoriesMenu', async (req, res) => {
            const query = {};
            const result = await categoriesMenu.find(query).toArray();
            res.send(result);
        });

        // get sub categorie........................
        app.get('/subCategories', async (req, res) => {
            const query = {};
            const result = await subCategories.find(query).toArray();
            res.send(result)
        })
        // get sub categorie by id........................
        app.get('/subCategories/:id', async (req, res) => {
            const id = req.params.id
            const query = { categorie_id: id };
            const result = await subCategories.find(query).toArray();
            res.send(result)
        })

        // app.put('/categoriesMenu/addsub', async (req, res) => {
        //     const subCate = req.body;
        //     console.log(subCate);
        //     const filter = { _id: ObjectId(subCate.categorie_id) };
        //     const option = { upsert: true };
        //     const find = await categoriesMenu.find(filter)
        //     const add ={
        //         $push: { subCategorie: {
        //             name: subCate.name,
        //             categorie_id: subCate.categorie_id
        //         }
        //     }}
        //     const updatedDoc = {
        //         $set: {
        //             subCategorie: [{
        //                 name: subCate.name,
        //                 categorie_id: subCate.categorie_id
        //             }]
        //         }
        //     }
            
        //         const result = await categoriesMenu.updateOne(filter, add);
        //         return res.send(result)
        
        //     // const result = await categoriesMenu.updateOne(filter, updatedDoc, option);            
        //     // res.send(result);
        // })

        app.get('/allProducts', async (req, res) => {
            const query = {};
            const result = await allProducts.find(query).toArray();
            res.send(result);
        });

        // get product by id ...... 
        app.get('/allProducts/:id', async (req, res) => {
           const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await allProducts.find(query).toArray();
            res.send(result);
        });

        // get product by categorie ...... 
        app.get('/categorie/products', async (req, res) => {
        //    const id = req.params.id;
        //    console.log(id);
            const filter = {};
            const result = await allProducts.find(filter).toArray();
            res.send(result);
        });

        
        // get cart info
        app.get('/cart/:email', async(req, res)=>{
            const email = req.params.email;
            // console.log(email);
            const query = {
                userEmail: email
            }
            const result = await cartCollection.find(query).toArray()
            res.send(result)
        })

        // add Cart information
        app.post('/cartInfo/add', async(req, res)=>{
            const cartInfo = req.body;
            // console.log(cartInfo);
            const result = await cartCollection.insertOne(cartInfo)
            res.send(result)

        })

        // delete cart items
        app.delete('/cart/delete/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await cartCollection.deleteOne(filter);
            res.send(result);
        })

        //get all orders.....................
        app.get('/orders/user/:email', async(req,res)=>{
            const email = req.params.email
            const query = {
                'Address.Email': email
            }
            // console.log(email);
            const result = await orderCollection.find(query).toArray()
            res.send(result)
            // console.log(result);
        })

        //get all orders.....................
        app.get('/orders/admin', async(req,res)=>{
            const query = {
            }
            const result = await orderCollection.find(query).toArray()
            res.send(result)
        })

        //get order by id.....................
        app.get('/orders/admin/:id', async(req,res)=>{
            const id = req.params.id
            const query = {  _id: ObjectId(id) }
            const result = await orderCollection.find(query).toArray()
            res.send(result)
        })

        //add orders.....................
        app.post('/orders/add', async(req,res)=>{
            const order = req.body;
            const query = {
                Address:order.Address,
                Products:order.Products
            }
            const result = await orderCollection.insertOne(query)
            res.send(result)
        })


        // add Products ..................
        app.post('/allProducts/add', async (req, res) => {
            const product = req.body;
            // console.log(product);
            const query = {
                cateID: product.cateID,
                subCateID: product.subCateID,
                productName: product.name,
                image: product.img,
                price: product.price,
                brand: product.brand,
                description: product.desc,
            }
            const result = await allProducts.insertOne(query)
            res.send(result)
        })


        // add categories ..................
        app.post('/categoriesMenu', async (req, res) => {
            const categorie = req.body;
            const query = {
                name: categorie.categorie,
                // subCategorie: product.subCategorie,
                // childCategorie: product.childCategorie,
            }
            const result = await categoriesMenu.insertOne(query);
            res.send(result)
        })

        // add sub categories ..................
        app.post('/subCategories/addsub', async (req, res) => {
            const subCategorie = req.body;
            const query = {
                name: subCategorie.name,
                categorie_id: subCategorie.categorie_id
            }
            const result = await subCategories.insertOne(query);
            res.send(result)
        })



        // delete categorie
        app.delete('/mainCategorie/delete/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await categoriesMenu.deleteOne(filter);
            res.send(result);
        })


        // delete product
        app.delete('/product/delete/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await allProducts.deleteOne(filter);
            res.send(result);
        })

        // // delete subcategorie
        // app.delete('/subCategories/delete/:name', async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: ObjectId(id) };
        //     const result = await categoriesMenu.deleteOne(filter);
        //     res.send(result);
        // })

    }
    finally {

    }
}
run().catch(console.log())

app.get('/', async (req, res) => {
    res.send('PC-Plus server is running')
});

app.listen(port, () => console.log(`server runing on ${port}`));


