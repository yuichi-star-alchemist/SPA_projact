const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const publicPath = path.join(`${__dirname.slice(0, -6)}client/public/`);// dirname末尾のserverは削除

app.use(express.static(publicPath));

app.get('/', (req, res) => {
  res.sendFile(`${publicPath}index.html`);
});

app.get('/nonogram', (req, res) => {
  res.sendFile(`${publicPath}nonogram.html`);
});


app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});