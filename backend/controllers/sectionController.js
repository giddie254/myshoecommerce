// controllers/sectionController.js
import HomepageSection from '../models/sectionModel.js';

export const getHomepageSections = async (req, res) => {
  try {
    let doc = await HomepageSection.findOne();
    if (!doc) {
      doc = await HomepageSection.create({
        sections: [
          { name: 'featured', visible: true },
          { name: 'deals', visible: true },
          { name: 'new_arrivals', visible: true },
          { name: 'categories', visible: true },
          { name: 'brands', visible: true },
        ],
      });
    }
    res.json(doc.sections);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sections' });
  }
};

export const updateHomepageSections = async (req, res) => {
  try {
    const updates = req.body.sections;
    let doc = await HomepageSection.findOne();
    if (!doc) {
      return res.status(404).json({ message: 'Sections not found' });
    }
    doc.sections = doc.sections.map((sec) => {
      const found = updates.find((u) => u.name === sec.name);
      if (found) sec.visible = found.visible;
      return sec;
    });
    await doc.save();
    res.json(doc.sections);
  } catch (err) {
    res.status(500).json({ message: 'Error updating sections' });
  }
};
