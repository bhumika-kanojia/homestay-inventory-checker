import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  whatsapp: { type: String },
  state: { type: String },
  region: { type: String },
  address: { type: String }
}, {
  timestamps: true
});

const Property = mongoose.model('Property', propertySchema);
export default Property;
