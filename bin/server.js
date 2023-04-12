const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

const port = 3000;
const htmlPath = path.join(__dirname, '../dist/index.html');
const htmlData = fs.readFileSync(htmlPath, { encoding: 'utf8' });
fs.writeFileSync(htmlPath, htmlData);

// 优先拦截文件下载，防止被预览
app.get('/static/documents/*', function (req, res){
  res.download(path.join(__dirname, decodeURIComponent(`../dist/${req.path}`)));
})

// 通常用于加载静态资源
app.use(express.static(path.join(__dirname, '../dist/'), {
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    res.set('Cache-Control', 'no-cache');
  },
}));

// 处理任何一个 route
app.get('*', function (req, res){
  res.sendFile(path.resolve(__dirname, '../dist', 'index.html'))
})

app.listen(port, function() {
  console.log(`The app server is working at http://localhost:${ port }`);
});
