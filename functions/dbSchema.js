let db = {
  users: [
    {
      userId: "djkhjqsifahau9268348",
      email: "user@email.com",
      handle: "user",
      createdAt: "2019-03-15T10:59:53.798Z",
      imageUrl: "image/dskfskhsgsdf/kqfhkj",
      bio: "Hello, my name is user, nice to meet you",
      website: "https://user.com",
      location: "London, UK",
    },
  ],
  stories: [
    {
      title: "That is the title of the story"
      userHandle: "user",
      body: "This is a story",
      createdAt: "2020-10-30T11:25:47.624Z",
      likeCount: 5,
      commentCount: 2,
    },
  ],
  comments: [
    {
      userHandle: 'user',
      storyId; '892ET8GYDYAIHK',
      body: 'Nice to meet u!',
      createdAt: '2019...'
    }
  ],
  notifications: [
    {
      recipient: 'user',
      sender: 'john',
      read: 'true | false',
      storyId: '892ET8GYDYAIHK',
      type: 'like | comment',
      createdAt: '2020-10-30T11:25:47.624Z'
    }
  ]
};

const userDetails = {
  // Redux data
  credentials: {
    userId: "djkhjqsifahau9268348",
    email: "user@email.com",
    handle: "user",
    createdAt: "2019-03-15T10:59:53.798Z",
    imageUrl: "image/dskfskhsgsdf/kqfhkj",
    bio: "Hello, my name is user, nice to meet you",
    website: "https://user.com",
    location: "London, UK",
  },
  likes: [{
    userHandle: 'user',
    storyId: "hhshqdh"
  }, {
    userHandle: 'user',
    storyId: '82sqgjb3865'
  }]
};
