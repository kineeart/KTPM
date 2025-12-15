# Tech E-commerce - Hệ thống bán laptop online

Hệ thống thương mại điện tử chuyên bán laptop được xây dựng bằng MERN Stack (MongoDB, Express, React, Node.js).

## 📋 Mục lục

- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Seed dữ liệu](#seed-dữ-liệu)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Scripts](#scripts)

## ✨ Tính năng

### Người dùng

- Đăng ký/Đăng nhập (JWT Authentication)
- Đăng nhập bằng Google OAuth
- Xem danh sách sản phẩm với filter và sort
- Tìm kiếm sản phẩm
- Xem chi tiết sản phẩm
- So sánh sản phẩm (tối đa 2 sản phẩm)
- Đánh giá và bình luận sản phẩm
- Thêm vào giỏ hàng
- Đặt hàng và thanh toán
- Xem lịch sử đơn hàng
- Quản lý thông tin cá nhân

### Admin

- Quản lý sản phẩm (CRUD)
- Quản lý danh mục và thương hiệu
- Quản lý đơn hàng
- Quản lý nhập kho
- Quản lý người dùng
- Thống kê và báo cáo
- Upload ảnh lên Cloudinary

## 🛠 Công nghệ sử dụng

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Passport.js** - OAuth authentication
- **Cloudinary** - Image storage
- **Nodemailer** - Email service
- **Multer** - File upload
- **Express Rate Limit** - Rate limiting
- **Helmet** - Security headers
- **XSS Clean** - XSS protection

### Frontend

- **React 18** - UI library
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router** - Routing
- **TailwindCSS** - CSS framework
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Yup** - Validation
- **Swiper** - Carousel
- **PayPal SDK** - Payment integration

## 📦 Cài đặt

### Yêu cầu

- Node.js >= 10.0.0 (khuyến nghị >= 18 LTS)
- MongoDB (local hoặc Atlas)
- npm hoặc yarn

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd Demo_1
```

### Bước 2: Cài đặt dependencies

#### Backend

```bash
cd Back-end
npm install
```

#### Frontend

```bash
cd FrontEnd
npm install
```

## ⚙️ Cấu hình

### Backend Configuration

1. Tạo file `Back-end/config.env` (hoặc sao chép từ `config.env.example`):

```env
DB_LINK=mongodb://127.0.0.1:27017/quan_ly_cua_hang
PORT=5100
NODE_ENV=development
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=5d
JWT_COOKIE_EXPIRES_IN=5
COOKIE_EXPIRE=5

# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SERVICE=gmail
SMTP_MAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_PASS=your-app-password

# Cloudinary Configuration
CLOUDINARY_NAME=your-cloudinary-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret
CLOUDINARY_URL=cloudinary://your-api-key:your-api-secret@your-cloudinary-name

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Stripe (Optional)
STRIPE_API_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### Frontend Configuration

Cấu hình API base URL trong `FrontEnd/src/config/config.js` hoặc file tương ứng.

## 🚀 Chạy ứng dụng

### Cách 1: Chạy riêng lẻ

#### Backend (Development)

```bash
cd Back-end
npm run dev
```

Backend chạy tại: `http://localhost:5100`

**📌 Lưu ý quan trọng**:

- Khi chạy `npm run dev` lần đầu tiên, hệ thống sẽ **tự động tạo database và các collections** trong MongoDB
- Bạn chỉ cần đảm bảo MongoDB đang chạy và cấu hình `DB_LINK` trong `config.env` đúng
- Không cần phải tạo database hay collections thủ công, hệ thống sẽ tự động khởi tạo:
  - `users` - Người dùng
  - `products` - Sản phẩm
  - `categories` - Danh mục
  - `brands` - Thương hiệu
  - `orders` - Đơn hàng
  - `reviews` - Đánh giá
  - `comments` - Bình luận
  - `imports` - Nhập kho
  - `transactions` - Giao dịch
  - `locations` - Địa điểm

#### Frontend (Development)

```bash
cd FrontEnd
npm run dev
```

Frontend chạy tại: `http://localhost:5173`

### Cách 2: Chạy cùng lúc (Windows PowerShell)

Sử dụng script có sẵn:

#### Development

```powershell
.\run-dev.ps1
```

#### Production-like

```powershell
.\run-prod.ps1
```

Script này sẽ chạy cả backend và frontend trong cùng một terminal.

### 🗄️ Khởi tạo Database tự động

Hệ thống được cấu hình để **tự động tạo database và collections** khi khởi động lần đầu:

1. **Khi chạy `npm run dev`**:

   - Kết nối tới MongoDB (theo cấu hình trong `config.env`)
   - Tự động tạo database nếu chưa tồn tại
   - Tự động tạo tất cả các collections cần thiết
   - Đồng bộ indexes từ Mongoose schemas
   - Hiển thị trạng thái của từng collection

2. **Console output mẫu**:

   ```
   ✅ MongoDB connected successfully!

   📊 Database Collections Status:
   ──────────────────────────────────────────────────
     ✅ users                  - 0 documents
     🆕 products              - Created (0 documents)
     🆕 categories            - Created (0 documents)
     ...
     📑 Indexes synchronized
   ──────────────────────────────────────────────────
   ✅ Database initialization completed!
   ```

3. **Không cần thao tác thủ công**:
   - Không cần tạo database trước
   - Không cần tạo collections trước
   - Chỉ cần đảm bảo MongoDB service đang chạy

## 🌱 Seed dữ liệu

### Import dữ liệu từ JSON files

```bash
cd Back-end
npm run seed:import
```

### Seed sản phẩm tự động

```bash
# Seed 20 sản phẩm ngẫu nhiên (mặc định)
npm run seed:products

# Seed số lượng tùy chỉnh
npm run seed:products 50

# Seed sản phẩm với ảnh (40 sản phẩm)
npm run seed:products2

# Seed sản phẩm laptop thật (12 sản phẩm)
npm run seed:products3
```

### Xóa dữ liệu

```bash
npm run seed:clear
```

### Reset (xóa và import lại)

```bash
npm run seed:reset
```

## 📁 Cấu trúc dự án

```
Demo_1/
├── Back-end/                 # Backend API
│   ├── controllers/         # Controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── scripts/            # Seed scripts
│   │   ├── data/           # JSON data files
│   │   ├── seed.js         # Import from JSON
│   │   ├── seedProducts.js # Auto-generate products
│   │   ├── seedProducts2.js # Generate products with images
│   │   └── seedProducts3.js # Real laptop data
│   ├── utils/              # Utilities
│   │   ├── initDatabase.js # Auto database initialization
│   │   └── ...
│   ├── views/              # EJS templates (Admin panel)
│   ├── public/             # Static files
│   ├── app.js              # Express app
│   ├── server.js           # Server entry
│   └── config.env          # Environment variables
│
├── FrontEnd/               # React Frontend
│   ├── src/
│   │   ├── api/            # API services
│   │   ├── components/     # Reusable components
│   │   ├── module/         # Feature modules
│   │   ├── page/           # Page components
│   │   ├── redux/          # Redux store & slices
│   │   ├── styles/         # Styles
│   │   └── utils/          # Utilities
│   └── public/             # Public assets
│
├── Data1/                   # Sample data files (JSON)
│   ├── hcshop.products.json
│   ├── hcshop.users.json
│   └── ...
│
├── run-dev.ps1             # Run dev script (Windows)
├── run-prod.ps1             # Run prod script (Windows)
└── README.md               # This file
```

## 📜 Scripts

### Backend Scripts

```bash
npm run dev          # Development mode với nodemon
npm start            # Production mode
npm run start:prod   # Production với NODE_ENV=production
npm run debug        # Debug mode

# Seed scripts
npm run seed:import      # Import từ JSON files
npm run seed:clear       # Xóa tất cả dữ liệu
npm run seed:reset       # Reset (clear + import)
npm run seed:products    # Seed products (default: 20)
npm run seed:products2   # Seed products với ảnh (40)
npm run seed:products3   # Seed laptop thật (12)
```

### Frontend Scripts

```bash
npm run dev          # Development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run start:prod   # Preview với host và port 5173
```

## 🔐 Security Features

- JWT Authentication
- Password hashing với bcrypt
- Rate limiting
- XSS protection
- NoSQL injection protection
- CORS configuration
- Helmet security headers
- Input validation và sanitization

## 🌐 API Endpoints

### Authentication

- `POST /api/v1/users/signup` - Đăng ký
- `POST /api/v1/users/login` - Đăng nhập
- `GET /api/v1/users/logout` - Đăng xuất

### Products

- `GET /api/v1/products` - Lấy danh sách sản phẩm
- `GET /api/v1/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/v1/products` - Tạo sản phẩm (Admin)
- `PATCH /api/v1/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/v1/products/:id` - Xóa sản phẩm (Admin)

### Orders

- `GET /api/v1/orders` - Lấy danh sách đơn hàng
- `POST /api/v1/orders` - Tạo đơn hàng
- `GET /api/v1/orders/:id` - Lấy chi tiết đơn hàng
- `PATCH /api/v1/orders/:id` - Cập nhật đơn hàng

### Reviews

- `GET /api/v1/reviews` - Lấy danh sách đánh giá
- `POST /api/v1/reviews` - Tạo đánh giá

## 📝 License

ISC

## 👤 Author

nvh2312

## 🙏 Acknowledgments

- Dự án được phát triển cho môn học TLCN (Thực tập tốt nghiệp)
- Sử dụng các thư viện mã nguồn mở từ cộng đồng

---

**Lưu ý**:

- Đảm bảo MongoDB đang chạy trước khi khởi động backend
- Kiểm tra file `config.env` và điền đầy đủ thông tin cấu hình trước khi chạy ứng dụng
- Database và collections sẽ được tự động tạo khi chạy `npm run dev` lần đầu tiên
- Không cần tạo database hay collections thủ công
