jest.mock("../controllers/reviewController", () => ({
  getAllReviews: jest.fn((req, res) =>
    res.status(200).json({ status: "success", data: [] })
  ),

  createReview: jest.fn((req, res) =>
    res.status(201).json({ status: "created" })
  ),

  setProductUserIds: jest.fn((req, res, next) => next()),

  // Stubbed for routes that use reviewController.getTableReview
  getTableReview: jest.fn(),

  getReview: jest.fn(),
  isOwner: jest.fn((req, res, next) => next()),
  updateReview: jest.fn(),
  deleteReview: jest.fn()
}));




const request = require("supertest");
const app = require("../app");

describe("ORDER API", () => {
  test("GET /api/v1/orders should respond", async () => {
    const res = await request(app).get("/api/v1/orders");
    expect([200, 401, 404]).toContain(res.statusCode);
  });
});

