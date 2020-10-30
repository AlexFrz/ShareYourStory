const { getAllStories, postOneStory } = require("./handlers/stories");

const functions = require("firebase-functions");
const app = require("express")();

const FBAuth = require("./utility/fbAuth");

const { signup, login } = require("./handlers/users");

// Stories routes
app.get("/stories", getAllStories);
app.post("/story", FBAuth, postOneStory);

// Users routes
app.post("/signup", signup);
app.post("/login", login);

exports.api = functions.region("europe-west1").https.onRequest(app);
