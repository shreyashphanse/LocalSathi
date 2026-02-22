import Rating from "../models/Rating.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

export const submitRating = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { rating, comment } = req.body;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const isParticipant =
      job.createdBy.toString() === req.user._id.toString() ||
      job.labourId?.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ message: "Not allowed to rate" });
    }

    if (job.status !== "completed") {
      return res.status(400).json({ message: "Job not completed" });
    }

    let reviewee;

    if (job.createdBy.toString() === req.user._id.toString()) {
      reviewee = job.acceptedBy;
    } else {
      reviewee = job.createdBy;
    }

    if (reviewee.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot rate yourself" });
    }

    /* ✅ DUPLICATE RATING GUARD 🔥🔥🔥 */

    const existingRating = await Rating.findOne({
      job: jobId,
      reviewer: req.user._id,
    });

    if (existingRating) {
      return res.status(400).json({ message: "Already rated this job" });
    }

    const newRating = await Rating.create({
      job: jobId,
      reviewer: req.user._id,
      reviewee,
      rating,
      comment,
    });

    const user = await User.findById(reviewee);

    user.reliabilityScore = (user.reliabilityScore + rating * 10) / 2;

    await user.save();

    res.json(newRating);
  } catch (err) {
    console.error("RATING ERROR:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Already rated this job",
      });
    }

    res.status(400).json({
      message: err.message || "Rating failed",
    });
  }
};

export const getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({
      reviewee: req.params.userId,
    })
      .populate("reviewer", "name")
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
