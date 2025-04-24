import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error' | 'failed';

interface CryptoAsset {
  id: string;
  rank: number;
  logo: string;
  name: string;
  symbol: string;
  price: number;
  priceChange1h: number;
  priceChange24h: number;
  priceChange7d: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  maxSupply: number | null;
  chartData: number[];
}

interface CryptoState {
  assets: CryptoAsset[];
  loading: boolean;
  error: string | null;
  connectionStatus: ConnectionStatus;
}

const initialState: CryptoState = {
  assets: [],
  loading: false,
  error: null,
  connectionStatus: 'disconnected'
};

export const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updatePrices: (state, action: PayloadAction<{ id: string; price: number; priceChanges: { [key: string]: number } }>) => {
      const asset = state.assets.find(a => a.id === action.payload.id);
      if (asset) {
        asset.price = action.payload.price;
        asset.priceChange1h = action.payload.priceChanges['1h'] ?? asset.priceChange1h;
        asset.priceChange24h = action.payload.priceChanges['24h'] ?? asset.priceChange24h;
        asset.priceChange7d = action.payload.priceChanges['7d'] ?? asset.priceChange7d;
      }
    },
    setAssets: (state, action: PayloadAction<CryptoAsset[]>) => {
      state.assets = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setConnectionStatus: (state, action: PayloadAction<ConnectionStatus>) => {
      state.connectionStatus = action.payload;
    },
    refreshData: (state) => {
      state.loading = true;
      state.error = null;
    }
  }
});

export const { 
  updatePrices, 
  setAssets, 
  setLoading, 
  setError, 
  setConnectionStatus,
  refreshData 
} = cryptoSlice.actions;

export default cryptoSlice.reducer;