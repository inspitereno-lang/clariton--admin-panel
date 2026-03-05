import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Trash2, Edit2, Image as ImageIcon } from 'lucide-react';
import { bannerService } from '@/services/bannerService';
import type { Banner } from '@/services/bannerService';
import { toast } from 'sonner';

export default function BannerList() {
    const navigate = useNavigate();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);

    const fetchBanners = async () => {
        try {
            const response = await bannerService.getAllBanners();
            if (response.success) {
                setBanners(response.data);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch banners');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleDeleteClick = (id: string) => {
        setBannerToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (bannerToDelete) {
            try {
                const response = await bannerService.deleteBanner(bannerToDelete);
                if (response.success) {
                    toast.success('Banner deleted successfully');
                    fetchBanners();
                }
            } catch (error: any) {
                toast.error(error.message || 'Failed to delete banner');
            } finally {
                setBannerToDelete(null);
                setDeleteDialogOpen(false);
            }
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                title="Banners"
                breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Banners' }]}
            />

            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Banner Management</h2>
                        <p className="text-sm text-gray-500">Manage promotional banners for your store</p>
                    </div>
                    <Button
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => navigate('/banners/add')}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Banner
                    </Button>
                </div>

                <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 hover:bg-gray-50">
                                    <TableHead className="font-semibold text-gray-700 w-[300px]">BANNER IMAGE</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-center">PRIORITY</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-center">STATUS</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-right">ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                                            Loading banners...
                                        </TableCell>
                                    </TableRow>
                                ) : banners.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                                            No banners found. Create your first banner to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    banners.map((banner) => (
                                        <TableRow key={banner._id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <div className="w-full aspect-[21/9] rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                                    {banner.imageUrl ? (
                                                        <img
                                                            src={banner.imageUrl}
                                                            alt="Banner"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <ImageIcon className="w-8 h-8 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center font-medium text-gray-600">
                                                {banner.priority}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(banner.status)}`}>
                                                    {banner.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                        onClick={() => navigate(`/banners/edit/${banner._id}`)}
                                                    >
                                                        <Edit2 className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleDeleteClick(banner._id)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the promotional banner.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
