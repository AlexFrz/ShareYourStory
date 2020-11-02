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
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  };

  db.collection("stories")
    .add(newStory)
    .then((doc) => {
      const resStory = newStory;
      resStory.storyId = doc.id;
      res.json(resStory);
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

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    storyId: req.params.storyId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
  };

  db.doc(`/stories/${req.params.storyId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Story not found" });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};

// Like a story
exports.likeStory = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("storyId", "==", req.params.storyId)
    .limit(1);

  const storyDocument = db.doc(`/stories/${req.params.storyId}`);

  let storyData;

  storyDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        storyData = doc.data();
        storyData.storyId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Story not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            storyId: req.params.storyId,
            userHandle: req.user.handle,
          })
          .then(() => {
            storyData.likeCount++;
            return storyDocument.update({ likeCount: storyData.likeCount });
          })
          .then(() => {
            return res.json(storyData);
          });
      } else {
        return res.status(400).json({ error: "Story already liked" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.unlikeStory = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("storyId", "==", req.params.storyId)
    .limit(1);

  const storyDocument = db.doc(`/stories/${req.params.storyId}`);

  let storyData;

  storyDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        storyData = doc.data();
        storyData.storyId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Story not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: "Story not liked" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            storyData.likeCount--;
            return storyDocument.update({ likeCount: storyData.likeCount });
          })
          .then(() => {
            res.json(storyData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Delete story
exports.deleteStory = (req, res) => {
  const document = db.doc(`/stories/${req.params.storyId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Story not found" });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Story deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
