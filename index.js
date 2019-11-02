var express = require('express');
var bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;
const path = require('path');

var app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));


app.use(require('./routes/routes.js'))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

function base64Image(src) {
    var data = fs.readFileSync(src).toString('base64');
    return util.format('data:%s;base64,%s', mime.lookup(src), data);
  }

app.listen(PORT,()=>{
    console.log('Teoguide REST  FULL ON ' + PORT);
})