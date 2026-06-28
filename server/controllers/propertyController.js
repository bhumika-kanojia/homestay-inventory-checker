import Property from '../models/propertyModel.js';

// Helper to generate slug from name
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/(^-|-$)+/g, '');   // Trim leading/trailing hyphens
};

/**
 * @desc    Create or save property details
 * @route   POST /api/properties
 * @access  Public (Owner setup)
 */
export const createProperty = async (req, res, next) => {
  try {
    const { 
      propertyName, 
      contactNumber, 
      whatsappNumber, 
      state, 
      region, 
      address, 
      email, 
      slug 
    } = req.body;

    // Field validations
    if (!propertyName || !contactNumber || !whatsappNumber || !state || !region || !address || !email) {
      res.status(400);
      throw new Error('Please fill in all required fields (propertyName, contactNumber, whatsappNumber, state, region, address, email)');
    }

    // Resolve slug
    const resolvedSlug = slug ? slugify(slug) : slugify(propertyName);

    // Check if slug already exists
    const slugExists = await Property.findOne({ slug: resolvedSlug });
    if (slugExists) {
      res.status(400);
      throw new Error(`A property with the slug '${resolvedSlug}' or name already exists.`);
    }

    const property = await Property.create({
      propertyName,
      contactNumber,
      whatsappNumber,
      state,
      region,
      address,
      email,
      slug: resolvedSlug
    });

    res.status(210).json({
      success: true,
      data: property
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get public property details by slug
 * @route   GET /api/properties/:slug
 * @access  Public
 */
export const getPropertyBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const property = await Property.findOne({ slug });

    if (!property) {
      res.status(404);
      throw new Error('Property not found');
    }

    res.status(200).json({
      success: true,
      data: property
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update property details
 * @route   PUT /api/properties/:id
 * @access  Public (Owner setup)
 */
export const updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      propertyName, 
      contactNumber, 
      whatsappNumber, 
      state, 
      region, 
      address, 
      email, 
      slug 
    } = req.body;

    const property = await Property.findById(id);

    if (!property) {
      res.status(404);
      throw new Error('Property not found');
    }

    // Update fields
    property.propertyName = propertyName || property.propertyName;
    property.contactNumber = contactNumber || property.contactNumber;
    property.whatsappNumber = whatsappNumber || property.whatsappNumber;
    property.state = state || property.state;
    property.region = region || property.region;
    property.address = address || property.address;
    property.email = email || property.email;

    if (slug) {
      property.slug = slugify(slug);
    } else if (propertyName) {
      // If propertyName is updated, regenerate slug only if it wasn't specified separately
      property.slug = slugify(propertyName);
    }

    const updatedProperty = await property.save();

    res.status(200).json({
      success: true,
      data: updatedProperty
    });

  } catch (error) {
    next(error);
  }
};
