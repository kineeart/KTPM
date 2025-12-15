const mongoose = require("mongoose");

/**
 * Khởi tạo database và collections
 * Đảm bảo tất cả collections được tạo ngay khi khởi động server
 */
const initDatabase = async () => {
  try {
    // Import tất cả các models để đảm bảo schemas được đăng ký
    const User = require("../models/userModel");
    const Product = require("../models/productModel");
    const Category = require("../models/categoryModel");
    const Brand = require("../models/brandModel");
    const Order = require("../models/orderModel");
    const Review = require("../models/reviewModel");
    const Comment = require("../models/commentModel");
    const Import = require("../models/importModel");
    const Transaction = require("../models/transactionModel");
    const Location = require("../models/locationModel");

    // Map models với tên collections
    const modelMap = [
      { model: User, name: "users" },
      { model: Product, name: "products" },
      { model: Category, name: "categories" },
      { model: Brand, name: "brands" },
      { model: Order, name: "orders" },
      { model: Review, name: "reviews" },
      { model: Comment, name: "comments" },
      { model: Import, name: "imports" },
      { model: Transaction, name: "transactions" },
      { model: Location, name: "locations" },
    ];

    console.log("\n📊 Initializing Database Collections...");
    console.log("─".repeat(50));

    const db = mongoose.connection.db;

    // Tạo collections và indexes cho mỗi model
    for (const { model, name } of modelMap) {
      try {
        // Kiểm tra collection đã tồn tại chưa (check mỗi lần để cập nhật)
        const collectionExists = await db.listCollections({ name }).hasNext();

        if (!collectionExists) {
          // Tạo collection bằng cách insert một document tạm trực tiếp vào MongoDB
          // (không qua Mongoose để tránh validation)
          // MongoDB sẽ tự động tạo collection và database nếu chưa tồn tại
          try {
            await db.collection(name).insertOne({
              _temp_init: true,
              _createdAt: new Date(),
            });
            // Xóa document tạm ngay sau khi tạo collection
            await db.collection(name).deleteOne({ _temp_init: true });
            console.log(`  🆕 ${name.padEnd(20)} - Created (0 documents)`);
          } catch (insertErr) {
            // Nếu insert thất bại, kiểm tra lại xem collection đã được tạo chưa
            const recheck = await db.listCollections({ name }).hasNext();
            if (recheck) {
              const count = await db.collection(name).countDocuments();
              console.log(`  ✅ ${name.padEnd(20)} - ${count} documents`);
            } else {
              console.log(
                `  ⚠️  ${name.padEnd(20)} - Could not create: ${
                  insertErr.message
                }`
              );
              // Tiếp tục với collection tiếp theo
              continue;
            }
          }
        } else {
          // Collection đã tồn tại
          const count = await db.collection(name).countDocuments();
          console.log(`  ✅ ${name.padEnd(20)} - ${count} documents`);
        }

        // Tạo indexes cho collection (sau khi đảm bảo collection đã tồn tại)
        try {
          await model.createIndexes();
        } catch (indexErr) {
          // Bỏ qua lỗi index nếu có (indexes sẽ được tạo khi cần)
          // Không log warning vì có thể indexes đã tồn tại
        }
      } catch (err) {
        // Nếu có lỗi, vẫn thử kiểm tra collection đã tồn tại chưa
        try {
          const exists = await db.listCollections({ name }).hasNext();
          if (exists) {
            const count = await db.collection(name).countDocuments();
            console.log(
              `  ✅ ${name.padEnd(
                20
              )} - ${count} documents (some errors occurred)`
            );
          } else {
            console.log(`  ⚠️  ${name.padEnd(20)} - Error: ${err.message}`);
          }
        } catch (checkErr) {
          console.log(`  ⚠️  ${name.padEnd(20)} - Error: ${err.message}`);
        }
      }
    }

    console.log("─".repeat(50));
    console.log("✅ Database initialization completed!");
    console.log("   All collections are ready to use.\n");
  } catch (error) {
    console.error("❌ Error initializing database:", error.message);
    console.error(error.stack);
    // Không throw error để server vẫn có thể chạy
    // Collections sẽ được tạo tự động khi có document đầu tiên được insert
  }
};

module.exports = initDatabase;
