//Creating a Server for Book Store;

import express from "express";
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let books = [
    { id: 1, title: 'Book 1', author: 'Author 1', genre: 'Genre 1', price: 100 },
    { id: 2, title: 'Book 2', author: 'Author 2', genre: 'Genre 2', price: 200 },
    { id: 3, title: 'Book 3', author: 'Author 3', genre: 'Genre 3', price: 300 },
  ];
  
  // Routes
  app.get('/books', (req, res) => {
    res.json(books);
  });
  
  app.get("/books/:id", (req, res) => {
    const  {id}  = req.params;
    const book = books.find(book => book.id == id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    };
  });

  app.post('/books', (req, res) => {
    const newBook = req.body;
    newBook.id = books.length + 1;
    books.push(newBook);
    res.status(201).json(newBook);
  });
  
  app.put('/books/:id', (req, res) => {
    const { id } = req.params;
    const updatedBook = req.body;
    const index = books.findIndex(book => book.id == id);
  
    if (index !== -1) {
      books[index] = { ...books[index], ...updatedBook };
      res.json(books[index]);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  });
  
  app.delete('/books/:id', (req, res) => {
    const { id } = req.params;
    const index = books.findIndex(book => book.id == id);
  
    if (index !== -1) {
      const deletedBook = books.splice(index, 1);
      res.json({ message: 'Book deleted successfully', deletedBook });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  });
  

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});