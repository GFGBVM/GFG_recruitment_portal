const mongoose = require("../configuration/mongoose_config"); // Change the path as per your folder structure

const POSTS = [
  "Event & Operations Head",
  "Design & Creative Head",
  "Public Relations & Outreach Head",
  "Social Media & Promotion Head",
];

const responseSchema = new mongoose.Schema(
  {
    post: {
      type: String,
      enum: POSTS,
      required: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const recruitmentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    IdNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      enum: [
        "Information Technology",
        "Computer Engineering",
        "Electronics & Communication",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Chemical Engineering",
      ],
    },

    year: {
      type: String,
      required: true,
      enum: ["1st", "2nd", "3rd", "4th"],
    },

    cpi: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    preferences: {
      type: [String],
      enum: POSTS,
      validate: {
        validator: function (arr) {
          return arr.length === 3 && new Set(arr).size === 3;
        },
        message: "Exactly 3 unique preferences are required.",
      },
    },

    responses: [responseSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recruitment", recruitmentSchema);