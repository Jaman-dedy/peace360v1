import passport from 'passport';
import express from 'express';
import User from '../../controllers/users';
import authentication from '../../middlewares/socialAuth/authentication';

const socialAuthStrategy = new authentication();

const user = new User();
const router = express.Router();

router.get('/login/facebook', passport.authenticate('facebook'));
// router.get('/facebook/redirect', passport.authenticate('facebook', user.loginViaSocialMedia));

router.get(
  '/login/facebook/redirect',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: '/facebook'
  }),
  user.loginViaSocialMedia
);

router.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile'] })
);
router.get(
  '/login/google/redirect',
  passport.authenticate('google', { session: false }),
  user.loginViaSocialMedia
);

export default router;
