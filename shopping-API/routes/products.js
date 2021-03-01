const express = require('express');
const router = express.Router();
const Prodct = require('../models/Product');


//Find products
router.get('/', (req, res, next) => {
    Prodct.find().
        select('_id name price').
        then(doc => {
            const response= {
                doc : doc.map(doc=>{
                    return{
                        name: doc.name,
                        price: doc.price,
                        _id : doc._id,
                        url: {
                            type : 'GET',
                            urls : 'localhost:3000/products/'+ doc._id
                        }
                    }
                })
            }
            res.status(200).json({
                products: response
            })
        }).
        catch(err => {
            res.status(404).json({
                message: err
            })
        })
});


//Add products
router.post('/addproduct', (req, res, next) => {
    const prodct = new Prodct({
        name: req.body.name,
        price: req.body.price
    });
    prodct.save().
        then(doc => {
            res.status(200).json({
                message: 'added product'
            })
        }).
        catch(err => {
            res.status(404).json({
                message: err
            })
        })
})


//Edit products by id
router.get('/:productID', (req, res, next) => {
    Prodct.find({ _id: req.params.productID }).
        then(result => {
            res.status(200).json({
                product: result
            })
        }).
        catch(err => {
            res.status(404).json({
                message: err
            })
        })
})


//Update products by id
router.patch('/:productID', (req,res,next)=>{
   const newproduct = {
       name : req.body.name,
       price : req.body.price
   }
   Prodct.updateOne({_id: req.params.productID}, {$set: newproduct}).
   then(doc=>{
       res.status(200).json({
           message : doc
       })
   }).
   catch(err=>{
       res.status(404).json({
           message : err
       })
   })
})


//Delete products by id
router.delete('/productID', (req,res,next)=>{
    Prodct.deleteOne({_id:req.params.productID}).
    then(doc=>{
        res.status(200).json({
            message: doc
        })
    }).
    catch(err=>{
        res.status(404).json({
            message : err
        })
    })
})


module.exports = router;