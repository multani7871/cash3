require('envkey');
const express = require('express');

const app = express();

app.use(require('./server/routes'));

const port = process.env.PORT || 5000;
const announce = () => console.log(`Cashendar listening on ${port}!`);
app.listen(port, announce);
