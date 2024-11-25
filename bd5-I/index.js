const express = require("express");
const { sequelize } = require("./lib/index");
const app = express();
const { track } = require("./models/track.js");
const { user } = require("./models/user.js");
const { like } = require("./models/like.js");
const { Op } = require("sequelize");

app.use(express.json());

let movieData = [
  {
    name: "Raabta",
    genre: "Romantic",
    release_year: 2012,
    artist: "Arijit Singh",
    album: "Agent Vinod",
    duration: 4,
  },
  {
    name: "Naina Da Kya Kasoor",
    genre: "Pop",
    release_year: 2018,
    artist: "Amit Trivedi",
    album: "Andhadhun",
    duration: 3,
  },
  {
    name: "Ghoomar",
    genre: "Traditional",
    release_year: 2018,
    artist: "Shreya Ghoshal",
    album: "Padmaavat",
    duration: 3,
  },
  {
    name: "Bekhayali",
    genre: "Rock",
    release_year: 2019,
    artist: "Sachet Tandon",
    album: "Kabir Singh",
    duration: 6,
  },
  {
    name: "Hawa Banke",
    genre: "Romantic",
    release_year: 2019,
    artist: "Darshan Raval",
    album: "Hawa Banke (Single)",
    duration: 3,
  },
  {
    name: "Ghungroo",
    genre: "Dance",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "War",
    duration: 5,
  },
  {
    name: "Makhna",
    genre: "Hip-Hop",
    release_year: 2019,
    artist: "Tanishk Bagchi",
    album: "Drive",
    duration: 3,
  },
  {
    name: "Tera Ban Jaunga",
    genre: "Romantic",
    release_year: 2019,
    artist: "Tulsi Kumar",
    album: "Kabir Singh",
    duration: 3,
  },
  {
    name: "First Class",
    genre: "Dance",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "Kalank",
    duration: 4,
  },
  {
    name: "Kalank Title Track",
    genre: "Romantic",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "Kalank",
    duration: 5,
  },
];

app.get("/seed_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    await user.create({
      username: "test_user",
      email: "test@example.com",
      password: "password",
    });

    await track.bulkCreate(movieData);

    return res.status(200).json({ message: "Database seeded successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in seeding database", error: error.message });
  }
});

async function getAllTracks() {
  const tracks = await track.findAll();
  return { tracks: tracks };
}

