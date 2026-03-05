import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Calendar, Clock, User, Phone, Globe, CheckCircle, XCircle, FileText } from 'lucide-react';
import { appointmentService } from '@/services/appointmentService';
import type { Appointment } from '@/types';
import { toast } from 'sonner';

export function AppointmentDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchAppointmentDetails(id);
    }, [id]);

    const fetchAppointmentDetails = async (appId: string) => {
        try {
            setLoading(true);
            const response = await appointmentService.getAppointmentById(appId);
            if (response.success) {
                setAppointment(response.data);
            }
        } catch (error) {
            toast.error('Failed to fetch appointment details');
            navigate('/appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (status: string) => {
        if (!id) return;
        try {
            const response = await appointmentService.updateAppointmentStatus(id, status);
            if (response.success) {
                toast.success(`Appointment ${status} successfully`);
                fetchAppointmentDetails(id);
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-700';
            case 'cancelled':
                return 'bg-red-100 text-red-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading appointment details...</div>;
    }

    if (!appointment) {
        return <div className="p-8 text-center text-red-500">Appointment not found.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                title="Appointment Details"
                breadcrumbs={[
                    { label: 'Dashboard', path: '/' },
                    { label: 'Appointments', path: '/appointments' },
                    { label: 'Details' }
                ]}
            />

            <div className="p-8 space-y-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/appointments')}
                    className="mb-4"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Appointments
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Patient Info */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b bg-gray-50/50">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <User className="w-5 h-5 text-red-500" />
                                Patient Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                    <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{appointment.fullName}</p>
                                    <p className="text-xs text-gray-500">Patient Name</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{appointment.phone}</p>
                                    <p className="text-xs text-gray-500">Contact Number</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{appointment.language?.name || 'Any'}</p>
                                    <p className="text-xs text-gray-500">Preferred Language</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 mt-4 pt-4 border-t">
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 whitespace-pre-wrap">{appointment.additionalNotes || 'N/A'}</p>
                                    <p className="text-xs text-gray-500">Additional Notes</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Appointment Schedule */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b bg-gray-50/50">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-red-500" />
                                Schedule Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{new Date(appointment.date).toLocaleDateString()}</p>
                                    <p className="text-xs text-gray-500">Scheduled Date</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{appointment.slot?.time || 'N/A'}</p>
                                    <p className="text-xs text-gray-500">Time Slot</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t">
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Current Status</p>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(appointment.status)}`}>
                                    {appointment.status}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">Manage Appointment</h3>
                                <p className="text-xs text-gray-500">Update the status of this patient's visit</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {appointment.status !== 'confirmed' && (
                                    <Button
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleUpdateStatus('confirmed')}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Confirm Appointment
                                    </Button>
                                )}
                                {appointment.status !== 'cancelled' && (
                                    <Button
                                        variant="outline"
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                        onClick={() => handleUpdateStatus('cancelled')}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Cancel Appointment
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
