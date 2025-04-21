import express from 'express';
import mongoose from 'mongoose';

// MongoDB connection
mongoose.connect('mongodb://user:password@127.0.0.1:27019/S-Mongo?authSource=admin', { useNewUrlParser: true, useUnifiedTopology: true })
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

// Create a new movie
app.post('/movies', async (req, res) => {
  const { title, genre, rating } = req.body;
  try {
    const result = await movieCollection.insertOne({ title, genre, rating });
    res.status(201).send(result.ops[0]);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Read all movies
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.send(movies);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

//get a single movie by id
app.get('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.send(movie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Update a movie
app.put('/movies/:id', async (req, res) => {
  try {
    const { title, genre, rating } = req.body;
    const movie = await Movie.findOne({ _id: req.params.id });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    if (title !== undefined) movie.title = title;
    if (genre !== undefined) movie.genre = genre;
    if (rating !== undefined) movie.rating = rating;

    const updatedMovie = await movie.save();
    res.send(updatedMovie);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Delete a movie
app.delete('/movies/:id', async (req, res) => {

  try {
    const movie = await Movie.findOne({ _id: req.params.id });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    await movie.deleteOne();
    res.send({ message: 'Movie deleted' });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Count total movies
app.get('/movies/count', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json({ count: movies.length });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Search movies by genre
app.get('/movies/search', async (req, res) => {
  try {
    const { genre } = req.query;
    if (!genre) return res.status(400).json({ message: 'Genre query parameter required' });

    const movies = await Movie.find({ genre: new RegExp(genre, 'i') });
    res.json(movies);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/movies/top-rated', async (req, res) => {
  try {
    const movies = await Movie.find();
    if (movies.length === 0) return res.status(404).json({ message: 'No movies found' });

    let maxRating = -1;
    movies.forEach(movie => {
      if (movie.rating > maxRating) maxRating = movie.rating;
    });

    const topRatedMovies = movies.filter(movie => movie.rating === maxRating);
    res.send(topRatedMovies);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
console.log("helooo")