app.get("/tracks", async (req, res) => {
  try {
    const response = await getAllTracks();

    if (response.tracks.length === 0) {
      return res.status(404).json({ message: "No tracks found." });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getTrackById(id) {
  const thisTrack = await track.findOne({ where: { id } });
  return { track: thisTrack };
}

app.get("/tracks/details/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const response = await getTrackById(id);

    if (response.track === null) {
      return res
        .status(404)
        .json({ message: `No track found by the given Id ${id}` });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getTrackByArtist(artist) {
  const tracks = await track.findAll({ where: { artist } });
  return { tracks: tracks };
}

app.get("/tracks/artist/:artist", async (req, res) => {
  try {
    const { artist } = req.params;
    const response = await getTrackByArtist(artist);

    if (response.tracks.length === 0) {
      return res
        .status(404)
        .json({ message: `No track found by the artist ${artist}` });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function sortTracksByReleaseYear(order) {
  const tracks = await track.findAll({ order: [["release_year", order]] });
  return { tracks: tracks };
}

app.get("/tracks/sort/release_year", async (req, res) => {
  try {
    const order = req.query.order;
    const response = await sortTracksByReleaseYear(order);

    if (response.tracks.length === 0) {
      return res.status(404).json({ message: `No tracks found.` });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
async function addNewTrack(addedTrack) {
  const newTrack = await track.create(addedTrack);
  return newTrack;
}

app.post("/tracks/new", async (req, res) => {
  try {
    const newTrack = req.body;
    console.log(newTrack);

    const response = await addNewTrack(newTrack);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function updateTrackById(newUpdate, id) {
  const newUpdatedData = await track.findOne({ where: { id } });

  if (!newUpdatedData) {
    return {};
  }

  newUpdatedData.set(newUpdate);
  let updatedData = await newUpdatedData.save();

  return { message: "Track updated", updatedData };
}

app.post("/tracks/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const newUpdate = req.body;
    const response = await updateTrackById(newUpdate, id);

    if (!response.message) {
      return res
        .status(404)
        .json({ message: `No track found by given id ${id}` });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function deleteTrackById(id) {
  const deletedData = await track.destroy({ where: { id } });
  console.log(deletedData);
  if (deletedData === 0) {
    return {};
  }

  return { message: "Track deleted" };
}

app.post("/tracks/delete", async (req, res) => {
  try {
    const { id } = req.body;
    const response = await deleteTrackById(id);

    if (!response.message) {
      return res.status(404).json({ message: `No track found to delete` });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function addNewUser(newUser) {
  const thisUser = await user.create(newUser);
  return { user: thisUser };
}

app.post("/users/new", async (req, res) => {
  try {
    const { newUser } = req.body;
    const response = await addNewUser(newUser);
    if (response.user.length === 0) {
      return res.status(404).json({ message: `User not created yet.` });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getAllUsers() {
  const users = await user.findAll();
  return { users: users };
}

app.get("/users", async (req, res) => {
  try {
    const response = await getAllUsers();

    if (response.users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function updateUserById(newUpdate, id) {
  const updatedUserData = await user.findOne({ where: { id } });
  console.log(updatedUserData);
  if (!updatedUserData) {
    return {};
  }

  updatedUserData.set(newUpdate);
  let updatedUser = await updatedUserData.save();

  return { message: "User updated.", updatedUser };
}

app.post("/users/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const newUpdate = req.body;
    const response = await updateUserById(newUpdate, id);

    if (!response.message) {
      return res.status(400).json({ message: `No user found by id ${id}` });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function likeTrack(data) {
  let newLike = await like.create({
    userId: data.userId,
    trackId: data.trackId,
  });

  return { message: "Track Liked", newLike };
}

app.get("/users/:id/like", async (req, res) => {
  try {
    let userId = parseInt(req.params.id);
    let trackId = parseInt(req.query.trackId);
    let response = await likeTrack({ userId, trackId });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function dislikeTrack(data) {
  const count = await like.destroy({
    where: {
      userId: data.userId,
      trackId: data.trackId,
    },
  });

  if (count === 0) {
    return {};
  }

  return { message: "Track Disliked." };
}

app.get("/users/:id/dislike", async (req, res) => {
  try {
    const userId = req.params.id;
    const trackId = req.query.trackId;
    const response = await dislikeTrack({ userId, trackId });

    if (!response.message) {
      return res.status(404).json({ message: `No like found.` });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getAllLikedTracks(userId) {
  const trackIds = await like.findAll({
    where: { userId },
    attributes: ["trackId"],
  });

  let trackRecords = [];

  for (let i = 0; i < trackIds.length; i++) {
    trackRecords.push(trackIds[i].trackId);
  }

  let likedTracks = await track.findAll({
    where: { id: { [Op.in]: trackRecords } },
  });

  return { likedTracks };
}

app.get("/users/:id/liked", async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await getAllLikedTracks(userId);

    if (response.likedTracks.length === 0) {
      return res.status(404).json({ message: `No likes found` });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getAllLikedTracksByArtists(userId, artist) {
  const trackIds = await like.findAll({
    where: { userId },
    attributes: ["trackId"],
  });

  let trackRecords = [];

  for (let i = 0; i < trackIds.length; i++) {
    trackRecords.push(trackIds[i].trackId);
  }

  let likedTracks = await track.findAll({
    where: { id: { [Op.in]: trackRecords }, artist },
  });

  return { likedTracks };
}

app.get("/users/:id/liked-artist", async (req, res) => {
  try {
    const userId = req.params.id;
    const { artist } = req.query;
    const response = await getAllLikedTracksByArtists(userId, artist);

    if (response.likedTracks.length === 0) {
      return res
        .status(404)
        .json({ message: `No likes found by the artist ${artist}` });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log(`Server is running at port 3000`);
});
