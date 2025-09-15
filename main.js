const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');


const API_PORT = 3000;

function creatApi (){
  const api = express() ;
  const folderPath = "D:/DACN/CNPM" ;

  api.use(cors());

  api.get('/files',(req,res) => { 
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.log("error1") ;
        return res.status(500).json({ error: 'Không đọc được thư mục' });
      }
    

    const fileList = files.map(name => {
      const filePath = path.join(folderPath, name);
      const stats = fs.statSync(filePath);
      return {
        name ,
        created: stats.birthtime.toLocaleString(),
        type: path.extname(name).replace('.', '') || 'folder' ,// loại file
        size: (stats.size / 1024).toFixed(1) + ' KB'
      };
    });

    res.json(fileList);
    }
  );
})

api.get('/files/download/:name', (req, res) => {
  const filePathDow = path.join(folderPath, req.params.name);
  res.download(filePathDow);
});

  api.listen(API_PORT, () => {
    console.log(` API server chạy tại http://localhost:${API_PORT}`);
  });
}

app.whenReady().then(() => {
creatApi();

// const win = new BrowserWindow({
//   width: 1000,
//   height: 700,
//   webPreferences: {
//     nodeIntegration: false,
//     contextIsolation: true,
//     webSecurity: false
//   }
// });

win.loadURL('http://localhost:4200'); // Angular chạy ng serve
});