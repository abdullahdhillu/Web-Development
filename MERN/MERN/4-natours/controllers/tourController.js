// const fs = require('fs');
const tourModel = require(`./../model/tourModel`);
// const APIfeatures = require(`./../utilities/apiFeatures`);
// console.log(APIfeatures);
exports.aliasTopTour = (req, res, next) => {
  req.query.sort = "price,-ratingsAverage";
  req.query.limit = "5";
  req.query.fields = "name,price,duration,difficulty,ratingsAverage";
  next();
};
class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A: Basic Filtering
    console.log("From Filtering Function");
    let queryObj = { ...this.queryString };
    const excludedFields = ["sort", "limit", "page", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B: Advanced Filtering (gte, gt, lte, lt)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt"); // Default sort by newest first
    }
    return this;
  }

  select() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v"); // Default exclude '__v'
    }
    return this;
  }

  async pagination() {
    const limit = parseInt(this.queryString.limit, 10) || 10; // Default limit = 10
    const page = parseInt(this.queryString.page, 10) || 1; // Default page = 1
    const skip = (page - 1) * limit; // Calculate skip

    // Check if the requested page exists
    const numTours = await this.query.model.countDocuments(); // Use the model to count documents
    if (skip >= numTours && page > 1) {
      throw new Error("This page does not exist");
    }

    // Apply pagination
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
exports.getAllTours = async (req, res) => {
  try {
    // Apply filtering, sorting, field limiting, and pagination
    const features = new APIfeatures(tourModel.find(), req.query)
      .filter()
      .sort()
      .select();
    await features.pagination();
    // Execute the query
    const result = await features.query;

    res.status(200).json({
      message: "success",
      results: result.length,
      data: { result },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.getTour = async (req, res) => {
  try {
    // console.log(req.params.id);
    const tour = await tourModel.find({ _id: req.params.id }); // same as findById(req.params.id)
    res.status(200).json({ message: "success", data: { tour } });
  } catch (err) {
    res.status(200).json({ status: "fail", message: err.message });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const tour = await tourModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(200).json({
      status: err.message,
      message: "fail",
    });
  }
  // const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);
  // if (!tour) {
  //   return res.status(400).json({ message: 'fail', data: { tour: null } });
  // }
  // const tourIndex = tours.findIndex((el) => el.id === id);
  // const updated = { ...tour, ...req.body }; // main implementation
  // tours[tourIndex] = updated; //updating our tours-simple.json file with the updated data
  // console.log(__dirname);
  // fs.writeFile(
  //   // writing the updated data to the file
  //   `${__dirname}/../dev-data/data/tours-simple.json`, // Path to your tours file
  //   JSON.stringify(tours, null, 2), // Convert to JSON string
  //   (err) => {
  //     if (err) {
  //       console.error('Error writing to file', err);
  //       return res.status(500).json({
  //         status: 'fail',
  //         message: 'Could not update file',
  //       });
  //     }
  //     // Send the updated tour as response
  //     res.status(200).json({
  //       status: 'success',
  //       data: {
  //         updated,
  //       },
  //     });
  //   }
  // );
};
exports.replaceTour = async (req, res) => {
  try {
    const tour = await tourModel.findOneAndReplace(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(200).json({
      status: err.message,
      message: "fail",
    });
  }
};
exports.createTour = async (req, res) => {
  try {
    const newTour = await tourModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
  // const newId = tours[tours.length - 1].id + 1; // get the last id and add 1
  // const newTour = Object.assign({ id: newId }, req.body);
  // tours.push(newTour); //add newTour to tours array
  // fs.writeFile(
  //   `${__dirname}/../dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours), // replace the previous tours array with modified one
  //   (err) => {
  //     if (err) {
  //       return res.status(500).json({
  //         status: 'fail',
  //         message: err.message,
  //       });
  //     }
  //
  //   }
  // );
};
exports.deleteTour = async (req, res) => {
  try {
    const tour = await tourModel.findOneAndDelete({ _id: req.params.id });
    if (!tour) {
      return res.status(404).json({ message: "No such tour found" });
    }
    return res
      .status(200)
      .json({ message: "success", data: { response: "Deleted" } });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
exports.getTourStats = async (req, res) => {
  try {
    const stats = await tourModel.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: "$difficulty",
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          avgPrice: { $avg: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      {
        $match: { _id: { $ne: "easy" } },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: {
        stats: stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await tourModel.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
          // name: "The City Wanderer",
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTours: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: {
          _id: 0,
          // isExpensive: {
          //   $cond: { if: { $gt: ["$price", 2500] }, then: true, else: false },
          // },
          tours: 1,
          numTours: 1,
        },
      },
      {
        $sort: { numTours: -1 },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
