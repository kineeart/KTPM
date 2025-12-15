const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "..", "config.env") });

const Product = require(path.resolve(__dirname, "..", "models", "productModel"));
const Brand = require(path.resolve(__dirname, "..", "models", "brandModel"));
const Category = require(path.resolve(__dirname, "..", "models", "categoryModel"));

const PLACEHOLDER_IMAGES = [
  // Royalty-free placeholder images
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517059224940-d4af9eec41e5?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80&auto=format&fit=crop",
];

const adjectives = ["Premium", "Compact", "Eco", "Max", "Steel", "Aero", "Neon", "Carbon", "Nimbus", "Zen"];
const nouns = ["Laptop", "Monitor", "Keyboard", "Headphone", "Mouse", "Tablet", "Router", "SSD", "HDD", "Webcam"];
const colors = ["Black", "White", "Silver", "Blue", "Red", "Gray", "Green"];
const cpus = ["Intel i3", "Intel i5", "Intel i7", "Ryzen 3", "Ryzen 5", "Ryzen 7"];
const rams = ["4GB", "8GB", "16GB", "32GB"];
const oses = ["Windows 11", "Windows 10", "macOS", "Ubuntu 22.04"];
const screens = ["13\" FHD", "14\" FHD", "15.6\" FHD", "24\" FHD", "27\" QHD"];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function sampleImages() {
  // 2-4 images per product
  const count = 2 + Math.floor(Math.random() * 3);
  const imgs = new Set();
  while (imgs.size < count) imgs.add(pick(PLACEHOLDER_IMAGES));
  return Array.from(imgs);
}

function uniqueTitle(i) {
  const adj = pick(adjectives);
  const noun = pick(nouns);
  return `${adj} ${noun} Series ${Date.now()}-${i}`; // ensure unique and >= 10 chars
}

async function connect() {
  const DB = process.env.DATABASE || process.env.DB_LINK;
  if (!DB) throw new Error("Missing DATABASE/DB_LINK in config.env");
  await mongoose.connect(DB);
}

async function loadRefs() {
  const brands = await Brand.find({}).select("_id");
  const categories = await Category.find({}).select("_id");
  if (brands.length === 0 || categories.length === 0) {
    throw new Error("Need at least one brand and one category in DB before seeding products.");
  }
  return { brands, categories };
}

async function createProducts(count) {
  const { brands, categories } = await loadRefs();
  const docs = [];
  for (let i = 0; i < count; i++) {
    const price = Math.floor(20 + Math.random() * 980) * 100000; // 2M - 100M
    const hasPromo = Math.random() < 0.7;
    const promo = hasPromo ? price - Math.floor(Math.random() * (price * 0.5)) : undefined;
    const doc = {
      title: uniqueTitle(i),
      price,
      promotion: promo,
      description: `Auto-generated product 2 with rich description ${i}. Great value and performance.`,
      ratingsAverage: +(3 + Math.random() * 2).toFixed(1),
      ratingsQuantity: Math.floor(Math.random() * 300),
      eachRating: [1, 2, 3, 4, 5],
      images: sampleImages(),
      inventory: Math.floor(10 + Math.random() * 150),
      color: pick(colors),
      cpu: pick(cpus),
      ram: pick(rams),
      os: pick(oses),
      weight: +(0.6 + Math.random() * 4).toFixed(2),
      screen: pick(screens),
      graphicCard: Math.random() < 0.5 ? "Integrated" : "RTX 4060",
      battery: Math.random() < 0.5 ? "50Wh" : "80Wh",
      demand: Math.random() < 0.5 ? "Office" : "Gaming",
      brand: pick(brands)._id,
      category: pick(categories)._id,
    };
    docs.push(doc);
  }
  const result = await Product.insertMany(docs, { ordered: false }).catch((e) => {
    const inserted = e.result?.result?.nInserted || 0;
    console.warn("Some inserts failed (likely unique title clash). Inserted:", inserted);
    return { length: inserted };
  });
  const insertedCount = Array.isArray(result) ? result.length : (result.length || 0);
  console.log(`Seeded products2: ${insertedCount}/${docs.length}`);
}

async function main() {
  const count = Number(process.argv[2]) || 40;
  try {
    await connect();
    await createProducts(count);
  } catch (e) {
    console.error("Seed products2 error:", e.message || e);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

main();


