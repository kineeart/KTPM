const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "..", "config.env") });

const Product = require(path.resolve(__dirname, "..", "models", "productModel"));
const Brand = require(path.resolve(__dirname, "..", "models", "brandModel"));
const Category = require(path.resolve(__dirname, "..", "models", "categoryModel"));

const DATA_FILE = path.resolve(__dirname, "data", "laptops.real.json");

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf-8"));

async function connect() {
  const DB = process.env.DATABASE || process.env.DB_LINK;
  if (!DB) throw new Error("Missing DATABASE/DB_LINK in config.env");
  await mongoose.connect(DB);
}

async function ensureBrand(name) {
  if (!name) return null;
  let b = await Brand.findOne({ name });
  if (!b) b = await Brand.create({ name });
  return b._id;
}

async function ensureCategory(name) {
  if (!name) return null;
  let c = await Category.findOne({ name });
  if (!c) c = await Category.create({ name });
  return c._id;
}

function normalize(doc) {
  const out = { ...doc };
  if (out.promotion && out.promotion > out.price) {
    out.promotion = undefined;
  }
  if (!Array.isArray(out.images)) out.images = [];
  return out;
}

async function importReal() {
  const items = readJson(DATA_FILE);
  let inserted = 0;
  for (const item of items) {
    const norm = normalize(item);
    const brandId = await ensureBrand(norm.brand || "Generic");
    const categoryId = await ensureCategory(norm.category || "Laptop");
    try {
      await Product.create({
        title: norm.title,
        price: norm.price,
        promotion: norm.promotion,
        description: norm.description,
        ratingsAverage: 4.5,
        ratingsQuantity: 0,
        eachRating: [1, 2, 3, 4, 5],
        images: norm.images,
        inventory: norm.inventory ?? 10,
        color: norm.color || "Black",
        cpu: norm.cpu,
        ram: norm.ram,
        os: norm.os,
        weight: norm.weight,
        screen: norm.screen,
        graphicCard: norm.graphicCard || "Integrated",
        battery: norm.battery || "",
        demand: norm.demand || "Office",
        brand: brandId,
        category: categoryId,
      });
      inserted++;
    } catch (e) {
      // likely duplicate unique title → skip
      // console.warn("Skip:", norm.title, e.message);
    }
  }
  console.log(`Seeded products3 (real data): ${inserted}/${items.length}`);
}

async function main() {
  try {
    await connect();
    await importReal();
  } catch (e) {
    console.error("seedProducts3 error:", e.message || e);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

main();


