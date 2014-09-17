var express = require('express');
var morgan = require('morgan');

var app = express();

app.use(morgan('combined'));

app.get('/', function(req, res) {
    res.send('test root');
});

app.listen(process.env.PORT);

console.log('Express server started on port %s', process.env.PORT);
