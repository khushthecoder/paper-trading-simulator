import { useState } from 'react';
import { Lock, X, AlertCircle } from 'lucide-react';

const TpinModal = ({ isOpen, onClose, onVerify, type, symbol, quantity, price }) => {
    const [tpin, setTpin] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (tpin.length !== 4) {
            setError('TPIN must be 4 digits');
            return;
        }

        setLoading(true);
        try {
            await onVerify(tpin);
            setTpin('');
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid TPIN');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
            <div className="bg-surface border border-border rounded-xl w-full max-w-md p-6 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted hover:text-text"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Lock className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-text">Verify Transaction</h3>
                        <p className="text-xs text-muted">Enter TPIN to confirm trade</p>
                    </div>
                </div>

                <div className="bg-background border border-border rounded-lg p-4 mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted">Type</span>
                        <span className={`font-bold ${type === 'BUY' ? 'text-primary' : 'text-accent'}`}>{type}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted">Symbol</span>
                        <span className="font-bold text-text">{symbol}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted">Quantity</span>
                        <span className="font-bold text-text">{quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-border mt-2">
                        <span className="text-muted">Total Amount</span>
                        <span className="font-bold text-text">${(price * quantity).toLocaleString()}</span>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-muted uppercase mb-2">Enter 4-Digit TPIN</label>
                        <input
                            type="password"
                            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text focus:border-primary outline-none text-center text-2xl tracking-widest font-mono"
                            value={tpin}
                            onChange={e => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                setTpin(val);
                            }}
                            placeholder="****"
                            autoFocus
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || tpin.length !== 4}
                        className="w-full py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? 'Verifying...' : 'Confirm & Execute'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TpinModal;
