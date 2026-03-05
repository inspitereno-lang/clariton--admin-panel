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
import { Plus, Tag } from 'lucide-react';
import { useOfferStore } from '@/hooks/useOfferStore';
import { useProductStore } from '@/hooks/useStore';
import { toast } from 'sonner';

export function OfferForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const { fetchOffers, offers, addOffer, updateOffer } = useOfferStore();
    const { products } = useProductStore();

    const [formData, setFormData] = useState<{
        product: string;
        title: string;
        discount: string;
        discountType: 'percentage' | 'fixed';
        startDate: string;
        endDate: string;
        status: 'Active' | 'Inactive';
    }>({
        product: '',
        title: '',
        discount: '',
        discountType: 'percentage',
        startDate: '',
        endDate: '',
        status: 'Active',
    });

    useEffect(() => {
        if (offers.length === 0) fetchOffers();
    }, [offers.length, fetchOffers]);

    useEffect(() => {
        if (isEdit && id && offers.length > 0) {
            const offer = offers.find(o => o._id === id);
            if (offer) {
                setFormData({
                    product: offer.product?._id || '',
                    title: offer.title || '',
                    discount: offer.discount?.toString() || '',
                    discountType: offer.discountType || 'percentage',
                    startDate: offer.startDate ? new Date(offer.startDate).toISOString().split('T')[0] : '',
                    endDate: offer.endDate ? new Date(offer.endDate).toISOString().split('T')[0] : '',
                    status: offer.status || 'Active'
                });
            }
        }
    }, [isEdit, id, offers]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.product) {
            toast.error("Please select a valid product");
            return;
        }

        const payload = {
            ...formData,
            discount: Number(formData.discount)
        };

        try {
            if (isEdit && id) {
                await updateOffer(id, payload);
                toast.success("Offer updated successfully");
            } else {
                await addOffer(payload);
                toast.success("Offer added successfully");
            }
            navigate('/offers');
        } catch (e: any) {
            toast.error("An error occurred preserving the offer");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                title={isEdit ? 'Edit Offer' : 'Add New Offer'}
                breadcrumbs={[
                    { label: 'Dashboard', path: '/' },
                    { label: 'Offers', path: '/offers' },
                    { label: isEdit ? 'Edit' : 'Add New' }
                ]}
            />

            <div className="p-8 max-w-4xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-end gap-4 mb-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/offers')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {isEdit ? 'Update Offer' : 'Save Offer'}
                        </Button>
                    </div>

                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Tag className="w-5 h-5 text-red-500" />
                                Offer Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">

                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <Label htmlFor="title" className="text-sm font-medium">
                                        Offer Title <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        placeholder="e.g. Navratri 20% OFF"
                                        className="mt-2"
                                        required
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label htmlFor="product" className="text-sm font-medium">
                                        Linked Product <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.product}
                                        onValueChange={(value) => handleInputChange('product', value)}
                                    >
                                        <SelectTrigger className="mt-2">
                                            <SelectValue placeholder="Select a product to apply the offer" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[300px]">
                                            {products.map(p => (
                                                <SelectItem key={p._id} value={p._id}>
                                                    {p.name} - ₹{p.price}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="discountType" className="text-sm font-medium">
                                        Discount Type <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.discountType}
                                        onValueChange={(value: 'percentage' | 'fixed') =>
                                            handleInputChange('discountType', value)
                                        }
                                    >
                                        <SelectTrigger className="mt-2">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                                            <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="discount" className="text-sm font-medium">
                                        Discount Value <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="discount"
                                        type="number"
                                        step="0.01"
                                        value={formData.discount}
                                        onChange={(e) => handleInputChange('discount', e.target.value)}
                                        placeholder="10"
                                        className="mt-2"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="startDate" className="text-sm font-medium">
                                        Start Date <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                                        className="mt-2"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="endDate" className="text-sm font-medium">
                                        End Date <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                                        className="mt-2"
                                        required
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label htmlFor="status" className="text-sm font-medium">
                                        Status <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value: 'Active' | 'Inactive') =>
                                            handleInputChange('status', value)
                                        }
                                    >
                                        <SelectTrigger className="mt-2 w-[200px]">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                            </div>

                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    );
}
