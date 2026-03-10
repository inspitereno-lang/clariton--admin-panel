import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { productBannerService } from '@/services/productBannerService';
import type { ProductBanner } from '@/services/productBannerService';
import { toast } from 'sonner';

export default function ProductBannerForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        buttonText: 'Shop Now',
        link: '',
        status: 'Active' as 'Active' | 'Inactive',
        order: '0',
        productImage: null as File | null,
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit && id) {
            const fetchBanner = async () => {
                try {
                    const response = await productBannerService.getAllBanners(); // Fetch all and find
                    const banner = response.data.find((b: ProductBanner) => b._id === id);
                    if (banner) {
                        setFormData({
                            title: banner.title,
                            description: banner.description,
                            buttonText: banner.buttonText,
                            link: banner.link,
                            status: banner.status,
                            order: banner.order.toString(),
                            productImage: null,
                        });
                        setPreviewImage(banner.productImage);
                    }
                } catch (error: any) {
                    toast.error('Failed to load product banner details');
                }
            };
            fetchBanner();
        }
    }, [isEdit, id]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, productImage: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setPreviewImage(null);
        setFormData(prev => ({ ...prev, productImage: null }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title || !formData.description || !formData.link) {
            toast.error('Title, description, and link are required.');
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('buttonText', formData.buttonText);
            data.append('link', formData.link);
            data.append('status', formData.status);
            data.append('order', formData.order);
            if (formData.productImage) {
                data.append('productImage', formData.productImage);
            }

            let response;
            if (isEdit && id) {
                response = await productBannerService.updateBanner(id, data);
            } else {
                if (!formData.productImage) {
                    toast.error('Please upload an image for the product banner');
                    setLoading(false);
                    return;
                }
                response = await productBannerService.createBanner(data);
            }

            if (response.success) {
                toast.success(`Product Banner ${isEdit ? 'updated' : 'created'} successfully`);
                navigate('/product-banners');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                title={isEdit ? 'Edit Product Banner' : 'Add New Product Banner'}
                breadcrumbs={[
                    { label: 'Dashboard', path: '/' },
                    { label: 'Product Banners', path: '/product-banners' },
                    { label: isEdit ? 'Edit' : 'Add New' }
                ]}
            />

            <div className="p-8 max-w-4xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {isEdit ? 'Banner Details' : 'New Banner'}
                            </h2>
                            <p className="text-sm text-gray-500">Configure your product card banner</p>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/product-banners')}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-red-500 hover:bg-red-600 text-white"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : (isEdit ? 'Update Banner' : 'Save Banner')}
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2 border-0 shadow-sm">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-red-500" />
                                    Banner Content
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className={`relative border-2 border-dashed rounded-xl p-4 transition-all ${previewImage ? 'border-red-200 bg-red-50/10' : 'border-gray-200 hover:border-red-300'
                                    }`}>
                                    {previewImage ? (
                                        <div className="relative aspect-video w-full max-w-sm mx-auto group">
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="w-full h-full object-cover rounded-lg shadow-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-transform hover:scale-110 active:scale-95 z-10"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="py-12 flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                                                <Upload className="w-8 h-8" />
                                            </div>
                                            <p className="text-base font-medium text-gray-900">Upload Product Image</p>
                                            <p className="text-sm text-gray-500 mt-1 mb-6 text-center max-w-[240px]">
                                                Recommended size: 600x600 pixels. PNG, JPG formats only.
                                            </p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="product-image"
                                            />
                                            <Label
                                                htmlFor="product-image"
                                                className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-semibold cursor-pointer transition-all shadow-md hover:shadow-lg"
                                            >
                                                Select Image
                                            </Label>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                                            Title
                                        </Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder="e.g. New Hearing Aid Collection"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="description" className="text-sm font-medium mb-2 block">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="e.g. Discover our latest invisible hearing..."
                                            rows={3}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="buttonText" className="text-sm font-medium mb-2 block">
                                                Button Text
                                            </Label>
                                            <Input
                                                id="buttonText"
                                                value={formData.buttonText}
                                                onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                                                placeholder="e.g. Shop Now"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="link" className="text-sm font-medium mb-2 block">
                                                Link URL
                                            </Label>
                                            <Input
                                                id="link"
                                                value={formData.link}
                                                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                                                placeholder="e.g. /products?category=invisible"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="border-b border-gray-100">
                                    <CardTitle className="text-lg">Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div>
                                        <Label htmlFor="status" className="text-sm font-medium mb-2 block">
                                            Status
                                        </Label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(value: 'Active' | 'Inactive') =>
                                                setFormData(prev => ({ ...prev, status: value }))
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Active">Active</SelectItem>
                                                <SelectItem value="Inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="order" className="text-sm font-medium mb-2 block">
                                            Order (Lower shows first)
                                        </Label>
                                        <Input
                                            id="order"
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData(prev => ({ ...prev, order: e.target.value }))}
                                            placeholder="0"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
