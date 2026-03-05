import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ChevronLeft, Package, User, MapPin, CreditCard } from 'lucide-react';
import { orderService } from '@/services/orderService';
import type { Order } from '@/types';
import { toast } from 'sonner';

export function OrderDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchOrderDetails(id);
    }, [id]);

    const fetchOrderDetails = async (orderId: string) => {
        try {
            setLoading(true);
            const response = await orderService.getOrderById(orderId);
            if (response.success) {
                setOrder(response.data);
            }
        } catch (error) {
            toast.error('Failed to fetch order details');
            navigate('/orders');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (productId: string, status: string) => {
        if (!id) return;
        try {
            const response = await orderService.updateOrderItemStatus(id, productId, status);
            if (response.success) {
                toast.success(`Item status updated to ${status}`);
                fetchOrderDetails(id); // Refresh data
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Accepted':
                return 'bg-green-100 text-green-700';
            case 'Cancelled':
                return 'bg-red-100 text-red-700';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading order details...</div>;
    }

    if (!order) {
        return <div className="p-8 text-center text-red-500">Order not found.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                title={`Order #${order.razorpayOrderId.slice(-8).toUpperCase()}`}
                breadcrumbs={[
                    { label: 'Dashboard', path: '/' },
                    { label: 'Orders', path: '/orders' },
                    { label: 'Details' }
                ]}
            />

            <div className="p-8 space-y-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/orders')}
                    className="mb-4"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Orders
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="border-b bg-gray-50/50">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                        <Package className="w-5 h-5 text-red-500" />
                                        Order Items
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>PRODUCT</TableHead>
                                            <TableHead>QUANTITY</TableHead>
                                            <TableHead>PRICE</TableHead>
                                            <TableHead>STATUS</TableHead>
                                            <TableHead className="text-right">ACTION</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.items.map((item, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                                            {item.product?.images[0] ? (
                                                                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Package className="w-5 h-5 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{item.product?.name || 'Deleted Product'}</p>
                                                            <p className="text-xs text-gray-500">{item.product?.sku || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-600">{item.quantity}</TableCell>
                                                <TableCell className="text-gray-900 font-medium">₹{(item.product?.price || 0).toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {item.status === 'Pending' && (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-green-600 border-green-200 hover:bg-green-50"
                                                                onClick={() => handleUpdateStatus(item.product._id, 'Accepted')}
                                                            >
                                                                Accept
                                                            </Button>
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm">
                            <CardHeader className="border-b bg-gray-50/50">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-red-500" />
                                    Shipping Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {/* Note: Address structure depends on your model, assuming common fields */}
                                <div className="text-gray-600">
                                    <p className="font-medium text-gray-900">{order.user?.fullName || 'Deleted User'}</p>
                                    {/* Placeholder for address detail if it was populated */}
                                    <p className="text-sm mt-1">Please refer to user profile for contact details.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Customer & Payment Info */}
                    <div className="space-y-6">
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="border-b bg-gray-50/50">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <User className="w-5 h-5 text-red-500" />
                                    Customer Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Name</p>
                                        <p className="text-sm font-medium text-gray-900">{order.user?.fullName || 'Deleted User'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email</p>
                                        <p className="text-sm text-gray-900">{order.user?.Email || 'N/A'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm">
                            <CardHeader className="border-b bg-gray-50/50">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-red-500" />
                                    Payment Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="text-gray-900 font-medium">₹{order.totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Tax</span>
                                        <span className="text-gray-900 font-medium">₹0.00</span>
                                    </div>
                                    <div className="pt-3 border-t flex justify-between">
                                        <span className="font-semibold text-gray-900">Total</span>
                                        <span className="font-bold text-red-600">₹{order.totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                                        <span className="text-xs text-gray-500 font-semibold uppercase">Status</span>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${order.paymentStatus === 'Success' ? 'bg-green-100 text-green-700' :
                                            order.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
