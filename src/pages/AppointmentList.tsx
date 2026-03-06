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
import { Search, Eye, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { appointmentService } from '@/services/appointmentService';
import type { Appointment } from '@/types';
import { toast } from 'sonner';

export function AppointmentList() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

    const itemsPerPage = 10;

    useEffect(() => {
        fetchAppointments();
    }, [currentPage]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await appointmentService.getAllAppointments(currentPage, itemsPerPage);
            if (response.success) {
                setAppointments(response.data);
                setPagination({
                    totalPages: response.pagination.totalPages,
                    total: response.pagination.totalAppointments
                });
            }
        } catch (error) {
            toast.error('Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'cancelled':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredAppointments = appointments.filter(app =>
        app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.phone.includes(searchQuery)
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                title="Appointments"
                breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Appointments' }]}
            />

            <div className="p-8">
                <Card className="border-0 shadow-sm mb-6">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by Patient Name or Phone..."
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
                                    <TableHead className="font-semibold text-gray-700">PATIENT</TableHead>
                                    <TableHead className="font-semibold text-gray-700">STORE</TableHead>
                                    <TableHead className="font-semibold text-gray-700">DATE</TableHead>
                                    <TableHead className="font-semibold text-gray-700">TIME</TableHead>
                                    <TableHead className="font-semibold text-gray-700">LANGUAGE</TableHead>
                                    <TableHead className="font-semibold text-gray-700">NOTES</TableHead>
                                    <TableHead className="font-semibold text-gray-700">STATUS</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-right">ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                            Loading appointments...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredAppointments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                            No appointments found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredAppointments.map((app) => (
                                        <TableRow key={app._id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{app.fullName}</span>
                                                    <span className="text-xs text-gray-500">{app.phone}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-gray-900 font-medium">
                                                    {app.store?.name || 'N/A'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(app.date).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3 h-3" />
                                                    {app.slot?.time || 'N/A'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                                                    {app.language?.name || 'Any'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="max-w-[150px] truncate text-xs text-gray-500" title={app.additionalNotes}>
                                                {app.additionalNotes || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(app.status)}`}>
                                                    {app.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    onClick={() => navigate(`/appointments/${app._id}`)}
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                Total {pagination.total} appointments
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
