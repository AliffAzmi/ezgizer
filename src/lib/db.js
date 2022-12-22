import { MongoClient } from 'mongodb'
import { MONGODB_URL } from '$env/static/private'

const client = new MongoClient(MONGODB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

await client.connect()
// client.connect(async err => {
//     const collection = await client.db("katalog").collection("categories");
//     console.log(collection)
//     client.close();
// });
export default client.db('ezgizer')
