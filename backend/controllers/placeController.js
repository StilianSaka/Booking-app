import asyncHandler from "../middleware/asyncHandler.js";
import Place from "../models/placeModel.js";

// @desc    Fetch all places
// @route   GET /api/places
// @access  Public
const getPlaces = asyncHandler(async (req, res) => {
  const pageSize = 4;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Place.countDocuments({ ...keyword });
  const places = await Place.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ places, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single place
// @route   GET /api/places/:id
// @access  Public
const getPlaceById = asyncHandler(async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (place) {
    return res.json(place);
  }
  res.status(404);
  throw new Error("Resource not found");
});

// @desc    Create a place
// @route   POST /api/places
// @access  Private/Admin
const createPlace = asyncHandler(async (req, res) => {
  const place = new Place({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });

  const createdPlace = await place.save();
  res.status(201).json(createdPlace);
});

// @desc    Update a place
// @route   PUT /api/places/:id
// @access  Private/Admin
const updatePlace = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const place = await Place.findById(req.params.id);

  if (place) {
    place.name = name;
    place.price = price;
    place.description = description;
    place.image = image;
    place.brand = brand;
    place.category = category;
    place.countInStock = countInStock;

    const updatedPlace = await place.save();
    res.json(updatedPlace);
  } else {
    res.status(404);
    throw new Error("Place not found");
  }
});

// @desc    Delete a place
// @route   DELETE /api/places/:id
// @access  Private/Admin
const deletePlace = asyncHandler(async (req, res) => {
  const place = await Place.findById(req.params.id);

  if (place) {
    await Place.deleteOne({ _id: place._id });
    res.json({ message: "Place removed" });
  } else {
    res.status(404);
    throw new Error("Place not found");
  }
});

// @desc    Create new review
// @route   POST /api/places/:id/reviews
// @access  Private
const createPlaceReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const place = await Place.findById(req.params.id);

  if (place) {
    const alreadyReviewed = place.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Place already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    place.reviews.push(review);

    place.numReviews = place.reviews.length;

    place.rating =
      place.reviews.reduce((acc, item) => item.rating + acc, 0) /
      place.reviews.length;

    await place.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Place not found");
  }
});

// @desc    Get top rated places
// @route   GET /api/places/top
// @access  Public
const getTopPlaces = asyncHandler(async (req, res) => {
  const places = await Place.find({}).sort({ rating: -1 }).limit(3);

  res.json(places);
});

export {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  createPlaceReview,
  getTopPlaces,
};
