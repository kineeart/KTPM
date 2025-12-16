jest.mock("../controllers/reviewController", () => ({
  getAllReviews: jest.fn((req, res) =>
    res.status(200).json({ status: "success", data: [] })
  ),

  createReview: jest.fn((req, res) =>
    res.status(201).json({ status: "created" })
  ),

  setProductUserIds: jest.fn((req, res, next) => next()),

  getReview: jest.fn(),
  updateReview: jest.fn(),
  deleteReview: jest.fn()
}));




const request = require("supertest");
const app = require("../app");

describe("ORDER API", () => {
  test("GET /api/v1/orders should respond", async () => {
    const res = await request(app).get("/api/v1/orders");
    expect([200, 404]).toContain(res.statusCode);
  });
});

