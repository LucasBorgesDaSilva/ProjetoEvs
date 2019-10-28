const app = require('express')()
const consign = require('consign')
const db = require('./config/db')

app.db = db

consign()
    .include('./config/passport.js')
    .then('./config/middleware.js')
    .then('./api/validator.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

var port = process.env.PORT || 4000;
app.listen(port, () =>{
    console.log('Backend executando...', port);
})