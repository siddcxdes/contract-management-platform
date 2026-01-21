import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['text', 'date', 'signature', 'checkbox']
  },
  label: {
    type: String,
    required: true
  },
  position: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    }
  }
}, { _id: false });

const blueprintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  fields: {
    type: [fieldSchema],
    required: true,
    validate: {
      validator: function(fields) {
        return fields.length > 0;
      },
      message: 'Blueprint must have at least one field'
    }
  }
}, {
  timestamps: true
});

const Blueprint = mongoose.model('Blueprint', blueprintSchema);

export default Blueprint;
