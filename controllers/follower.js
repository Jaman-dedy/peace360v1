import User from '../models/User';
import Followers from '../models/Followers';

class FollowerController {
  async followUser(req, res) {

    try {
      const followingUser = await User.findById(req.params.userId);
      const followings = await Followers.find({});
      const followers = new Followers({
        following: req.params.userId,
        follower: req.user.id
      });
      let redundant = [];
      const isFollowing =
        followings && followings.map(user => {
          if (user.follower.toString() === req.user.id.toString() && user.following.toString() === req.params.userId) {
            redundant.push(user)
          }
        });
      if (redundant.length) {
        if (redundant[0].follower.toString() === req.user.id) {
          try {
            await Followers.findOneAndDelete({
              follower: req.user.id,
              following: req.params.userId
            });
          } catch (error) {
            throw error
          }
          return res.status(200).json({
            status: 200,
            msg: `You've successfully unfollow ${followingUser.username}`,
            user: followingUser,
            state: 'unfollow'
          })
        }
      }

      await followers.save();

      return res.status(201).json({
        status: 201,
        msg: `Thanks for following ${followingUser.username}`,
        user: followingUser,
        state: 'follow',
      });

    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: error.message,
      });
    }
  }
  async getFollowers(req, res) {
    try {
      const followers = await Followers.find().populate('following', ['avatar', 'username']).populate('follower', ['avatar', 'username']);

      const myFollowers = followers.filter(myFollower => {
        return myFollower.following._id.toString() === req.user.id
      })
      if (!myFollowers.length) {
        return res.status(404).json({
          status: 404,
          msg: 'Oops, you do not have any follower currently'
        })
      }
      return res.status(200).json({
        status: 200,
        myFollowers,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error.message,
      });
    }
  }
  async getFollowings(req, res) {
    try {
      const followings = await Followers.find().populate('following', ['avatar', 'username']).populate('follower', ['avatar', 'username']);

      const myFollowings = followings.filter(myFollowing => {
        return myFollowing.follower._id.toString() === req.user.id
      })
      if (!myFollowings.length) {
        return res.status(404).json({
          status: 404,
          msg: 'Oops, you do not currently followed'
        })
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