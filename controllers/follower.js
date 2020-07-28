import User from "../models/User";
import Followers from "../models/Followers";

class FollowerController {
  async followUser(req, res) {
    try {
      const { userId } = req.params;
      const FollowerId = req.user.id;

      const checkUser = await User.findById(userId);

      if (checkUser.id === FollowerId) {
        return res.status(403).json({
          error: "You cannot follow yourself",
        });
      }
      let redundant = [];
      const followings = await Followers.find({});

      followings &&
        followings.map((user) => {
          if (
            user.follower.toString() === req.user.id.toString() &&
            user.following.toString() === req.params.userId
          ) {
            redundant.push(user);
          }
        });
      if (redundant.length) {
        return res.status(403).json({
          error: `you are already following ${checkUser.username}`,
        });
      }

      const newFollowing = {
        follower: FollowerId,
        following: checkUser.id,
      };
      const newSavedFollow = await Followers.create(newFollowing);

      return res.status(200).json({
        status: 200,
        message: `you are now following ${checkUser.username}`,
        data: newSavedFollow,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async unFollowUser(req, res) {
    const { userId } = req.params;
    const FollowerId = req.user.id;
    const checkUser = await User.findById(userId);

    let redundant = [];
    const followings = await Followers.find({});

    followings &&
      followings.map((user) => {
        if (
          user.follower.toString() === req.user.id.toString() &&
          user.following.toString() === req.params.userId
        ) {
          redundant.push(user);
        }
      });
    if (redundant.length) {
      if (redundant[0].follower.toString() === req.user.id) {
        try {
          await Followers.findOneAndDelete({
            follower: req.user.id,
            following: req.params.userId,
          });
          return res.status(200).json({
            status: 200,
            msg: `You've successfully unfollowed ${checkUser.username}`,
            state: "unfollow",
          });
        } catch (error) {
          throw error;
        }
      }
    }
    return res.status(400).json({
      message: `you are not following ${checkUser.username}`,
    });
  }

  async getFollowers(req, res) {
    try {
      const followers = await Followers.find()
        .populate("following", ["avatar", "username"])
        .populate("follower", ["avatar", "username"]);

      const myFollowers = followers.filter((myFollower) => {
        return myFollower.following._id.toString() === req.user.id;
      });
      if (!myFollowers.length) {
        return res.status(404).json({
          status: 404,
          msg: "Oops, you do not have any follower currently",
        });
      }
      return res.status(200).json({
        status: 200,
        myFollowers,
      });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({
        status: 500,
        error: error.message,
      });
    }
  }
  async getFollowings(req, res) {
    try {
      const followings = await Followers.find()
        .populate("following", ["avatar", "username"])
        .populate("follower", ["avatar", "username"]);

      const myFollowings = followings.filter((myFollowing) => {
        return myFollowing.follower._id.toString() === req.user.id;
      });
      if (!myFollowings.length) {
        return res.status(404).json({
          status: 404,
          msg: "Oops, you do not currently followed",
        });
      }
      return res.status(200).json({
        status: 200,
        myFollowings,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error.message,
      });
    }
  }
}
export default FollowerController;
