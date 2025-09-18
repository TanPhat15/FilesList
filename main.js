const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');


const API_PORT = 3000;

  const api = express() ;
  const folderPath = "D:/New folder" ;

  api.use(cors());

  function getChild(folderPathChild , folderPath) {
    const files = fs.readdirSync(folderPathChild);
  
    const fileList = files.map(name => {
      const filePath = path.join(folderPathChild, name);
      const stats = fs.statSync(filePath);
  
      const isFolder = stats.isDirectory();
      const type = isFolder ? "folder" : (path.extname(name).replace('.', '') || 'file');
      const relativePath = path.relative(folderPath, filePath).replace(/\\/g, '/');

      return {
        label: name,
        icon: isFolder ? 'pi pi-fw pi-folder' : 'pi pi-fw pi-file',  
        data: {
          name,
          created: stats.birthtime.toLocaleString(),
          type,
          size: isFolder ? null : (stats.size / 1024).toFixed(1) + ' KB',
          fullPath: relativePath
        },
        children: isFolder ? getChild(filePath, folderPath) : []  ,
        leaf: !isFolder,
    };
    });
  
    return fileList;
  }

  api.get('/files',(req,res) => { 
    fs.readdir(folderPath, async (err, files) => {
      if (err) {
        console.log("error1") ;
        return res.status(500).json({ error: 'Không đọc được thư mục' });
      }
    
      const result = await getChild(folderPath , folderPath);
      res.json(result);
    }
  );
})

api.get('/files/download/*', (req, res) => {
  const relativePath = decodeURIComponent(req.params[0]); // lấy full path tương đối
  const filePathDow = path.join(folderPath, relativePath);
  res.download(filePathDow);
});

  api.listen(API_PORT, () => {
    console.log(` API server chạy tại http://localhost:${API_PORT}`);
  });