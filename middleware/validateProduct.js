// Validates product data for POST and PUT requests
module.exports = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  if (!name || !description || price === undefined || !category || inStock === undefined) {
    return res.status(400).json({ error: 'Missing required product fields' });
  }

  if (typeof price !== 'number') {
    return res.status(400).json({ error: 'Price must be a number' });
  }

  if (typeof inStock !== 'boolean') {
    return res.status(400).json({ error: 'inStock must be a boolean' });
  }

  next();
};
