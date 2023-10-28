const express = require('express')
const path = require('path')
const router = express.Router()
const Product = require('../models/product.js')
const marklogic = require('marklogic')

const db = marklogic.createDatabaseClient({
    host: 'localhost',
    port: '8000',
    user: 'admin',
    password: 'password',
    authType: 'DIGEST'
})

const qb = marklogic.queryBuilder;

function randomInt(rightBound) {
    return Math.floor(Math.random() * rightBound);
}

function randomString(size) {
    var alphaChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var generatedString = '';
    for (var i = 0; i < size; i++) {
        generatedString += alphaChars[randomInt(alphaChars.length)];
    }

    return generatedString;
}

router.put('/', async (req, res) => {
    try {
        const start = performance.now()
        const pb = marklogic.patchBuilder;

        var patch = await db.documents.patch(
            '10351143899009579038.json',
            pb.replace('/storage', 100)
        ).result();

        const end = performance.now()

        return res.status(200).json({
            message: 'Item atualizado com sucesso',
            data: {
                totalTime: end - start,
                patch
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Erro interno no servidor',
            error: error
        })
    }
})

router.post('/collection/:qtd', async (req, res) => {
    try {
        var qtd = req.params.qtd;


        const start = performance.now()

        for (let a = 0; a < qtd; a++) {
            var products = []

            products.push({
                contentType: 'application/json',
                collections: ['products']
            })

            for (let i = 0; i < 1000; i++) {
                var insert = {
                    extension: 'json',
                    contentType: 'application/json',
                    content: new Product()
                }
                products.push(insert)
            }

            await db.documents.write({ documents: products }).result();
        }

        const end = performance.now()

        return res.status(200).json({
            message: 1000 * qtd + ' itens cadastrados com sucesso',
            data: {
                totalTime: end - start
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Erro interno no servidor',
            error: error
        })
    }
})

router.post('/collection', async (req, res) => {
    try {

        var products = []

        for (let i = 0; i < 100; i++) {
            products.push(new Product())
        }

        const start = performance.now()

        var result = await db.createCollection('products', products).result();

        const end = performance.now()

        return res.status(200).json({
            message: result.length + ' itens cadastrados com sucesso',
            data: {
                totalTime: end - start,
                result
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Erro interno no servidor',
            error: error
        })
    }
})

router.post('/document', async (req, res) => {
    try {
        var product = new Product()

        const start = performance.now()

        db.documents.write({
            uri: '/products',
            contentType: 'application/json',
            content: {
                product
            }
        }).result(function (response) {
            const end = performance.now()

            return res.status(200).json({
                message: 'Item cadastrado com sucesso',
                data: {
                    totalTime: end - start,
                    response
                }
            })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Erro interno no servidor',
            error: error
        })
    }
})

router.get('/', async (req, res) => {
    try {

        const start = performance.now()

        /* var result = await db.documents.query(
            qb.where(qb.collection("products")).withOptions({categories: 'none'})
        ).result(); */

        var result = await db.documents.query(
            qb.where(qb.byExample({
                price: { $gt: 10000 },
                $filtered: true
                
            }))
            .where({pageLength: 500})
        ).result();

        const end = performance.now()

        return res.status(200).json({
            message: 'Itens buscados com sucesso',
            data: {
                totalTime: end - start,
                result
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Erro interno no servidor',
            error: error
        })
    }
})

module.exports = router