const express = require('express');
const app = express();

app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/users', userRoutes);
app.use('/products', productRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
