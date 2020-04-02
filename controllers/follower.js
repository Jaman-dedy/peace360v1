import User from '../models/User';
import Article from '../models/Article';
import Followers from '../models/Followers';

class FollowerController {
  async followUser(req, res) {
    try {
      const currentArticle = await Article.findById(req.params.article_id);

      const user = currentArticle.user;
      const userToFollow = await User.findById(user.id);

      const followers = new Followers();
      const follower = await Followers.find();

      const followedBy = {
        user: req.user.id,
        username: req.user.username,
        avatar: req.user.avatar
      };

      const followedUser = {
        user,
        username: userToFollow.username,
        avatar: userToFollow.avatar
      };
      if (user.id == req.user.id) {
        return res.status(401).json({
          status: 401,
          msg: 'unauthorized action, you can not follow yourself'
        });
      }

      const myFollowings = follower.filter(follower =>
        follower.followedBy.find(
          followedBy => followedBy.user.toString() === req.user.id
        )
      );

      if (myFollowings.length) {
        const unFollowUser = myFollowings.find(following =>
          following.followedUser.find(
            unFollow => unFollow.username === user.username
          )
        );

        if (unFollowUser) {
          await Followers.findByIdAndDelete(unFollowUser.id);
          return res.status(200).json({
            status: 200,
            msg: `You have successfully unfollow ${followedUser.username}`
          });
        }
      }

      followers.followedBy.unshift(followedBy);
      followers.followedUser.unshift(followedUser.user);

      await followers.save();

      res.status(201).json({
        status: 201,
        msg: `Thanks for following ${followedUser.username}`
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      });
    }
  }
  async getFollowers(req, res) {
    try {
      const followers = await Followers.find();

      const followersList = followers.filter(follower =>
        follower.followedUser.find(
          followedUser => followedUser._id.toString() === req.user.id
        )
      );
      if (!followersList.length) {
        return res.status(404).json({
          status: 404,
          msg: 'Oops, you do not have any follower currently'
        });
      }
      const myFollowers = followersList.map(followers => followers.followedBy);
      return res.status(200).json({
        status: 200,
        myFollowers
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error.message
      });
    }
  }
  async getFollowings(req, res) {
    try {
      const followers = await Followers.find();

      const followingsList = followers.filter(following =>
        following.followedBy.find(
          followedBy => followedBy.user.toString() === req.user.id
        )
      );
      if (!followingsList.length) {
        return res.status(404).json({
          status: 404,
          msg: 'Oops, currently you are not following any user'
        });
      }
      const myFollowings = followingsList.map(
        followings => followings.followedUser
      );
      return res.status(200).json({
        status: 200,
        myFollowings
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error.message
      });
    }
  }
}
export default FollowerController;
