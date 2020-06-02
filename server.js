const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
// our routes
const productRouter = require('./routes/api/product');
const categoryRouter = require('./routes/api/category');

const app = express();

// for body-parser middleware
app.use(express.json());

//make our upload an accesable folder
app.use('/uploads', express.static('uploads'));

const dbURI = 'mongodb+srv://hamo246:0452504270@cluster0-7ckqn.azure.mongodb.net/local_library?retryWrites=true';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })

//test database connection
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Database connected succefully...')
});

// Set up our main routes
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);

// serve static assets if in production
if (process.env.NODE_ENV == 'production') {
    // set static folder
    app.use(express.static(path.join(__dirname, './views/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'views', 'index.html'));
    });
}

// App's connection port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is connected on port ${PORT}`);
})
