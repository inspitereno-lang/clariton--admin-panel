import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { bannerService } from '@/services/bannerService';
import type { Banner } from '@/services/bannerService';
import { toast } from 'sonner';

export default function BannerForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        status: 'Active' as 'Active' | 'Inactive',
        priority: '0',
        image: null as File | null,
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit && id) {
            const fetchBanner = async () => {
                try {
                    const response = await bannerService.getAllBanners(); // Fetch all and find
                    const banner = response.data.find((b: Banner) => b._id === id);
                    if (banner) {
                        setFormData({
                            status: banner.status,
                            priority: banner.priority.toString(),
                            image: null,
                        });
                        setPreviewImage(banner.imageUrl);
                    }
                } catch (error: any) {
                    toast.error('Failed to load banner details');
                }
            };
            fetchBanner();
        }
    }, [isEdit, id]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setPreviewImage(null);
        setFormData(prev => ({ ...prev, image: null }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('status', formData.status);
            data.append('priority', formData.priority);
            if (formData.image) {
                data.append('image', formData.image);
            }

            let response;
            if (isEdit && id) {
                response = await bannerService.updateBanner(id, data);
            } else {
                if (!formData.image) {
                    toast.error('Please upload an image for the banner');
                    setLoading(false);
                    return;
                }
                response = await bannerService.createBanner(data);
            }

            if (response.success) {
                toast.success(`Banner ${isEdit ? 'updated' : 'created'} successfully`);
                navigate('/banners');
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
                title={isEdit ? 'Edit Banner' : 'Add New Banner'}
                breadcrumbs={[
                    { label: 'Dashboard', path: '/' },
                    { label: 'Banners', path: '/banners' },
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
                            <p className="text-sm text-gray-500">Configure your promotional banner</p>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/banners')}
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
                                    Banner Image
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className={`relative border-2 border-dashed rounded-xl p-4 transition-all ${previewImage ? 'border-red-200 bg-red-50/10' : 'border-gray-200 hover:border-red-300'
                                    }`}>
                                    {previewImage ? (
                                        <div className="relative aspect-[21/9] w-full group">
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
                                            <p className="text-base font-medium text-gray-900">Upload Banner Image</p>
                                            <p className="text-sm text-gray-500 mt-1 mb-6 text-center max-w-[240px]">
                                                Recommended size: 1920x820 pixels. PNG, JPG formats only.
                                            </p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="banner-image"
                                            />
                                            <Label
                                                htmlFor="banner-image"
                                                className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-semibold cursor-pointer transition-all shadow-md hover:shadow-lg"
                                            >
                                                Select Image
                                            </Label>
                                        </div>
                                    )}
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
                                        <Label htmlFor="priority" className="text-sm font-medium mb-2 block">
                                            Priority (Higher shows first)
                                        </Label>
                                        <Input
                                            id="priority"
                                            type="number"
                                            value={formData.priority}
                                            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
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
