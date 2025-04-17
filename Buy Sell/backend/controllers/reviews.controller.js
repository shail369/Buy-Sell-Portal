import { User } from "../models/users.model.js";
import { Item } from "../models/items.model.js";
import { Reviews } from "../models/reviews.model.js";
import { Protected } from "../config/authenticate.js";

export const AddReview = async (req, res) => {
  const verify = await Protected(req);
  if (verify.success === false) {
    return res.status(verify.status).json({
      success: false,
      message: verify.message,
    });
  }
  const review = req.body;
  const product = req.params;
  if (!review || !review.comment) {
    return res.status(400).send({
      success: false,
      message: "Please provide item id, rating and comment",
    });
  }
  try {
    const user = verify.user;
    const item = await Item.findById(review.itemid);
    if (!item) {
      return res.status(400).send({
        success: false,
        message: "No such item exist",
      });
    }
    const newReview = {
      itemid: review.itemid,
      rating: review.rating,
      comment: review.comment,
      reviewerid: user._id,
    };
    const Review = new Reviews(newReview);
    await Review.save();
    return res.status(200).send({
      success: true,
      message: "Review added successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error" + error.message,
    });
  }
};

export const ItemReviews = async (req, res) => {
  const verify = await Protected(req);
  if (verify.success === false) {
    return res.status(verify.status).json({
      success: false,
      message: verify.message,
    });
  }

  const item = req.params;
  if (!item || !item.id) {
    return res.status(400).send({
      success: false,
      message: "Please provide item id",
    });
  }
  try {
    const data = [];
    const reviews = await Reviews.find({ itemid: item.id });
    for (let i = 0; i < reviews.length; i++) {
      const user = await User.findById(reviews[i].reviewerid);
      data[i] = {
        __id: reviews[i]._id,
        rating: reviews[i].rating,
        comment: reviews[i].comment,
        reviewer: user.firstname,
      };
    }
    if (!reviews) {
      return res.status(400).send({
        success: false,
        message: "No reviews found",
      });
    }
    return res.status(200).send({
      success: true,
      reviews: data,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error" + error.message,
    });
  }
};

export const UserReviews = async (req, res) => {
  const verify = await Protected(req);
  if (verify.success === false) {
    return res.status(verify.status).json({
      success: false,
      message: verify.message,
    });
  }
  try {
    const user = verify.user;
    const items = await Item.find({ seller: user._id });
    const itemIds = items.map((item) => item._id);
    const data = [];
    const reviews = await Reviews.find({ itemid: { $in: itemIds } });
    for (let i = 0; i < reviews.length; i++) {
      const item = await Item.findById(reviews[i].itemid);
      const reviewer = await User.findById(reviews[i].reviewerid);
      data[i] = {
        _id: reviews[i]._id,
        item: item.name,
        rating: reviews[i].rating,
        comment: reviews[i].comment,
        reviewer: reviewer.firstname,
      };
    }
    return res.status(200).send({
      success: true,
      reviews: data,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error" + error.message,
    });
  }
};
