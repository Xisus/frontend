const express = require('express');
const mongoose = require('mongoose');

// Creating an express application
const app = express();

// Parsing JSON data sent to us by the user
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://xisus00:patitodegoma@cluster0.g5gloti.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB...', err));

// Handling GET request to the home route
app.get('/', (req, res) => {
  res.send('test.');
});

// More routes and logic to interact with MongoDB can be added here

// Setting up the server to listen on a port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
  paid: Boolean
});

const Item = mongoose.model('Item', itemSchema);

app.post('/add-item', async (req, res) => {
  try {
    const item = new Item({
      name: req.body.name,
      quantity: req.body.quantity,
      price: req.body.price,
      paid: req.body.paid
    });
    await item.save();
    res.send(item);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.send(items);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/update-item/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(item);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete('/delete-item/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) res.status(404).send("No item found");
    res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
});
