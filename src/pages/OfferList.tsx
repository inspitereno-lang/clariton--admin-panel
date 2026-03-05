import { useState, useMemo, useEffect } from 'react';
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
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { useOfferStore } from '@/hooks/useOfferStore';

export function OfferList() {
    const navigate = useNavigate();
    const { offers, fetchOffers, deleteOffer, isLoading } = useOfferStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [offerToDelete, setOfferToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchOffers();
    }, []);

    const itemsPerPage = 10;

    const filteredOffers = useMemo(() => {
        return offers.filter(offer => {
            const matchTitle = offer.title?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchProduct = offer.product?.name?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchTitle || matchProduct;
        });
    }, [offers, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredOffers.length / itemsPerPage));
    const paginatedOffers = filteredOffers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDeleteClick = (id: string) => {
        setOfferToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (offerToDelete) {
            await deleteOffer(offerToDelete);
            setOfferToDelete(null);
            setDeleteDialogOpen(false);
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                title="Offers"
                breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Offers' }]}
            />

            <div className="p-8">
                <Card className="border-0 shadow-sm mb-6">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="relative flex-1 min-w-[300px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search offers by title or product name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <Button
                                className="bg-red-500 hover:bg-red-600 text-white ml-auto"
                                onClick={() => navigate('/offers/add')}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Offer
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                        {isLoading && offers.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">Loading offers...</div>
                        ) : offers.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No offers found</div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                                            <TableHead className="font-semibold text-gray-700">OFFER TITLE</TableHead>
                                            <TableHead className="font-semibold text-gray-700">PRODUCT</TableHead>
                                            <TableHead className="font-semibold text-gray-700">DISCOUNT</TableHead>
                                            <TableHead className="font-semibold text-gray-700">VALIDITY</TableHead>
                                            <TableHead className="font-semibold text-gray-700">STATUS</TableHead>
                                            <TableHead className="font-semibold text-gray-700 text-right">ACTIONS</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedOffers.map((offer) => (
                                            <TableRow key={offer._id} className="hover:bg-gray-50">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                                                            <Tag className="w-5 h-5 text-red-500" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{offer.title}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    {offer.product ? (
                                                        <div className="flex items-center gap-2">
                                                            {offer.product.images?.[0] && (
                                                                <img src={offer.product.images[0]} alt={offer.product.name} className="w-8 h-8 rounded object-cover" />
                                                            )}
                                                            <span>{offer.product.name}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-red-500 italic">No Valid Product Attached</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium text-gray-900">
                                                    {offer.discountType === 'percentage' ? `${offer.discount}% OFF` : `₹${offer.discount} OFF`}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {new Date(offer.startDate).toLocaleDateString()} - <br />
                                                    {new Date(offer.endDate).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
                                                        {offer.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            onClick={() => navigate(`/offers/edit/${offer._id}`)}
                                                        >
                                                            <Edit2 className="w-4 h-4 mr-1" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleDeleteClick(offer._id)}
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-1" />
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-500">
                                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOffers.length)} of {filteredOffers.length} results
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
                                        <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the offer.
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
