import { useNavigate } from 'react-router-dom';

const StockCard = ({ symbol, name, price, change }) => {
    const navigate = useNavigate();
    const isPositive = change >= 0;

    return (
        <div
            onClick={() => navigate(`/stock/${symbol}`)}
            className="min-w-[160px] p-4 rounded-xl bg-[#1E222D] border border-[#2A2E39] hover:border-[#363A45] hover:bg-[#262B35] transition-all cursor-pointer"
        >
            <div className="flex justify-between items-start mb-2">
                <div>
                    <span className="text-xs font-bold text-gray-500">{symbol}</span>
                    <h3 className="text-sm font-medium text-white truncate max-w-[100px]">{name}</h3>
                </div>
            </div>

            <div className="mt-2">
                <p className="text-lg font-bold text-white">${price}</p>
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${isPositive ? 'text-[#00E396] bg-[#00E396]/10' : 'text-[#FF4560] bg-[#FF4560]/10'}`}>
                    {isPositive ? '+' : ''}{change}%
                </span>
            </div>
        </div>
    );
};

export default StockCard;
