require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const onboardingDefaults = {
  userType: null,
  donorInfo: {
    location: null,
    streetAddress: null,
    phone: null,
  },
  caregiverType: null,
  pregnantWeeks: null,
  postpartumWeeks: null,
  childAgeValue: null,
  childAgeUnit: null,
  needsConfidence: null,
  needTags: [],
  completedAt: null,
};

const run = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is missing in environment variables.");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected for onboarding backfill");

    const result = await User.updateMany(
      { onboarding: { $exists: false } },
      { $set: { onboarding: onboardingDefaults } }
    );

    console.log(`Matched ${result.matchedCount} users.`);
    console.log(`Updated ${result.modifiedCount} users.`);
    console.log("Onboarding backfill complete.");
  } catch (error) {
    console.error("Onboarding backfill failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
