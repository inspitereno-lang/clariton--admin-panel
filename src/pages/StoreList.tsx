import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, Store, Clock, MapPin, Calendar } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import type { Store as StoreType } from '@/types';

interface StoreListProps {
  stores: StoreType[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: any) => void;
}

export function StoreList({ stores, onDelete, onUpdate }: StoreListProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<string | null>(null);

  // Sync state with URL params
  useEffect(() => {
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    if (status) setSelectedStatus(status);
    if (search) setSearchQuery(search);
  }, [searchParams]);

  const itemsPerPage = 5;

  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      const matchesSearch =
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus === 'all' || store.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [stores, searchQuery, selectedStatus]);

  const totalPages = Math.ceil(filteredStores.length / itemsPerPage);
  const paginatedStores = filteredStores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteClick = (id: string) => {
    setStoreToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (storeToDelete) {
      onDelete(storeToDelete);
      setStoreToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-700';
      case 'Closed':
        return 'bg-red-100 text-red-700';
      case 'Renovation':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatOperatingHours = (store: StoreType) => {
    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;
    const weekdayHours = store.operatingHours.monday;

    if (weekdays.every(day =>
      store.operatingHours[day].open === weekdayHours.open &&
      store.operatingHours[day].close === weekdayHours.close &&
      store.operatingHours[day].closed === weekdayHours.closed
    )) {
      if (weekdayHours.closed) return 'Mon-Fri: Closed';
      return `Mon-Fri: ${weekdayHours.open} - ${weekdayHours.close}`;
    }

    return 'View details';
  };

  const stats = [
    { label: 'Total Locations', value: stores.length, icon: Store, color: 'bg-red-50 text-red-600', status: 'all' },
    { label: 'Open Stores', value: stores.filter(s => s.status === 'Open').length, icon: Store, color: 'bg-green-50 text-green-600', status: 'Open' },
    { label: 'Under Renovation', value: stores.filter(s => s.status === 'Renovation').length, icon: Store, color: 'bg-yellow-50 text-yellow-600', status: 'Renovation' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Store Management"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Store Locations' }]}
      />

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`border-0 shadow-sm cursor-pointer transition-all hover:shadow-md ${selectedStatus === stat.status ? 'ring-2 ring-red-500' : ''}`}
              onClick={() => {
                if (stat.status === 'all') {
                  setSelectedStatus('all');
                  navigate('/stores');
                } else {
                  setSelectedStatus(stat.status);
                  navigate(`/stores?status=${stat.status}`);
                }
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Add */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search stores..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {(searchQuery || selectedStatus !== 'all') && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStatus('all');
                    navigate('/stores');
                  }}
                  className="text-gray-500"
                >
                  Clear
                </Button>
              )}
              <Button
                className="bg-red-500 hover:bg-red-600 text-white ml-auto"
                onClick={() => navigate('/stores/add')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Store
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stores Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">NAME</TableHead>
                  <TableHead className="font-semibold text-gray-700">LOCATION</TableHead>
                  <TableHead className="font-semibold text-gray-700">CONTACT</TableHead>
                  <TableHead className="font-semibold text-gray-700">OPERATING HOURS</TableHead>
                  <TableHead className="font-semibold text-gray-700">STATUS</TableHead>
                  <TableHead className="font-semibold text-gray-700">STATUS MODE</TableHead>
                  <TableHead className="font-semibold text-gray-700">APPOINTMENTS</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStores.map((store) => (
                  <TableRow key={store._id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                          {store.images[0] ? (
                            <img
                              src={store.images[0]}
                              alt={store.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Store className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{store.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-900">{store.city}</p>
                          <p className="text-xs text-gray-500">{store.state}, {store.zipCode}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-900">{store.contactNumber}</p>
                      <p className="text-xs text-gray-500">{store.email}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{formatOperatingHours(store)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(store.status)}`}>
                        {store.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={store.statusMode === 'Auto'}
                          onCheckedChange={(checked) => {
                            onUpdate(store._id, { statusMode: checked ? 'Auto' : 'Manual' });
                          }}
                        />
                        <Badge variant={store.statusMode === 'Auto' ? 'default' : 'outline'} className={store.statusMode === 'Auto' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : ''}>
                          {store.statusMode === 'Auto' ? 'Auto' : 'Manual'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        onClick={() => navigate(`/appointments?storeId=${store._id}&storeName=${encodeURIComponent(store.name)}`)}
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => navigate(`/stores/edit/${store._id}`)}
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteClick(store._id)}
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

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredStores.length)} of {filteredStores.length} results
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    className={currentPage === page ? 'bg-red-500 hover:bg-red-600' : ''}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
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
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the store location.
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
