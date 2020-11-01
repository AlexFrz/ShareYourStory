const { db } = require("../utility/admin");

exports.getAllStories = (req, res) => {
  db.collection("stories")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let stories = [];
      data.forEach((doc) => {
        stories.push({
          storyId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(stories);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.postOneStory = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Body must not be empty" });
  }

  const newStory = {
    body: req.body.body,
    userHandle: req.user.handle,
    createdAt: new Date().toISOString(),
  };

  db.collection("stories")
    .add(newStory)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};

// Fetch one story
exports.getStory = (req, res) => {
  let storyData = {};
  db.doc(`/stories/${req.params.storyId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Story not found" });
      }
      storyData = doc.data();
      storyData.storyId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("storyId", "==", req.params.storyId)
        .get();
    })
    .then((data) => {
      storyData.comments = [];
      data.forEach((doc) => {
        storyData.comments.push(doc.data());
      });
      return res.json(storyData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Comment on a story
exports.commentOnStory = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ error: "Comment must not be empty" });
};
