import { validationResult } from 'express-validator';
import Profile from '../models/Profile';

class ProfileController {
  async currentUserProfile(req, res) {
    try {
      const profile = await Profile.findOne({
        user: req.user.id,
      }).populate('user', ['name', 'avatar']);
      if (!profile) {
        return res
          .status(400)
          .json({ msg: 'There is no profile for this user' });
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
      }).populate('user', ['name', 'avatar']);
      if (!profile) {
        return res
          .status(400)
          .json({ msg: 'There is no profile for this user' });
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
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }
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
              message: 'This user already has a profile',
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
    const {
      company,
      website,
      location,
      bio,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (skills) {
      profileFields.skills =
        skills || skills.split(',').map((skill) => skill.trim());
    }
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return res.status(200).json({
          data: {
            status: 200,
            errors: {
              message: 'This user does not have a profile',
            },
          },
        });
      }

      profile = await Profile.findOneAndUpdate(
        {
          user: req.user.id,
        },
        { $set: profileFields },
        { new: true }
      );
      return res.status(200).json({ status: 200, profile });
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
}
export default ProfileController;
