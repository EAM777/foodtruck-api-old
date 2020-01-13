import mongoose from 'mongoose';
import { Router } from 'express';
import FoodTruck from '../model/foodtruck';
import Review from '../model/review';
import  { authenticate } from '../middleware/authMiddleware';


export default ({ config, db }) => {
  let api = Router();


// CRUD - Create Read Update Delete
  // '/v1/foodtruck/add'
  api.post('/add', authenticate , (req, res) => {
    let newFoodTruck = new FoodTruck();
    newFoodTruck.name = req.body.name;
    newFoodTruck.foodType = req.body.foodType;
    newFoodTruck.avgcost = req.body.avgcost;
    newFoodTruck.geometry.coordinates = req.body.geometry.coordinates;


    newFoodTruck.save(err =>  {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'FoodTruck saved succesfully' });
    });
  });

  // read 'v1/foodtruck' - Read

  api.get('/', (req, res) =>  {
    FoodTruck.find({}, (err, foodtrucks) => {
      if (err) {

        res.send();
      }

      res.json(foodtrucks);

    });
  });

  // '/v1/foodtruck/:id' - Read 1 specific object

  api.get('/:id', (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtrucks) =>  {
      if (err) {
        res.send(err);
      }
      res.json(foodtrucks);
    });
  });

  // '/v1/foodtruck/:id' - Update

  api.put('/:id', authenticate ,(req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      foodtruck.name = req.body.name;
      foodtruck.save(err => {
        if (err) {
          res.send(err);
        }
        res.json({ message: "foodtruck info updated"});

      });
    });
  });

  // '/v1/foodtruck/:id' - delete

  api.delete('/:id', authenticate ,(req, res) => {
    FoodTruck.remove({
      _id: req.params.id

    }, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      res.json({ message: "foodtruck Succefully Removed!"});
    });
  });

  // add review for a specific foodtruck
  // '/v1/foodtruck/reviews/add/:id'
  api.post('/reviews/add/:id', authenticate , (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err);
        }
        let newReview = new Review();

        newReview.title = req.body.title;
        newReview.text = req.body.text;
        newReview.foodtruck = foodtruck._id;
        newReview.save((err, review) => {
          if (err) {
            res.send(err);
          }
          foodtruck.reviews.push(newReview);
          foodtruck.save(err => {
            if (err) {
              res.send(err);
            }
            res.json({ message: 'Food truck review saved!' });
          });
        });
    });
  });

  // get specific reviews foodtruck id
  // '/v1/foodtruck/reviews/:id'

  api.get('/reviews/:id', (req, res) => {
    Review.find({foodtruck: req.params.id }, (err, reviews) => {
      if (err) {
        res.send(err);
      }
      res.json(reviews);
    });
  });

  return api;

}
