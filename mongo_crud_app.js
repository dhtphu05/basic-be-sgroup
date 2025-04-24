import express from 'express';
import mongoose from 'mongoose';
import authRoute from './src/apis/auth/auth.router.js';

// MongoDB connection
mongoose.connect('mongodb://user:password@127.0.0.1:27019/S-Mongo?authSource=admin', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

const movieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  rating: Number
});

// Create a model from the schema
const Movie = mongoose.model('Movie', movieSchema);

const app = express();
app.use(express.json());
app.use('/apis', authRoute);

// Create a new movie
app.post('/movies', async (req, res) => {
  const { title, genre, rating } = req.body;
  try {
    const movie = new Movie({ title, genre, rating });
    const result = await movie.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all movies
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a movie - chỉ giữ một phương thức update
app.put('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const { title, genre, rating } = req.body;

  try {
    const movie = await Movie.findByIdAndUpdate(
      id, 
      { title, genre, rating }, 
      { new: true }
    );
    
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.status(200).json(movie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a movie
app.delete('/movies/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const movie = await Movie.findByIdAndDelete(id);
    
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});