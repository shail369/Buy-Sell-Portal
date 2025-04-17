import { User } from "../models/users.model.js";
import { Item } from "../models/items.model.js";
import { Protected } from "../config/authenticate.js";

export const AddItem = async (req, res) => {
  const verify = await Protected(req);
  if (verify.success === false) {
    return res.status(verify.status).json({
      success: false,
      message: verify.message,
    });
  }
  const item = req.body;
  if (!item || !item.name || !item.price) {
    return res.status(400).send({
      success: false,
      message: "Please provide item name and price",
    });
  }
  try {
    const user = verify.user;
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "No such user exist",
      });
    }
    item.seller = user._id;
    const newItem = new Item(item);
    await newItem.save();
    return res.status(200).send({
      success: true,
      message: "Item added successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error" + error.message,
    });
  }
};

export const GetItems = async (req, res) => {
  const verify = await Protected(req);
  if (verify.success === false) {
    return res.status(verify.status).json({
      success: false,
      message: verify.message,
    });
  }
  try {
    const { tag, categories, color, min, max } = req.body;
    const filter = {};
    if (tag) {
      filter.name = { $regex: tag, $options: "i" };
    }
    if (categories) {
      const categoryArray = categories.split(",");
      filter.category = { $in: categoryArray };
    }
    if (color) {
      const colorArray = color.split(",");
      filter.color = { $in: colorArray };
    }
    if (min || max) {
      filter.price = {};
      if (min) filter.price.$gte = parseFloat(min);
      if (max) filter.price.$lte = parseFloat(max);
    }
    const user = verify.user;
    const data = [];
    filter.seller = { $not: { $regex: user._id.toString() } };
    const items = await Item.find(filter);
    for (let i = 0; i < items.length; i++) {
      const seller = await User.findById(items[i].seller);
      data[i] = {
        _id: items[i]._id,
        name: items[i].name,
        price: items[i].price,
        description: items[i].description,
        category: items[i].category,
        colour: items[i].colour,
        seller: items[i].seller,
        sellername: seller.firstname,
        image: items[i].image,
      };
    }
    return res.status(200).send({
      success: true,
      message: "Items found",
      items: data,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

export const YourItems = async (req, res) => {
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
    return res.status(200).send({
      success: true,
      message: "Items found",
      items: items,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

export const SingleItem = async (req, res) => {
  const verify = await Protected(req);
  if (verify.success === false) {
    return res.status(verify.status).json({
      success: false,
      message: verify.message,
    });
  }
  const product = req.params;
  if (!product || !product.id) {
    return res.status(400).send({
      success: false,
      message: "Please provide item id",
    });
  }
  try {
    let data = [];
    const item = await Item.findById(product.id);
    if (!item) {
      return res.status(400).send({
        success: false,
        message: "No such item exist",
      });
    }
    const seller = await User.findById(item.seller);
    data = {
      _id: item._id,
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
      colour: item.colour,
      seller: item.seller,
      sellername: seller.firstname,
      image: item.image,
    };
    return res.status(200).send({
      success: true,
      message: "Item found",
      item: data,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error" + error.message,
    });
  }
};
