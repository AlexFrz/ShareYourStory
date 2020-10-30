import { db } from "../utility/admin";

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
