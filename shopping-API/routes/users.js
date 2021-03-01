const { json } = require('express');
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');


//User Signup Validation
router.post('/signup', (req, res, next) => {
  User.find({ username: req.body.username }).
    then(result => {
      if (result.length < 1) {
        
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(404).json({
              message: err
            })
          } else {
            const user = new User({
              username: req.body.username,
              password: hash
            })
            user.save().
              then(result => {
                console.log(result)
                res.status(200).json({
                  message: 'user already created'
                })
              }).
              catch(err => {
                res.status(404).json({
                  message: err
                })
              })
          }
        })
      } else {
        res.status(404).json({
          message: 'this user already created'
        })
      }
    }).catch(err => {
      res.status(404).json({
        message: err
      })
    })
})


//User Signin
router.get('/signin', (req, res, next) => {
  User.find({ username: req.body.username }).
    then(user => {
      if (user.length >= 1) {

        bcrypt.compare(req.body.password, user[0].password).
          then(result => {
            if (result) {
              res.status(200).json({
                message: 'success signin'
              })
            } else {
              res.status(404).json({
                message: 'wrong password'
              })
            }
          }).
          catch(err => {
            res.status(404).json({
              message: err
            })
          })
      } else {
        res.status(404).json({
          message: 'wrong user name'
        })
      }
    }).
    catch(err => {
      res.status(404).json({
        message: err
      })
    })
})


//Updating User 
router.patch('/updatuser/:id', (req, res, next) => {

  bcrypt.hash(req.body.password, 10).
    then(hash => {
      const newuser = {
        username: req.body.username,
        password: hash
      }
      User.findOneAndUpdate({ _id: req.params.id }, { $set: newuser }).
        then(result => {
          if (result) {
            res.status(202).json({
              message: 'user already updated'
            })
          } else {
            res.status(404).json({
              message: 'user not found'
            })
          }
        }).
        catch(err => {
          res.status(404).json({
            message: err
          })
        })
    }).
    catch(err => {
      res.status(404).json({
        message: err
      })
    })
})


//Deleting User
router.delete('/deleteuser/:id', (req, res, next) => {
  User.findOneAndDelete({ _id: req.params.id }).
    then(result => {
      if (result) {
        res.status(200).json({
          message: 'user deleted'
        })
      } else {
        res.status(404).json({
          message: 'user not found'
        })
      }
    }).
    catch(err => {
      res.status(404).json({
        message: err
      })
    })
})


module.exports = router;  
