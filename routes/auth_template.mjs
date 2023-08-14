import express from 'express';
let router = express.Router();
import jwt from 'jsonwebtoken' // To Generate JW token 
// We Generate Token because It help us to Recognize the Older user and his document in database
import { stringToHash, varifyHash } from 'bcrypt-inzi' //Library to convert string to hash
// we convert password in to hash to prevent anyone to get that password 
import { client } from '../mongoDb.mjs'
const userCollection = client.db('JWTAuth').collection("Users");



// url : api/v1/login 
router.post('/login', async (req, res, next) => {
    if ( // Checking parameters if any is missing 
        !req.body?.email
        || !req.body?.password
    ) {
        res.status(403).send(
            `Required Parameters Missing
                Please Fill All the Fields
                email : "abc@gmail.com"
                Password: "Password"`
        );
        return;
    }

    req.body.email = req.body.email.toLowerCase();  // converting email ot lower case and then store in data base to get it back easily 



    try {
        let result = await userCollection.findOne({ email: req.body.email }); // Checking the email already exist or not 
        console.log(result);

        if (!result) {  // Email does Exists // New User
            res.status(403).send({
                message: "Email & Password Incorrect"
            });
            return;
        } else { // Email Exists

            // varifyHash always return Boolean
            const isMatch = await varifyHash(req.body.password, result.password) // matching password with hash Password 
            // once converted into hash can't return but comparable with original one
            if (isMatch) { // verifing the password inserted by user is match to the password on database 
                const expireTimeInMiliSec = (new Date().getTime() + (24 * 60 * 60 * 1000)); // converting 24 hours in mili seconds
                // Generating Token 
                const token = jwt.sign({  // when user return(after sign up) this object print as it is
                    isAdmin: false,
                    email: req.body.email,
                    CreatedOn: new Date().getTime(), //Still easy to access so avoid sending personal information like password or anything private
                    expires: expireTimeInMiliSec // Token Expires time
                }, process.env.SECRET_KEY, {
                    expiresIn: '1h' //jwt expires time
                });  // jwt.sign Takes to parameter Object and server secret
                // server secret is critical parameter to prevent it we avoid to write directly  
                // token always sent in cookie to prevent leaking
                // 3 parameters name value and option(object)
                res.cookie('token', token, {
                    httpOnly: true, //Must add this to prevent variability 
                    secure: true,
                    expires: new Date(expireTimeInMiliSec) // setting the expire of token
                })
                res.send({
                    message: "Login Successfully",
                });
            } else {
                res.status(403).send({
                    message: "Email & Password Incorrect"
                });
                return;
            }
        }
    } catch (err) {
        console.log(`Error:${err}`);
        res.status(500).send('Server Error Please try Again Later');
    }



});




// url : api/v1/signup 
router.post('/signup', async (req, res, next) => {
    if ( // Checking parameters if any is missing 
        // /? = nalish Operator If not found any parameter Replace it with undefine   
        !req.body?.firstName
        || !req.body?.lastName
        || !req.body?.email
        || !req.body?.password
    ) {
        res.status(403).send(
            `Required Parameters Missing
                Please Fill All the Fields
                
                firstName : "abc",
                lastName : "xyz",
                email : "abc@gmail.com",
                Password: "Password"`
        );
        return;
    }

    req.body.email = req.body.email.toLowerCase();  // converting email ot lower case and then store in data base to get it back easily 

    try {
        let result = await userCollection.findOne({ email: req.body.email }); // Checking the email already exist or not 
        console.log(result);
        if (!result) {  // Email does Exists // New User


            const passwordHash = await stringToHash(req.body.password) //Concerting password to Hash now even Developer is unable to get the password
            // default 12 Rounds 

            const insertResponse = await userCollection.insertOne({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: passwordHash,
                CreatedOn: new Date
            });
            console.log(`Insert Response: ${insertResponse}`);
            res.send({
                message: "Signup Successfully"
            })

        } else { // Email Exists
            res.status(403).send({
                message: "The Email is Already Registered"
            });
        }

    } catch (err) {
        console.log(`Error:${err}`);
        res.status(500).send('Server Error Please try Again Later');
    }



});

export default router;