const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
// dirname末尾のserverは削除
// sendFileでは..の使用は制限されているので上から行く
const publicPath = path.join(`${__dirname.slice(0, -6)}client/public/`);

// 静的ファイルへのアクセスが可能な領域を指定する必要がある
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