const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

export const uploadImageIfNeeded = async (image) => {
  if (!image) return '';

  if (image.startsWith('data:image')) {
    if (!isCloudinaryConfigured()) {
      return image;
    }

    const { default: cloudinary } = await import('../middleware/cloudinary.js');
    const result = await cloudinary.uploader.upload(image, {
      folder: 'smartbiz-products',
      transformation: [{ width: 400, height: 400, crop: 'limit' }],
    });
    return result.secure_url;
  }

  return image;
};
