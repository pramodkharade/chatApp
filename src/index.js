const express =  require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;
publicDirectoryPath = path.join(__dirname,'../public');

app.listen(port,()=>{
    console.log("Server is running on ", port);
});