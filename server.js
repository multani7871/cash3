require('envkey');
const express = require('express');

const app = express();

app.use(require('./server/routes'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Example app listening on ${port}!`));
