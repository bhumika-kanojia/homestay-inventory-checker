import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  propertyName: { 
    type: String, 
    required: [true, 'Property name is required'], 
    trim: true 
  },
  contactNumber: { 
    type: String, 
    required: [true, 'Contact number is required'] 
  },
  whatsappNumber: { 
    type: String,
    required: [true, 'WhatsApp number is required']
  },
  state: { 
    type: String, 
    required: [true, 'State is required'] 
  },
  region: { 
    type: String, 
    required: [true, 'Region is required'] 
  },
  address: { 
    type: String, 
    required: [true, 'Address is required'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    lowercase: true, 
    trim: true 
  },
  slug: { 
    type: String, 
    required: [true, 'Slug is required'], 
    unique: true, 
    index: true 
  }
}, {
  timestamps: true
});

const Property = mongoose.model('Property', propertySchema);
export default Property;
