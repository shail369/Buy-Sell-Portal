import { User } from "../models/users.model.js";
import { Item } from "../models/items.model.js";
import { Cart } from "../models/cart.model.js";
import { Protected } from "../config/authenticate.js";

export const AddtoCart = async (req, res) => {
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
    const user = verify.user;
    const cart = {};
    cart.buyerid = user._id;
    const item = await Item.findById(product.id);
    if (!item) {
      return res.status(400).send({
        success: false,
        message: "No such item exist",
      });
    }
    cart.itemid = item._id;
    cart.sellerid = item.seller;
    const duplicate = await Cart.findOne({
      itemid: item._id,
      buyerid: user._id,
    });
    if (duplicate) {
      return res.status(400).send({
        success: false,
        message: "Item already in cart",
      });
    }
    const addtocart = new Cart(cart);
    await addtocart.save();
    return res.status(200).send({
      success: true,
      message: "Item added to cart successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error" + error.message,
    });
  }
};

export const RemovefromCart = async (req, res) => {
  const verify = await Protected(req);
  if (verify.success === false) {
    return res.status(verify.status).json({
      success: false,
      message: verify.message,
    });
  }
  const product = req.body;
  if (!product || !product.id) {
    return res.status(400).send({
      success: false,
      message: "Please provide item id",
    });
  }
  try {
    const item = await Cart.findOneAndDelete({ itemid: product.id });
    if (!item) {
      return res.status(400).send({
        success: false,
        message: "No such item exist",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Item removed from cart successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error" + error.message,
    });
  }
};

export const GetCart = async (req, res) => {
  const verify = await Protected(req);
  if (verify.success === false) {
    return res.status(verify.status).json({
      success: false,
      message: verify.message,
    });
  }
  try {
    const user = verify.user;
    const items = await Cart.find({ buyerid: user._id });
    if (!items) {
      return res.status(400).send({
        success: false,
        message: "No items found in cart",
      });
    }
    let cartitems = [];
    for (let i = 0; i < items.length; i++) {
      const item = await Item.findById(items[i].itemid);
      const seller = await User.findById(items[i].sellerid);
      cartitems.push({
        id: item._id,
        image: item.image,
        itemname: item.name,
        price: item.price,
        sellername: seller.firstname,
        category: item.category,
      });
    }
    return res.status(200).send({
      success: true,
      message: "Items found in cart",
      items: cartitems,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error" + error.message,
    });
  }
};

export const ClearCart = async (req, res) => {
  const verify = await Protected(req);
  if (verify.success === false) {
    return res.status(verify.status).json({
      success: false,
      message: verify.message,
    });
  }
  try {
    const user = verify.user;
    await Cart.deleteMany({ buyerid: user._id });
    return res.status(200).send({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error" + error.message,
    });
  }
};
