const fs = require("fs");
const path = require("path");

const uploadProductImages =
  async (
    req,
    res,
    next
  ) => {
    try {
      if (
        !req.files ||
        req.files.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please upload at least one image.",
        });
      }

      const images =
        req.files.map(
          (file) => ({
            filename:
              file.filename,

            url:
              `/uploads/products/${file.filename}`,

            size:
              file.size,

            mimetype:
              file.mimetype,
          })
        );

      res.status(201).json({
        success: true,
        message:
          "Product images uploaded successfully.",
        images,
      });
    } catch (error) {
      next(error);
    }
  };

const deleteProductImage =
  async (
    req,
    res,
    next
  ) => {
    try {
      const {
        filename,
      } = req.body;

      if (!filename) {
        return res.status(400).json({
          success: false,
          message:
            "Filename is required.",
        });
      }

      const filePath =
        path.join(
          __dirname,
          "../uploads/products",
          filename
        );

      if (
        !fs.existsSync(filePath)
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Image not found.",
        });
      }

      fs.unlinkSync(filePath);

      res.status(200).json({
        success: true,
        message:
          "Product image deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  uploadProductImages,
  deleteProductImage,
};