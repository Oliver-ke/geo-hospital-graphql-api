const admin = require('firebase-admin');
const { config } = require('dotenv');
config()

let pKey = process.env.GOOGLE_CONFIG_BASE64;

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(Buffer.from(pKey, 'base64').toString("ascii"))
  )
});


const firestore = admin.firestore();

const addUserHistory = async (userId, payload) => {
  let docRef = firestore.collection(userId).doc();
  await docRef.set(payload, { merge: true });
}

const getUserHistory = async (userId) => {
  const snapshots = await firestore.collection(userId).get();

  const transformedCollection = snapshots.docs.map(doc => {
    const { query, results } = doc.data();
    return {
      id: doc.id,
      query,
      results,
    };
  })

  return transformedCollection;
}

module.exports = {
  firestore,
  addUserHistory,
  getUserHistory
}
