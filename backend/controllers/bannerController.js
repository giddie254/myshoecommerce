import Banner from '../models/bannerModel.js';
import cloudinary from '../config/cloudinary.js';

export const getBanners = async (req, res) => {
  const banners = await Banner.find().sort({ createdAt: -1 });
  res.json(banners);
};

export const createBanner = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'sokohive/banners',
    });

    const banner = await Banner.create({
      image: result.secure_url,
      link: req.body.link || '',
    });

    res.status(201).json(banner);
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload banner' });
  }
};

export const deleteBanner = async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) return res.status(404).json({ message: 'Not found' });

  await banner.deleteOne();
  res.json({ message: 'Banner deleted' });
};

export const toggleBannerStatus = async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) return res.status(404).json({ message: 'Not found' });

  banner.isActive = !banner.isActive;
  await banner.save();

  res.json({ message: 'Banner status updated', isActive: banner.isActive });
};
