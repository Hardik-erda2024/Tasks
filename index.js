const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const routes = require('./route');
const app = express();
app.set('view engine', 'ejs');
app.use('/JS', express.static('public/JS'));
app.use('/CSS', express.static('public/CSS'));
app.use('/ref', express.static('public/ref'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/',routes);

app.listen(process.env.PORT, () => {
    console.log(`SERVER - http://localhost:${process.env.PORT}/`);
});
