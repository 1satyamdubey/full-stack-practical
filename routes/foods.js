const express = require('express');
const Food = require('../models/Food');

const router = express.Router();

const validateFoodPayload = (body) => {
  const { name, category, price } = body;
  if (name == null || category == null || price == null) {
    return 'name, category, and price are required';
  }
  if (typeof price !== 'number' || price <= 0) {
    return 'price must be a number greater than 0';
  }
  return null;
};

router.post('/', async (req, res, next) => {
  try {
    const errorMessage = validateFoodPayload(req.body);
    if (errorMessage) {
      return res.status(400).json({ error: errorMessage });
    }

    const food = new Food(req.body);
    const savedFood = await food.save();
    res.status(201).json(savedFood);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    next(error);
  }
});

router.get('/available', async (req, res, next) => {
  try {
    const foods = await Food.find({ isAvailable: true });
    res.json(foods);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    res.json(food);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const errorMessage = validateFoodPayload(req.body);
    if (errorMessage) {
      return res.status(400).json({ error: errorMessage });
    }

    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
        context: 'query',
      }
    );

    if (!updatedFood) {
      return res.status(404).json({ error: 'Food item not found' });
    }

    res.json(updatedFood);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    res.json({ message: 'Food item deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
