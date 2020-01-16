const axios = require("axios");
const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");
module.exports = {
  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const responseApi = await axios.get(
        `https://api.github.com/users/${github_username}`
      );
      const techsUser = parseStringAsArray(techs);

      const { name = login, avatar_url, bio } = responseApi.data;

      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };
      const user = await Dev.create({
        name,
        avatar_url,
        bio,
        github_username,
        techs: techsUser,
        location
      });
    }

    return res.json(dev);
  },

  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  }
};
