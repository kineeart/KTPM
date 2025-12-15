const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load env from Back-end/config.env
dotenv.config({ path: path.resolve(__dirname, "..", "config.env") });

const User = require(path.resolve(__dirname, "..", "models", "userModel"));
const Product = require(path.resolve(
  __dirname,
  "..",
  "models",
  "productModel"
));
const Category = require(path.resolve(
  __dirname,
  "..",
  "models",
  "categoryModel"
));
const Brand = require(path.resolve(__dirname, "..", "models", "brandModel"));
const Review = require(path.resolve(__dirname, "..", "models", "reviewModel"));
const Order = require(path.resolve(__dirname, "..", "models", "orderModel"));
const ImportModel = require(path.resolve(
  __dirname,
  "..",
  "models",
  "importModel"
));
const Transaction = require(path.resolve(
  __dirname,
  "..",
  "models",
  "transactionModel"
));
const Location = require(path.resolve(
  __dirname,
  "..",
  "models",
  "locationModel"
));
const Comment = require(path.resolve(
  __dirname,
  "..",
  "models",
  "commentModel"
));

const DATA_DIR = path.resolve(__dirname, "..", "..", "Data1");

const fileMap = {
  users: "hcshop.users.json",
  products: "hcshop.products.json",
  categories: "hcshop.categories.json",
  brands: "hcshop.brands.json",
  reviews: "hcshop.reviews.json",
  orders: "hcshop.orders.json",
  imports: "hcshop.imports.json",
  transactions: "hcshop.transactions.json",
  locations: "hcshop.locations.json",
  comments: "hcshop.comments.json",
};

const modelMap = {
  users: User,
  products: Product,
  categories: Category,
  brands: Brand,
  reviews: Review,
  orders: Order,
  imports: ImportModel,
  transactions: Transaction,
  locations: Location,
  comments: Comment,
};

const readJson = (filename) => {
  const full = path.join(DATA_DIR, filename);
  if (!fs.existsSync(full)) return [];
  const raw = fs.readFileSync(full, "utf-8");
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Invalid JSON: ${filename}`);
    throw e;
  }
};

const connect = async () => {
  const DB = process.env.DATABASE || process.env.DB_LINK;
  if (!DB) {
    console.error("No DATABASE/DB_LINK provided in config.env");
    process.exit(1);
  }
  await mongoose.connect(DB);
};

const importAll = async () => {
  const keys = Object.keys(fileMap);
  for (const key of keys) {
    const data = readJson(fileMap[key]);
    if (!data || data.length === 0) {
      console.log(`Skip ${key}: no data file or empty`);
      continue;
    }
    const Model = modelMap[key];
    await Model.insertMany(data, { ordered: false }).catch((e) => {
      console.warn(
        `Insert warnings for ${key}:`,
        e?.writeErrors?.length || e.message
      );
    });
    console.log(`Imported ${key}: ${data.length} docs`);
  }
};

const clearAll = async () => {
  const keys = Object.keys(modelMap);
  for (const key of keys) {
    const Model = modelMap[key];
    const res = await Model.deleteMany({});
    console.log(`Cleared ${key}: ${res.deletedCount} docs`);
  }
};

const main = async () => {
  const action = process.argv[2];
  if (!action || !["import", "clear", "reset"].includes(action)) {
    console.log("Usage: node scripts/seed.js [import|clear|reset]");
    process.exit(0);
  }

  await connect();

  try {
    if (action === "import") {
      await importAll();
    } else if (action === "clear") {
      await clearAll();
    } else if (action === "reset") {
      await clearAll();
      await importAll();
    }
    console.log("Done.");
  } catch (e) {
    console.error("Seed error:", e);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

main();
