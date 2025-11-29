import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layouts/AdminLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Ticket, Plus, Trash2, Calendar, Check, X } from 'lucide-react';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import logger from '../../../utils/logger';

export default function CouponManager() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form State
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discount: 100,
        validUntil: '',
        maxUsage: 100,
        oneTimePerUser: true,
        applicableOn: 'both' // trial, subscription, both
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const couponsColl = collection(db, 'coupons');
            const q = query(couponsColl, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);

            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                validUntil: doc.data().validUntil?.toDate ? doc.data().validUntil.toDate() : new Date(doc.data().validUntil)
            }));

            setCoupons(data);
        } catch (error) {
            logger.error('CouponManager', 'Error fetching coupons', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        try {
            const couponsColl = collection(db, 'coupons');
            await addDoc(couponsColl, {
                ...newCoupon,
                code: newCoupon.code.toUpperCase(),
                discount: Number(newCoupon.discount),
                maxUsage: Number(newCoupon.maxUsage),
                validUntil: new Date(newCoupon.validUntil),
                currentUsage: 0,
                active: true,
                createdAt: serverTimestamp()
            });

            logger.success('CouponManager', 'Coupon created', { code: newCoupon.code });
            setShowAddForm(false);
            setNewCoupon({
                code: '',
                discount: 100,
                validUntil: '',
                maxUsage: 100,
                oneTimePerUser: true,
                applicableOn: 'both'
            });
            fetchCoupons();
        } catch (error) {
            logger.error('CouponManager', 'Error creating coupon', error);
            alert('Failed to create coupon');
        }
    };

    const handleDeleteCoupon = async (id) => {
        if (!window.confirm('Are you sure you want to delete this coupon?')) return;

        try {
            await deleteDoc(doc(db, 'coupons', id));
            logger.success('CouponManager', 'Coupon deleted', { id });
            fetchCoupons();
        } catch (error) {
            logger.error('CouponManager', 'Error deleting coupon', error);
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-primary">Coupon Management</h1>
                    <p className="text-text-secondary">Create and manage discount codes</p>
                </div>
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? <X size={18} className="mr-2" /> : <Plus size={18} className="mr-2" />}
                    {showAddForm ? 'Cancel' : 'Create Coupon'}
                </Button>
            </div>

            {/* Add Coupon Form */}
            {showAddForm && (
                <Card className="p-6 mb-8 bg-primary/5 border-primary/20">
                    <h3 className="text-lg font-bold mb-4">Create New Coupon</h3>
                    <form onSubmit={handleCreateCoupon} className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Coupon Code</label>
                            <input
                                type="text"
                                required
                                className="w-full p-2 border rounded-lg uppercase"
                                placeholder="e.g. SUMMER50"
                                value={newCoupon.code}
                                onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Discount (%)</label>
                            <input
                                type="number"
                                required
                                min="1"
                                max="100"
                                className="w-full p-2 border rounded-lg"
                                value={newCoupon.discount}
                                onChange={e => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Valid Until</label>
                            <input
                                type="date"
                                required
                                className="w-full p-2 border rounded-lg"
                                value={newCoupon.validUntil}
                                onChange={e => setNewCoupon({ ...newCoupon, validUntil: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Max Usage Limit</label>
                            <input
                                type="number"
                                required
                                min="1"
                                className="w-full p-2 border rounded-lg"
                                value={newCoupon.maxUsage}
                                onChange={e => setNewCoupon({ ...newCoupon, maxUsage: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <Button type="submit" className="w-full md:w-auto">Create Coupon</Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Coupons List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map(coupon => (
                    <Card key={coupon.id} className="p-6 relative group">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleDeleteCoupon(coupon.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                <Ticket size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold font-mono">{coupon.code}</h3>
                                <p className="text-sm text-green-600 font-medium">{coupon.discount}% OFF</p>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-text-secondary">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2"><Calendar size={14} /> Valid Until:</span>
                                <span>{coupon.validUntil.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Usage:</span>
                                <span>{coupon.currentUsage || 0} / {coupon.maxUsage}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Status:</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${new Date() > coupon.validUntil ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                                    }`}>
                                    {new Date() > coupon.validUntil ? 'Expired' : 'Active'}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}

                {coupons.length === 0 && !loading && (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <Ticket size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No coupons yet</h3>
                        <p className="text-gray-500">Create your first coupon to get started</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
