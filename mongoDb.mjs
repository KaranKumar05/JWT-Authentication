// Importing MongoDb 
import { MongoClient } from 'mongodb';
const uri = "mongodb+srv://Karan_Kumar:Umerkot1233@cluster0.ybu3vqr.mongodb.net/?retryWrites=true&w=majority";
// Exporting 
export const client = new MongoClient(uri);
async function run() {
    try {
        await client.connect();
        console.log("Atlas Connect Successfully");
    } catch (err) {
        console.log(err.stack);
        await client.close();
        process.exit(1); 
    }
}
run().catch(console.dir);

process.on('SIGINT', async function () {
    console.log("App is terminating");
    await client.close();
    process.exit(0);
});
