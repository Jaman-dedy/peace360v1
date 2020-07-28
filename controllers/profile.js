import { validationResult } from "express-validator";
import cloudinary from "cloudinary";
import Profile from "../models/Profile";
import User from "../models/User";
import { use } from "passport";

class ProfileController {
  async currentUserProfile(req, res) {
    try {
      const profile = await Profile.findOne({
        user: req.user.id,
      }).populate("user", ["name", "avatar"]);
      if (!profile) {
        return res
          .status(400)
          .json({ msg: "There is no profile for this user" });
      }
      return res.status(200).json({ status: 200, profile });
    } catch (error) {
      return res.status(500).json({ status: 500, msg: error.message });
    }
  }
  async givenUserProfile(req, res) {
    try {
      const profile = await Profile.findOne({
        user: req.params.userId,
      }).populate("user", ["name", "avatar"]);
      if (!profile) {
        return res
          .status(400)
          .json({ msg: "There is no profile for this user" });
      }
      return res.status(200).json({ status: 200, profile });
    } catch (error) {
      return res.status(500).json({ status: 500, msg: error.message });
    }
  }

  async createProfile(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      occupation,
      address,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (address) profileFields.address = address;
    if (occupation) profileFields.occupation = occupation;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        return res.status(404).json({
          data: {
            errors: {
              status: 404,
              message: "This user already has a profile",
            },
          },
        });
      }
      // create
      profile = new Profile(profileFields);
      await profile.save();
      return res.status(201).json({ status: 201, profile });
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
  async updateProfile(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let filename = "";
    if (req.files.avatar) {
      filename = req.files.avatar.path;
    }
    cloudinary.v2.uploader.upload(
      filename,
      { tags: "peacemaker" },
      async (err, image) => {
        const {
          username,
          company,
          website,
          location,
          bio,
          occupation,
          address,
          youtube,
          facebook,
          twitter,
          instagram,
          linkedin,
        } = req.body;

        const userId = req.params.userId;

        const user = await User.findOne({ _id: userId });
        const oldURL = user.avatar;

        let imgURL;
        if (!err) {
          imgURL = image.secure_url;
        }
        if (!imgURL) {
          imgURL = oldURL;
        }

        const profileFields = {};

        profileFields.user = req.user.id;
        if (username) profileFields.username = username;
        if (occupation) profileFields.occupation = occupation;
        if (address) profileFields.address = address;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;

        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;
        try {
          let profile = await User.findOne({ _id: req.user.id });
          if (!profile) {
            return res.status(200).json({
              data: {
                status: 200,
                errors: {
                  message: "This user does not have a profile",
                },
              },
            });
          }

          profile = await User.findOneAndUpdate(
            {
              _id: req.user.id,
            },
            { $set: profileFields, avatar: imgURL },
            { new: true },
            console.log(profileFields)
          );
          return res.status(200).json({ status: 200, profile });
        } catch (error) {
          return res.status(500).json({ status: 500, error: error.message });
        }
      }
    );
  }
}
export default ProfileController;
