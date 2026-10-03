import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = async (fileBuffer) => {
  const result = await cloudinary.uploader.upload(
    `data:image/jpeg;base64,${fileBuffer.toString("base64")}`,
    {
      resource_type: "image",
    }
  );

  return result;
};

export default uploadToCloudinary;