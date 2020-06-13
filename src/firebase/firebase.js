const admin = require('firebase-admin');


let pKey = process.env.GOOGLE_CONFIG_BASE64
// pKey.replace(/\\n/g, '\n')

// admin.initializeApp({
//   credential: admin.credential.cert({
//     "private_key": pKey,
//     "client_email": process.env.FIREBASE_CLIENT_EMAIL,
//     "project_id": "geohospital1",
//   }),
//   databaseURL: "https://geohospital1.firebaseio.com"
// });

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
