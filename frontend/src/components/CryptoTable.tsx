import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { updatePrices, setAssets, refreshData, ConnectionStatus } from '../store/cryptoSlice';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { ChevronUpIcon, ChevronDownIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const cryptoLogos = {
  bitcoin: '/images/btc.svg',
  ethereum: '/images/eth.svg',
  tether: '/images/usdt.svg',
  bnb: '/images/bnb.svg',
  solana: '/images/sol.svg'
};

const initialCryptoData = [
  {
    id: 'bitcoin',
    rank: 1,
    logo: cryptoLogos.bitcoin,
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 50000,
    priceChange1h: 0.5,
    priceChange24h: 2.3,
    priceChange7d: -1.2,
    marketCap: 1000000000000,
    volume24h: 30000000000,
    circulatingSupply: 19000000,
    maxSupply: 21000000,
    chartData: Array(7).fill(0).map(() => Math.random() * 1000)
  },
  {
    id: 'ethereum',
    rank: 2,
    logo: cryptoLogos.ethereum,
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3000,
    priceChange1h: -0.2,
    priceChange24h: 1.5,
    priceChange7d: 3.2,
    marketCap: 350000000000,
    volume24h: 15000000000,
    circulatingSupply: 120000000,
    maxSupply: null,
    chartData: Array(7).fill(0).map(() => Math.random() * 1000)
  },
  {
    id: 'tether',
    rank: 3,
    logo: cryptoLogos.tether,
    name: 'Tether',
    symbol: 'USDT',
    price: 1,
    priceChange1h: 0.01,
    priceChange24h: -0.02,
    priceChange7d: 0.01,
    marketCap: 83000000000,
    volume24h: 40000000000,
    circulatingSupply: 83000000000,
    maxSupply: null,
    chartData: Array(7).fill(0).map(() => Math.random() * 1000)
  },
  {
    id: 'bnb',
    rank: 4,
    logo: cryptoLogos.bnb,
    name: 'BNB',
    symbol: 'BNB',
    price: 400,
    priceChange1h: 1.2,
    priceChange24h: -0.8,
    priceChange7d: 5.4,
    marketCap: 62000000000,
    volume24h: 2000000000,
    circulatingSupply: 155000000,
    maxSupply: 165000000,
    chartData: Array(7).fill(0).map(() => Math.random() * 1000)
  },
  {
    id: 'solana',
    rank: 5,
    logo: cryptoLogos.solana,
    name: 'Solana',
    symbol: 'SOL',
    price: 100,
    priceChange1h: -1.5,
    priceChange24h: 4.2,
    priceChange7d: -2.8,
    marketCap: 40000000000,
    volume24h: 1500000000,
    circulatingSupply: 400000000,
    maxSupply: null,
    chartData: Array(7).fill(0).map(() => Math.random() * 1000)
  }
];

type SortField = 'rank' | 'price' | 'priceChange1h' | 'priceChange24h' | 'priceChange7d' | 'marketCap' | 'volume24h';
type SortDirection = 'asc' | 'desc';

const ConnectionStatusIndicator: React.FC<{ status: ConnectionStatus }> = ({ status }) => {
  const statusColors = {
    connected: 'bg-green-500',
    connecting: 'bg-yellow-500 animate-pulse',
    reconnecting: 'bg-yellow-500 animate-pulse',
    disconnected: 'bg-red-500',
    error: 'bg-red-500',
    failed: 'bg-red-500'
  };

  const statusText = {
    connected: 'Connected',
    connecting: 'Connecting...',
    reconnecting: 'Reconnecting...',
    disconnected: 'Disconnected',
    error: 'Connection Error',
    failed: 'Connection Failed'
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${statusColors[status]}`}></div>
      <span className="text-sm text-gray-600 dark:text-gray-400">{statusText[status]}</span>
    </div>
  );
};

const CryptoTable: React.FC = () => {
  const dispatch = useDispatch();
  const { assets, loading, error, connectionStatus } = useSelector((state: RootState) => state.crypto);
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    // Set initial data
    dispatch(setAssets(initialCryptoData));

    // Simulate WebSocket updates
    const interval = setInterval(() => {
      initialCryptoData.forEach(crypto => {
        const randomChange = (Math.random() - 0.5) * 200;
        dispatch(updatePrices({
          id: crypto.id,
          price: crypto.price + randomChange,
          priceChanges: {
            '1h': (Math.random() - 0.5) * 2,
            '24h': (Math.random() - 0.5) * 5,
            '7d': (Math.random() - 0.5) * 10
          }
        }));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRefresh = () => {
    dispatch(refreshData());
  };

  const sortedAssets = [...assets].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    const fieldA = a[sortField];
    const fieldB = b[sortField];
    return (fieldA - fieldB) * multiplier;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? 
      <ChevronUpIcon className="w-4 h-4 inline ml-1" /> :
      <ChevronDownIcon className="w-4 h-4 inline ml-1" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <ConnectionStatusIndicator status={connectionStatus} />
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('rank')}>
                # <SortIcon field="rank" />
              </th>
              <th className="px-4 py-2">Asset</th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('price')}>
                Price <SortIcon field="price" />
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('priceChange1h')}>
                1h % <SortIcon field="priceChange1h" />
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('priceChange24h')}>
                24h % <SortIcon field="priceChange24h" />
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('priceChange7d')}>
                7d % <SortIcon field="priceChange7d" />
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('marketCap')}>
                Market Cap <SortIcon field="marketCap" />
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('volume24h')}>
                Volume (24h) <SortIcon field="volume24h" />
              </th>
              <th className="px-4 py-2">Circulating Supply</th>
              <th className="px-4 py-2">7D Chart</th>
            </tr>
          </thead>
          <tbody>
            {sortedAssets.map((asset) => (
              <tr key={asset.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-4 py-2">{asset.rank}</td>
                <td className="px-4 py-2 flex items-center">
                  <img src={asset.logo} alt={asset.name} className="w-6 h-6 mr-2" />
                  <span className="font-medium">{asset.name}</span>
                  <span className="text-gray-500 ml-2">{asset.symbol}</span>
                </td>
                <td className="px-4 py-2">{formatPrice(asset.price)}</td>
                <td className={`px-4 py-2 ${asset.priceChange1h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatNumber(asset.priceChange1h)}%
                </td>
                <td className={`px-4 py-2 ${asset.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatNumber(asset.priceChange24h)}%
                </td>
                <td className={`px-4 py-2 ${asset.priceChange7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatNumber(asset.priceChange7d)}%
                </td>
                <td className="px-4 py-2">${formatNumber(asset.marketCap / 1e9)}B</td>
                <td className="px-4 py-2">${formatNumber(asset.volume24h / 1e9)}B</td>
                <td className="px-4 py-2">
                  {formatNumber(asset.circulatingSupply)} {asset.symbol}
                </td>
                <td className="px-4 py-2 w-32 h-16">
                  <ResponsiveContainer width="100%" height={60}>
                    <AreaChart data={asset.chartData.map((value, index) => ({ value, index }))}>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={asset.priceChange7d >= 0 ? '#10B981' : '#EF4444'}
                        fill={asset.priceChange7d >= 0 ? '#10B98120' : '#EF444420'}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoTable;