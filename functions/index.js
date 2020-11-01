const {
  getAllStories,
  postOneStory,
  getStory,
  commentOnStory,
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
// Stories routes
app.get("/stories", getAllStories);
app.post("/story", FBAuth, postOneStory);
app.get("/story/:storyId", getStory);
app.post("/story/:storyId/comment", FBAuth, commentOnStory);

// Users routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);

exports.api = functions.region("europe-west1").https.onRequest(app);
