import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { InitializeUsers } from "./models/users.model.js";
import { InitializeItems } from "./models/items.model.js";
import { InitializeCart } from "./models/cart.model.js";
import { InitializeReviews } from "./models/reviews.model.js";
import { InitializeOrders } from "./models/orders.model.js";

import LoginRoutes from "./routes/login.routes.js";
import UserRoutes from "./routes/users.routes.js";
import ItemRoutes from "./routes/items.routes.js";
import CartRoutes from "./routes/cart.routes.js";
import ReviewRoutes from "./routes/reviews.routes.js";
import OrderRoutes from "./routes/orders.routes.js";
import ChatBotRoutes from "./routes/chatbot.routes.js"

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/login", LoginRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/item", ItemRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/review", ReviewRoutes);
app.use("/api/order", OrderRoutes);
app.use("/api/chatbot", ChatBotRoutes)

const PORT = 5000;
app.listen(PORT, () => {
  InitializeUsers();
  InitializeItems();
  InitializeCart();
  InitializeReviews();
  InitializeOrders();
  console.log(`Server running on port ${PORT}`);
});
