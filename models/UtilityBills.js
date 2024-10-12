import mongoose from 'mongoose';

const UtilityBillsSchema = new mongoose.Schema(
  {
    hotWater: {
      type: Number,
      required: true,
    },
    coldWater: {
      type: Number,
      required: true,
    },
    electric: {
      type: Number,
      required: true,
    },
    addPayment: {
      type: Array,
      default: [],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    createDate: Date,
  },
  {
    timestamps: true,
  },
);
export default mongoose.model('UtilityBill', UtilityBillsSchema);
