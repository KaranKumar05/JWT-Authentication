import express from 'express';
import path from 'path';
import authRouter from './routes/auth.mjs'
import 'dotenv/config' //Environment variable (process.env)
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken' // To verify JW token 



const __dirname = path.resolve();
const app = express();
app.use(express.json()); // body parser
app.use(cookieParser()) // cookie parser    


app.use('/api/v1', authRouter);
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    console.log("req.cookie: ", req.cookies);

    const token = req.cookies.token;
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log(decoded);
        req.body.decoded = {
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            email: decoded.email,
            isAdmin: decoded.isAdmin
        }
        next();
    } catch (error) {
        res.status(401).send({
            message: 'Invalid Token'
        });
    }
})

// dummy Api
app.post('/api/v1/test', (req, res, next) => { //secure api only access after token validation
    res.send('Testing Api is Working');
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`App is Running On Port: ${PORT}`);

})