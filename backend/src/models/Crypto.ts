import mongoose from 'mongoose';

const cryptoSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  rank: { type: Number, required: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  logo: { type: String, required: true },
  price: { type: Number, required: true },
  priceChange1h: { type: Number, default: 0 },
  priceChange24h: { type: Number, default: 0 },
  priceChange7d: { type: Number, default: 0 },
  marketCap: { type: Number, required: true },
  volume24h: { type: Number, required: true },
  circulatingSupply: { type: Number, required: true },
  maxSupply: { type: Number },
  chartData: [{ type: Number }]
}, {
  timestamps: true
});

export default mongoose.model('Crypto', cryptoSchema);