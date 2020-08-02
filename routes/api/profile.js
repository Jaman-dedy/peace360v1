import express from "express";
import connectmultiparty from "connect-multiparty";
import Profile from "../../controllers/profile";
import auth from "../../middlewares/auth";
import { validateProfile } from "../../middlewares/validateProfile";

const connectMulti = connectmultiparty();

const profile = new Profile();

const router = express.Router();

router.get("/me", auth, profile.givenUserProfile);
router.get("/:userId", auth, profile.givenUserProfile);

// router.post('/create', [auth, validateProfile], profile.createProfile);
router.put("/edit/:userId", [auth, connectMulti], profile.updateProfile);
export default router;
