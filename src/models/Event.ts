import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  type: {
    type: String,
    default: 'workshop',
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date'],
  },
  startTime: {
    type: String,
    required: [true, 'Please provide a start time'],
  },
  endTime: {
    type: String,
    required: [true, 'Please provide an end time'],
  },
  mode: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline',
  },
  location: {
    type: String,
    required: [true, 'Please provide a location or meeting link'],
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide capacity'],
  },
  certificateEnabled: {
    type: Boolean,
    default: false,
  },
  certificateTitle: {
    type: String,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft',
  },
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
