import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Search, Eye, ChevronLeft, ChevronRight, ShoppingBag, Clock, CheckCircle } from 'lucide-react';
import { orderService } from '@/services/orderService';
import type { Order } from '@/types';
import { toast } from 'sonner';

export function OrderList() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
    const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, acceptedOrders: 0 });
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    const [debouncedSearch, setDebouncedSearch] = useState('');
    const itemsPerPage = 10;

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, debouncedSearch]);

    useEffect(() => {
        fetchOrders();
    }, [currentPage, statusFilter, debouncedSearch]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderService.getAllOrders(currentPage, itemsPerPage, statusFilter, debouncedSearch);
            if (response.success) {
                setOrders(response.data);
                setPagination({
                    totalPages: response.pagination.pages,
                    total: response.pagination.total
                });
            }
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await orderService.getOrderStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'Success':
                return 'bg-green-100 text-green-700';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'Failed':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getOrderStatus = (order: Order) => {
        const statuses = order.items.map(item => item.status);
        const uniqueStatuses = Array.from(new Set(statuses));

        if (uniqueStatuses.length === 1) {
            return uniqueStatuses[0];
        }

        if (uniqueStatuses.includes('Accepted') && uniqueStatuses.includes('Pending')) {
            return 'Partially Accepted';
        }

        if (uniqueStatuses.includes('Accepted')) {
            return 'Partially Accepted'; // Accepted + Cancelled mixture
        }

        if (uniqueStatuses.includes('Pending')) {
            return 'Pending'; // Pending + Cancelled mixture
        }

        return 'Cancelled';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Accepted':
                return 'bg-green-100 text-green-700';
            case 'Partially Accepted':
                return 'bg-blue-100 text-blue-700';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'Cancelled':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const displayOrders = orders;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                title="Orders"
                breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Orders' }]}
            />

            <div className="p-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                        {
                            title: 'Total Orders',
                            value: stats.totalOrders,
                            icon: ShoppingBag,
                            color: 'bg-blue-50 text-blue-600',
                            description: 'Successful payments',
                            id: null
                        },
                        {
                            title: 'Pending Orders',
                            value: stats.pendingOrders,
                            icon: Clock,
                            color: 'bg-yellow-50 text-yellow-600',
                            description: 'Awaiting action',
                            id: 'Pending'
                        },
                        {
                            title: 'Accepted Orders',
                            value: stats.acceptedOrders,
                            icon: CheckCircle,
                            color: 'bg-green-50 text-green-600',
                            description: 'Confirmed orders',
                            id: 'Accepted'
                        }
                    ].map((stat, index) => (
                        <Card
                            key={index}
                            className={`border-0 shadow-sm cursor-pointer transition-all hover:scale-[1.02] ${statusFilter === stat.id ? 'ring-2 ring-offset-2 ring-gray-400 bg-white' : ''
                                }`}
                            onClick={() => setStatusFilter(stat.id)}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                        <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                                    </div>
                                    <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="border-0 shadow-sm mb-6">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by Order ID or Customer Name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 hover:bg-gray-50">
                                    <TableHead className="font-semibold text-gray-700">ORDER ID</TableHead>
                                    <TableHead className="font-semibold text-gray-700">CUSTOMER</TableHead>
                                    <TableHead className="font-semibold text-gray-700">DATE</TableHead>
                                    <TableHead className="font-semibold text-gray-700">AMOUNT</TableHead>
                                    <TableHead className="font-semibold text-gray-700">STATUS</TableHead>
                                    <TableHead className="font-semibold text-gray-700">PAYMENT</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-right">ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                            Loading orders...
                                        </TableCell>
                                    </TableRow>
                                ) : displayOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                            No orders found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    displayOrders.map((order) => (
                                        <TableRow key={order._id} className="hover:bg-gray-50">
                                            <TableCell className="font-medium text-gray-900">
                                                #{order.razorpayOrderId.slice(-8).toUpperCase()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{order.user?.fullName || 'Deleted User'}</span>
                                                    <span className="text-xs text-gray-500">{order.user?.Email || 'N/A'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-600">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="font-semibold text-gray-900">
                                                ₹{order.totalAmount.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(getOrderStatus(order))}`}>
                                                    {getOrderStatus(order)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                                                    {order.paymentStatus}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    onClick={() => navigate(`/orders/${order._id}`)}
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                Total {pagination.total} orders
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <span className="text-sm font-medium">Page {currentPage} of {pagination.totalPages}</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                                    disabled={currentPage === pagination.totalPages}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
