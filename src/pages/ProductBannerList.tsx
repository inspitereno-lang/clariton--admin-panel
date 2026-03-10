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
import { Plus, Trash2, Edit2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { productBannerService } from '@/services/productBannerService';
import type { ProductBanner } from '@/services/productBannerService';
import { toast } from 'sonner';

export default function ProductBannerList() {
    const navigate = useNavigate();
    const [banners, setBanners] = useState<ProductBanner[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);

    const fetchBanners = async () => {
        try {
            const response = await productBannerService.getAllBanners();
            if (response.success) {
                setBanners(response.data);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch product banners');
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
                const response = await productBannerService.deleteBanner(bannerToDelete);
                if (response.success) {
                    toast.success('Product Banner deleted successfully');
                    fetchBanners();
                }
            } catch (error: any) {
                toast.error(error.message || 'Failed to delete product banner');
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
                title="Product Banners"
                breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Product Banners' }]}
            />

            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Product Banner Management</h2>
                        <p className="text-sm text-gray-500">Manage interactive product card banners</p>
                    </div>
                    <Button
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => navigate('/product-banners/add')}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product Banner
                    </Button>
                </div>

                <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 hover:bg-gray-50">
                                    <TableHead className="font-semibold text-gray-700 w-[120px]">IMAGE</TableHead>
                                    <TableHead className="font-semibold text-gray-700">DETAILS</TableHead>
                                    <TableHead className="font-semibold text-gray-700">LINK & BUTTON</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-center">ORDER</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-center">STATUS</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-right">ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                                            Loading product banners...
                                        </TableCell>
                                    </TableRow>
                                ) : banners.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                                            No product banners found. Create your first banner to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    banners.map((banner) => (
                                        <TableRow key={banner._id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 object-cover">
                                                    {banner.productImage ? (
                                                        <img
                                                            src={banner.productImage}
                                                            alt={banner.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <ImageIcon className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{banner.title}</span>
                                                    <span className="text-xs text-gray-500 line-clamp-2 max-w-xs">{banner.description}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col space-y-1">
                                                    <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md w-max">
                                                        {banner.buttonText}
                                                    </span>
                                                    <div className="flex items-center text-xs text-blue-600">
                                                        <LinkIcon className="w-3 h-3 mr-1" />
                                                        <span className="truncate max-w-[200px]" title={banner.link}>{banner.link}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center font-medium text-gray-600">
                                                {banner.order}
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
                                                        onClick={() => navigate(`/product-banners/edit/${banner._id}`)}
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
                            This action cannot be undone. This will permanently delete the product banner.
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
