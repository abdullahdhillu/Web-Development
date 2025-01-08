const mongoose = require("mongoose");
const slugify = require("slugify");
const bcrypt = require("bcrypt");
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true, // Removes extra spaces
      maxlength: [40, "A tour name must have less or equal to 40 characters"],
      minlength: [10, "A tour name must have more or equal to 10 characters"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty must be either: easy, medium, or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10, // Rounds to 1 decimal place
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // `this` only points to the current doc on NEW document creation
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true, // Removes whitespace
      required: [true, "A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // Hides this field in queries
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    password: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE: Runs before .save() and .create() methods
tourSchema.pre("findOneAndDelete", async function (next) {
  const queryConditions = this.getQuery();
  const docToDelete = await this.model.findById(queryConditions._id);
  console.log(docToDelete);
  if (docToDelete) {
    console.log(`Document named "${docToDelete.name}" is being deleted`);
  } else {
    console.log("No document found to delete");
  }
  console.log(`Document named "${this.name}" was deleted from the database`);
  next();
});
tourSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log(`A new document named "${this.name}" was added to the database`);
  next();
});

// tourSchema.pre("save", function (next) {
//   console.log("Will Save Document...");
//   next();
// });
// tourSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY Middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

//Aggregation Middleware
tourSchema.pre("aggregate", function (next) {
  this.pipeline().match({ secretTour: { $ne: true } });
  next();
});

// Create a Model from the schema
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
