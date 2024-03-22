const express = require('express');
const app = express();
const port = process.env.PORT || 5432;
require('./db/conn');
// const path = require('path');

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render("index");
})

app.listen(port, () => {
    console.log('server listening on port');
})