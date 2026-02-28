import multer from "multer";
import path from "path";
import fs from "fs";

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "uploads/misc";

    if (file.fieldname === "profilePhoto") {
      uploadPath = "uploads/profiles";
    } else if (file.fieldname === "evidence") {
      uploadPath = "uploads/disputes";
    } else if (file.fieldname === "paymentProof") {
      uploadPath = "uploads/payments";
    }

    ensureDir(uploadPath); // 🔥 THIS CREATES FOLDER IF MISSING

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export default upload;
