
const express = require('express');
const app = express();
const port = 3000;

const { createClient } = require('redis')
const client = createClient();

const getProducts = async () => {
    const time = Math.random() * 5000;
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(['Product 1', 'Product 2', 'Product 3']);
        }, time);
    })
}


app.get('/salve', async (req, res) => {
    await client.del('getProducts')
    res.send({
        ok: 1
    })
    return;
});

app.get('/salve', async (req, res) => {


})
app.get('/', async (req, res) => {
    const productsFromCache = await client.get('getProducts');
    if (productsFromCache) {
        console.log('Retrieved products from cache');
        res.send(JSON.parse(productsFromCache));
        return;
    }
    const products = await getProducts();
    console.log('Retrieved products from database');
    await client.set('getProducts', JSON.stringify(products), { EX: 10 });
    res.send(products);
});

const startup = async () => {
    await client.connect();
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
startup();
