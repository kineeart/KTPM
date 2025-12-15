const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "..", "config.env") });

const Product = require(path.resolve(
  __dirname,
  "..",
  "models",
  "productModel"
));
const Brand = require(path.resolve(__dirname, "..", "models", "brandModel"));
const Category = require(path.resolve(
  __dirname,
  "..",
  "models",
  "categoryModel"
));

const adjectives = [
  "Powerful",
  "Ultra",
  "Pro",
  "Smart",
  "Elite",
  "Dynamic",
  "Advanced",
  "NextGen",
  "Prime",
  "Turbo",
];
const nouns = [
  "Laptop",
  "Desktop",
  "Monitor",
  "Keyboard",
  "Headset",
  "Mouse",
  "Tablet",
  "Router",
  "SSD",
  "GPU",
];
const colors = ["Black", "White", "Silver", "Blue", "Red", "Gray"];
const cpus = ["Intel i5", "Intel i7", "Intel i9", "Ryzen 5", "Ryzen 7"];
const rams = ["8GB", "16GB", "32GB", "64GB"];
const oses = ["Windows 11", "Windows 10", "macOS", "Ubuntu 22.04"];
const screens = ['13" FHD', '14" FHD', '15.6" FHD', '27" QHD', '32" 4K'];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function uniqueTitle(i) {
  const adj = pick(adjectives);
  const noun = pick(nouns);
  // ensure >= 10 chars; include index to avoid unique clashes
  return `${adj} ${noun} Model ${Date.now()}-${i}`;
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
    throw new Error(
      "Need at least one brand and one category in DB before seeding products."
    );
  }
  return { brands, categories };
}

async function createProducts(count) {
  const { brands, categories } = await loadRefs();
  const docs = [];
  for (let i = 0; i < count; i++) {
    const price = Math.floor(50 + Math.random() * 950) * 100000; // 5M - 100M
    const hasPromo = Math.random() < 0.6;
    const promo = hasPromo
      ? price - Math.floor(Math.random() * (price * 0.4))
      : undefined;
    const doc = {
      title: uniqueTitle(i),
      price,
      promotion: promo,
      description: `Auto-generated product description for demo ${i}. Suitable for work, study and entertainment.`,
      ratingsAverage: +(3 + Math.random() * 2).toFixed(1),
      ratingsQuantity: Math.floor(Math.random() * 200),
      eachRating: [1, 2, 3, 4, 5],
      images: [],
      inventory: Math.floor(5 + Math.random() * 100),
      color: pick(colors),
      cpu: pick(cpus),
      ram: pick(rams),
      os: pick(oses),
      weight: +(0.8 + Math.random() * 3.5).toFixed(2),
      screen: pick(screens),
      graphicCard: Math.random() < 0.5 ? "Integrated" : "RTX 3060",
      battery: Math.random() < 0.5 ? "56Wh" : "70Wh",
      demand: Math.random() < 0.5 ? "Office" : "Gaming",
      brand: pick(brands)._id,
      category: pick(categories)._id,
    };
    docs.push(doc);
  }
  // insertMany additive; ignore duplicates by continuing on error
  const result = await Product.insertMany(docs, { ordered: false }).catch(
    (e) => {
      const inserted = e.result?.result?.nInserted || 0;
      console.warn(
        "Some inserts failed (likely unique title clash). Inserted:",
        inserted
      );
      return { length: inserted };
    }
  );
  const insertedCount = Array.isArray(result)
    ? result.length
    : result.length || 0;
  console.log(`Seeded products: ${insertedCount}/${docs.length}`);
}

async function main() {
  const count = Number(process.argv[2]) || 20;
  try {
    await connect();
    await createProducts(count);
  } catch (e) {
    console.error("Seed products error:", e.message || e);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

main();
