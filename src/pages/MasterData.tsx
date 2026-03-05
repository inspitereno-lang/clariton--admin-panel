import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Clock, Languages, Plus, Trash2, Database } from 'lucide-react';
import { slotService } from '@/services/slotService';
import { languageService } from '@/services/languageService';
import { toast } from 'sonner';

interface Item {
    _id: string;
    time?: string;
    name?: string;
    createdAt: string;
}

export default function MasterData() {
    const [slots, setSlots] = useState<Item[]>([]);
    const [languages, setLanguages] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [newItemValue, setNewItemValue] = useState('');
    const [newSlotStart, setNewSlotStart] = useState('');
    const [newSlotEnd, setNewSlotEnd] = useState('');
    const [startPeriod, setStartPeriod] = useState('AM');
    const [endPeriod, setEndPeriod] = useState('PM');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'slot' | 'language' } | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [slotsRes, langsRes] = await Promise.all([
                slotService.getSlots(),
                languageService.getLanguages()
            ]);
            if (slotsRes.success) setSlots(slotsRes.data);
            if (langsRes.success) setLanguages(langsRes.data);
        } catch (error: any) {
            toast.error('Failed to fetch master data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const parseTimeToMinutes = (timeStr: string) => {
        const [time, period] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
        return hours * 60 + minutes;
    };

    const handleCreate = async (type: 'slot' | 'language') => {
        if (type === 'slot') {
            if (!newSlotStart.trim() || !newSlotEnd.trim()) {
                toast.error('Please enter both start and end times');
                return;
            }

            const startTimeStr = `${newSlotStart} ${startPeriod}`;
            const endTimeStr = `${newSlotEnd} ${endPeriod}`;
            const startMins = parseTimeToMinutes(startTimeStr);
            const endMins = parseTimeToMinutes(endTimeStr);

            let duration = endMins - startMins;
            if (duration < 0) duration += 24 * 60;

            if (duration > 90) {
                toast.error(`Slot duration (${duration} mins) exceeds the 90-minute limit`);
                return;
            }

            if (duration <= 0) {
                toast.error("End time must be after start time");
                return;
            }
        } else if (!newItemValue.trim()) {
            toast.error('Please enter a value');
            return;
        }

        try {
            setLoading(true);
            let res;
            if (type === 'slot') {
                res = await slotService.addSlot(
                    `${newSlotStart} ${startPeriod}`,
                    `${newSlotEnd} ${endPeriod}`
                );
            } else {
                res = await languageService.addLanguage(newItemValue);
            }

            if (res.success) {
                toast.success(`${type === 'slot' ? 'Slot' : 'Language'} created successfully`);
                if (type === 'slot') {
                    setNewSlotStart('');
                    setNewSlotEnd('');
                } else {
                    setNewItemValue('');
                }
                fetchData();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to create ${type}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id: string, type: 'slot' | 'language') => {
        setItemToDelete({ id, type });
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        try {
            setLoading(true);
            let res;
            if (itemToDelete.type === 'slot') {
                res = await slotService.deleteSlot(itemToDelete.id);
            } else {
                res = await languageService.deleteLanguage(itemToDelete.id);
            }

            if (res.success) {
                toast.success(`${itemToDelete.type === 'slot' ? 'Slot' : 'Language'} deleted successfully`);
                fetchData();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to delete ${itemToDelete.type}`);
        } finally {
            setLoading(false);
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                title="Master Data"
                breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Master Data' }]}
            />

            <div className="p-8 max-w-5xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Database className="w-6 h-6 text-red-500" />
                        Master Data Management
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Maintain the core values used for appointments and throughout the system.
                    </p>
                </div>

                <Tabs defaultValue="slots" className="space-y-6">
                    <TabsList className="bg-white p-1 border border-gray-200 shadow-sm rounded-lg h-12">
                        <TabsTrigger value="slots" className="px-8 flex items-center gap-2 h-full rounded-md data-[state=active]:bg-red-500 data-[state=active]:text-white">
                            <Clock className="w-4 h-4" />
                            Appointment Slots
                        </TabsTrigger>
                        <TabsTrigger value="languages" className="px-8 flex items-center gap-2 h-full rounded-md data-[state=active]:bg-red-500 data-[state=active]:text-white">
                            <Languages className="w-4 h-4" />
                            Languages
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="slots" className="animate-in fade-in-50 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="md:col-span-1 border-0 shadow-sm h-fit">
                                <CardHeader>
                                    <CardTitle className="text-lg">Add New Slot</CardTitle>
                                    <CardDescription>Enter start and end times</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="slot-start">Start Time</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="slot-start"
                                                placeholder="e.g., 09:00"
                                                value={newSlotStart}
                                                onChange={(e) => setNewSlotStart(e.target.value)}
                                                className="flex-1"
                                            />
                                            <Select value={startPeriod} onValueChange={setStartPeriod}>
                                                <SelectTrigger className="w-[80px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="AM">AM</SelectItem>
                                                    <SelectItem value="PM">PM</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="slot-end">End Time</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="slot-end"
                                                placeholder="e.g., 10:00"
                                                value={newSlotEnd}
                                                onChange={(e) => setNewSlotEnd(e.target.value)}
                                                className="flex-1"
                                            />
                                            <Select value={endPeriod} onValueChange={setEndPeriod}>
                                                <SelectTrigger className="w-[80px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="AM">AM</SelectItem>
                                                    <SelectItem value="PM">PM</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full bg-red-500 hover:bg-red-600 text-white"
                                        disabled={loading}
                                        onClick={() => handleCreate('slot')}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Slot
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="md:col-span-2 border-0 shadow-sm">
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50/50">
                                                <TableHead className="w-[100px]">#</TableHead>
                                                <TableHead>TIME SLOT</TableHead>
                                                <TableHead className="text-right">ACTION</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {slots.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center py-8 text-gray-500 font-medium h-[300px]">
                                                        {loading ? 'Refreshing...' : 'No slots discovered'}
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                slots.map((slot, index) => (
                                                    <TableRow key={slot._id} className="hover:bg-gray-50/50 transition-colors">
                                                        <TableCell className="font-medium text-gray-400">
                                                            {(index + 1).toString().padStart(2, '0')}
                                                        </TableCell>
                                                        <TableCell className="font-semibold text-gray-700">
                                                            {slot.time}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full w-8 h-8 p-0"
                                                                onClick={() => handleDeleteClick(slot._id, 'slot')}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="languages" className="animate-in fade-in-50 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="md:col-span-1 border-0 shadow-sm h-fit">
                                <CardHeader>
                                    <CardTitle className="text-lg">Add New Language</CardTitle>
                                    <CardDescription>e.g., English, Hindi, Arabic</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="lang-name">Language Name</Label>
                                        <Input
                                            id="lang-name"
                                            placeholder="Enter language name"
                                            value={newItemValue}
                                            onChange={(e) => setNewItemValue(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        className="w-full bg-red-500 hover:bg-red-600 text-white"
                                        disabled={loading}
                                        onClick={() => handleCreate('language')}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Language
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="md:col-span-2 border-0 shadow-sm">
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50/50">
                                                <TableHead className="w-[100px]">#</TableHead>
                                                <TableHead>LANGUAGE NAME</TableHead>
                                                <TableHead className="text-right">ACTION</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {languages.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center py-8 text-gray-500 font-medium h-[300px]">
                                                        {loading ? 'Refreshing...' : 'No languages discovered'}
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                languages.map((lang, index) => (
                                                    <TableRow key={lang._id} className="hover:bg-gray-50/50 transition-colors">
                                                        <TableCell className="font-medium text-gray-400">
                                                            {(index + 1).toString().padStart(2, '0')}
                                                        </TableCell>
                                                        <TableCell className="font-semibold text-gray-700">
                                                            {lang.name}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full w-8 h-8 p-0"
                                                                onClick={() => handleDeleteClick(lang._id, 'language')}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will permanently delete the selected {itemToDelete?.type}.
                            This could affect existing data that references this item.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            Confirm Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
