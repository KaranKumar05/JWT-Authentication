import express from 'express';
import path from 'path';






const __dirname = path.resolve(); 
const app = express();


const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`App is Running On Port: ${PORT}`);
})