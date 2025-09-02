import multer from "multer";

// Key features:
// Can store files locally (on your server)
// Can store files in memory (buffer) for further processing
// Filters file types, sets limits on file size, etc.

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ 
    storage: storage 
});
