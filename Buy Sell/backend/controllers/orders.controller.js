import { User } from "../models/users.model.js";
import { Item } from "../models/items.model.js";
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/orders.model.js";
import { Protected } from "../config/authenticate.js";
import bcrypt from "bcrypt";

export const PlaceOrder = async (req, res) => {
  const verify = await Protected(req);
  if (verify.success === false) {
    return res.status(verify.status).json({
      success: false,
      message: verify.message,
    });
  }

  try {
    const cartItems = await Cart.find({ buyerid: verify.user._id });

    if (!cartItems.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    for (const cartItem of cartItems) {
      const item = await Item.findOne({ _id: cartItem.itemid });
      const order = new Order({
        buyerid: verify.user._id,
        itemid: cartItem.itemid,
        total: item.price,
        otp: hashedOtp,
        status: "Pending",
      });

      await order.save();
    }

    await Cart.deleteMany({ buyerid: verify.user._id });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully " + "Your otp is: " + otp,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

export const GetLeftOrders = async (req, res) => {
  const verify = await Protected(req);
  if (!verify.success) {
    return res.status(verify.status).json({
      success: false,
      message: verify.message,
    });
  }

  try {
    const orders = await Order.find({
      buyerid: verify.user._id,
      status: "Pending",
    });

    const detailedOrders = await Promise.all(
      orders.map(async (order) => {
        const item = await Item.findById(order.itemid);
        if (!item) return null;

        const seller = await User.findById(item.seller);
        return {
          ...order._doc,
          sellername: seller ? seller.firstname : "Unknown",
        };
      })
    );

    return res.status(200).json({
      success: true,
      orders: detailedOrders.filter((order) => order !== null),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

export const GetDeliveredOrders = async (req, res) => {
  const verify = await Protected(req);
  if (!verify.success) {
    return res.status(verify.status).json({
      success: false,
      message: verify.message,
    });
  }

  try {
    const orders = await Order.find({
      buyerid: verify.user._id,
      status: "Delivered",
    });

    const detailedOrders = await Promise.all(
      orders.map(async (order) => {
        const item = await Item.findById(order.itemid);
        if (!item) return null;

        const seller = await User.findById(item.seller);
        return {
          ...order._doc,
          sellername: seller ? seller.firstname : "Unknown",
        };
      })
    );

    return res.status(200).json({
      success: true,
      orders: detailedOrders.filter((order) => order !== null),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

export const GetYourDeliveredOrders = async (req, res) => {
  const verify = await Protected(req);
  if (!verify.success) {
    return res.status(verify.status).json({
      success: false,
      message: verify.message,
    });
  }

  try {
    const items = await Item.find({ seller: verify.user._id });
    const itemids = items.map((item) => item._id);
    const orders = await Order.find({
      itemid: { $in: itemids },
      status: "Delivered",
    });

    const detailedOrders = await Promise.all(
      orders.map(async (order) => {
        const buyer = await User.findById(order.buyerid);
        return {
          ...order._doc,
          buyername: buyer ? buyer.firstname : "Unknown",
        };
      })
    );

    return res.status(200).json({
      success: true,
      orders: detailedOrders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

export const GetYourPendingOrders = async (req, res) => {
  const verify = await Protected(req);
  if (!verify.success) {
    return res.status(verify.status).json({
      success: false,
      message: verify.message,
    });
  }

  try {
    const items = await Item.find({ seller: verify.user._id });
    const itemids = items.map((item) => item._id);
    const orders = await Order.find({
      itemid: { $in: itemids },
      status: "Pending",
    });

    const detailedOrders = await Promise.all(
      orders.map(async (order) => {
        const buyer = await User.findById(order.buyerid);
        return {
          ...order._doc,
          buyername: buyer ? buyer.firstname : "Unknown",
        };
      })
    );

    return res.status(200).json({
      success: true,
      orders: detailedOrders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

export const VerifyOrder = async (req, res) => {
  const verify = await Protected(req);
  if (verify.success == false) {
    return res.status(verify.status).json({
      success: false,
      message: verify.message,
    });
  }

  try {
    const { orderId, otp } = req.body;
    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const isMatch = await bcrypt.compare(otp, order.otp);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    order.status = "Delivered";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

export const ChangeOTP = async (req, res) => {
  const verify = await Protected(req);
  if (verify.success === false) {
    return res.status(verify.status).json({
      success: false,
      message: verify.message,
    });
  }

  try {
    const newotp = Math.floor(100000 + Math.random() * 900000).toString();
    const orderid = req.body.orderId;
    const order = await Order.findOne({ _id: orderid });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const hashedOtp = await bcrypt.hash(newotp, 10);
    order.otp = hashedOtp;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "OTP changed successfully",
      otp: newotp,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};
