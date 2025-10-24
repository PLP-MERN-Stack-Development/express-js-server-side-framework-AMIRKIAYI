const express = require('express');
const { v4: uuidv4 } = require('uuid');
const validateProduct = require('../middleware/validateProduct');
const router = express.Router();

// Sample in-memory database
let products = [
  { id: '1', name: 'Laptop', description: '16GB RAM', price: 1200, category: 'electronics', inStock: true },
  { id: '2', name: 'Phone', description: '128GB storage', price: 800, category: 'electronics', inStock: true },
  { id: '3', name: 'Coffee Maker', description: 'Automatic brewing', price: 50, category: 'kitchen', inStock: false }
];

// GET all products (with filtering + pagination + search)
router.get('/', (req, res) => {
  let results = [...products];
  const { category, page = 1, limit = 10, search } = req.query;

  if (category) results = results.filter(p => p.category === category);
  if (search) results = results.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const start = (page - 1) * limit;
  const paginated = results.slice(start, start + parseInt(limit));

  res.json({
    total: results.length,
    page: parseInt(page),
    limit: parseInt(limit),
    products: paginated
  });
});

// GET product by ID
router.get('/:id', (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return next({ status: 404, message: 'Product not found' });
  res.json(product);
});

// POST new product
router.post('/', validateProduct, (req, res) => {
  const newProduct = { id: uuidv4(), ...req.body };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT update product
router.put('/:id', validateProduct, (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return next({ status: 404, message: 'Product not found' });

  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// DELETE product
router.delete('/:id', (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return next({ status: 404, message: 'Product not found' });

  const deleted = products.splice(index, 1);
  res.json({ message: 'Product deleted', product: deleted[0] });
});

// GET product statistics
router.get('/stats/count-by-category', (req, res) => {
  const stats = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  res.json(stats);
});

module.exports = router;
