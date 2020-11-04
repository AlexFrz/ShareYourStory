const {
  getAllStories,
  postOneStory,
  getStory,
  commentOnStory,
  likeStory,
  unlikeStory,
  deleteStory,
} = require("./handlers/stories");
const functions = require("firebase-functions");
const app = require("express")();
const FBAuth = require("./utility/fbAuth");

const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
} = require("./handlers/users");

const { db } = require("./utility/admin");

// Stories routes
app.get("/stories", getAllStories);
app.post("/story", FBAuth, postOneStory);
app.get("/story/:storyId", getStory);
app.post("/story/:storyId/comment", FBAuth, commentOnStory);
app.get("/story/:storyId/like", FBAuth, likeStory);
app.get("/story/:storyId/unlike", FBAuth, unlikeStory);
app.delete("/story/:storyId", FBAuth, deleteStory);
// Users routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);

exports.api = functions.region("europe-west1").https.onRequest(app);

exports.createNotificationOnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/stories/${snapshot.data().storyId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            storyId: doc.id,
          });
        }
      })
      .catch((err) => console.error(err));
  });
exports.deleteNotificationOnUnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });
exports.createNotificationOnComment = functions
  .region("europe-west1")
  .firestore.document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/story/${snapshot.data().storyId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            storyId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });
