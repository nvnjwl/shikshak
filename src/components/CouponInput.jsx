import { useState } from 'react';
import { Button } from './ui/Button';
import { Check, X, Loader2 } from 'lucide-react';

export default function CouponInput({ onApply, disabled, currentPrice, loading: externalLoading }) {
    const [couponCode, setCouponCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [discount, setDiscount] = useState(0);

    const handleApply = async () => {
        if (!couponCode.trim()) {
            setError('Please enter a coupon code');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Call the parent's onApply function
            const result = await onApply(couponCode.trim().toUpperCase());

            if (result.valid) {
                setDiscount(result.discount);
                setSuccess(`Coupon applied! ${result.discount}% off`);
                setError('');
            } else {
                setError(result.message || 'Invalid coupon code');
                setDiscount(0);
                setSuccess('');
            }
        } catch (err) {
            setError(err.message || 'Failed to apply coupon');
            setDiscount(0);
            setSuccess('');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = () => {
        setCouponCode('');
        setDiscount(0);
        setSuccess('');
        setError('');
        onApply('', 0); // Reset in parent
    };

    const isApplied = discount > 0;
    const finalPrice = currentPrice - (currentPrice * discount / 100);

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code (e.g., FREE_100)"
                        disabled={disabled || loading || externalLoading || isApplied}
                        className={`w-full p-3 rounded-xl border-2 outline-none transition-all uppercase ${isApplied
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : error
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                    : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                            }`}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !isApplied) {
                                handleApply();
                            }
                        }}
                    />
                    {isApplied && (
                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={20} />
                    )}
                </div>
                {!isApplied ? (
                    <Button
                        onClick={handleApply}
                        disabled={disabled || loading || externalLoading || !couponCode.trim()}
                        className="px-6"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin mr-2" size={18} />
                                Applying...
                            </>
                        ) : (
                            'Apply'
                        )}
                    </Button>
                ) : (
                    <Button
                        onClick={handleRemove}
                        variant="outline"
                        className="px-6 border-red-500 text-red-500 hover:bg-red-50"
                    >
                        <X size={18} className="mr-1" />
                        Remove
                    </Button>
                )}
            </div>

            {/* Success Message */}
            {success && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-xl">
                    <Check size={18} />
                    <span className="text-sm font-medium">{success}</span>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl">
                    <X size={18} />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            {/* Price Breakdown */}
            {isApplied && (
                <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Original Price:</span>
                        <span className="line-through">₹{currentPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                        <span>Discount ({discount}%):</span>
                        <span>-₹{(currentPrice * discount / 100).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>Final Price:</span>
                        <span className="text-primary">₹{finalPrice.toFixed(2)}</span>
                    </div>
                    {finalPrice === 0 && (
                        <div className="text-center text-green-600 font-bold text-sm bg-green-100 py-2 rounded-lg">
                            🎉 Completely FREE with this coupon!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
