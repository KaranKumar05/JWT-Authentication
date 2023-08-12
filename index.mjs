import express from 'express';
import path from 'path';
import authRouter from './routes/auth.mjs'



const __dirname = path.resolve(); 
const app = express();
app.use(express.json()); // body parser


app.use('/api/v1',authRouter);


const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
    console.log(`App is Running On Port: ${PORT}`);
})