import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getStockPrice, buyStock, sellStock, getStockCandles } from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StockDetail = () => {
    const { symbol } = useParams();
    const navigate = useNavigate();
    const [price, setPrice] = useState(null);
    const [candles, setCandles] = useState([]);
    const [range, setRange] = useState('1mo');
    const [quantity, setQuantity] = useState('');
    const [activeTab, setActiveTab] = useState('BUY');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const { data } = await getStockPrice(symbol);
                setPrice(data.price);
            } catch (err) {
                setError('Failed to fetch price');
            }
        };
        fetchPrice();
    }, [symbol]);

    useEffect(() => {
        const fetchCandles = async () => {
            try {
                const { data } = await getStockCandles(symbol, range);
                setCandles(data);
            } catch (err) {
                console.error("Failed to fetch chart data", err);
            }
        };
        fetchCandles();
    }, [symbol, range]);

    const handleTrade = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        if (!quantity || quantity <= 0) {
            setError('Please enter a valid quantity');
            return;
        }

        setLoading(true);
        try {
            const tradeFunc = activeTab === 'BUY' ? buyStock : sellStock;
            const { data } = await tradeFunc({ symbol, quantity: Number(quantity) });
            setMessage(data.message);
            setQuantity('');
        } catch (err) {
            setError(err.response?.data?.message || 'Trade failed');
        } finally {
            setLoading(false);
        }
    };

    const estimatedCost = price && quantity ? (price * quantity).toFixed(2) : '0.00';

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="p-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
                {/* Left Side: Chart & Info */}
                <div className="flex-1 space-y-6">
                    <button onClick={() => navigate('/trade')} className="text-blue-600 hover:underline">&larr; Back to Search</button>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900">{symbol}</h1>
                                <p className="text-3xl font-bold text-blue-600 mt-2">
                                    {price ? `$${price.toFixed(2)}` : 'Loading...'}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                {['1d', '5d', '1mo', '6mo', '1y'].map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => setRange(r)}
                                        className={`px-3 py-1 rounded text-sm font-medium ${range === r ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        {r.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-96 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={candles}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="time"
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(str) => {
                                            const date = new Date(str);
                                            return range === '1d' ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                                        }}
                                    />
                                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                        formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
                                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                    />
                                    <Area type="monotone" dataKey="close" stroke="#2563eb" fillOpacity={1} fill="url(#colorPrice)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Side: Trading Form */}
                <div className="w-full md:w-96">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden sticky top-8">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Trade {symbol}</h2>
                        </div>
                        <div className="p-6">
                            <div className="flex mb-6 border-b">
                                <button
                                    className={`flex-1 py-3 text-center font-medium transition-colors ${activeTab === 'BUY' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setActiveTab('BUY')}
                                >
                                    Buy
                                </button>
                                <button
                                    className={`flex-1 py-3 text-center font-medium transition-colors ${activeTab === 'SELL' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setActiveTab('SELL')}
                                >
                                    Sell
                                </button>
                            </div>

                            <form onSubmit={handleTrade} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                        placeholder="Number of shares"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                    />
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Estimated {activeTab === 'BUY' ? 'Cost' : 'Credit'}</span>
                                    <span className="text-xl font-bold text-gray-900">${estimatedCost}</span>
                                </div>

                                {message && <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">{message}</div>}
                                {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>}

                                <button
                                    type="submit"
                                    className={`w-full py-3 rounded-lg text-white font-bold shadow-sm transition-all transform active:scale-95 ${activeTab === 'BUY'
                                        ? 'bg-green-600 hover:bg-green-700 shadow-green-200'
                                        : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    disabled={loading || !price}
                                >
                                    {loading ? 'Processing...' : `Place ${activeTab} Order`}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockDetail;
