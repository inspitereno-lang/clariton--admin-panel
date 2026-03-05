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
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, Upload, Store, Clock, MapPin, Navigation } from 'lucide-react';
import type { Store as StoreType, OperatingHours } from '@/types';

interface StoreFormProps {
  stores: StoreType[];
  onSave: (store: FormData, id?: string) => void;
}

const defaultOperatingHours: OperatingHours = {
  monday: { open: '09:00', close: '18:00', closed: false },
  tuesday: { open: '09:00', close: '18:00', closed: false },
  wednesday: { open: '09:00', close: '18:00', closed: false },
  thursday: { open: '09:00', close: '18:00', closed: false },
  friday: { open: '09:00', close: '18:00', closed: false },
  saturday: { open: '10:00', close: '14:00', closed: false },
  sunday: { open: '', close: '', closed: true }
};

const daysOfWeek = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
] as const;

export function StoreForm({ stores, onSave }: StoreFormProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<{
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    contactNumber: string;
    email: string;
    status: 'Open' | 'Closed' | 'Renovation';
    statusMode: 'Auto' | 'Manual';
    mapUrl: string;
    images: (string | File)[];
    operatingHours: OperatingHours;
  }>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    contactNumber: '',
    email: '',
    status: 'Open',
    statusMode: 'Auto',
    mapUrl: '',
    images: [],
    operatingHours: defaultOperatingHours
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    if (isEdit && id) {
      const store = stores.find(s => s._id === id);
      if (store) {
        setFormData({
          name: store.name,
          address: store.address,
          city: store.city,
          state: store.state,
          zipCode: store.zipCode,
          contactNumber: store.contactNumber,
          email: store.email,
          status: store.status,
          statusMode: store.statusMode || 'Auto',
          mapUrl: store.mapUrl,
          images: store.images,
          operatingHours: store.operatingHours
        });
        setPreviewImages(store.images);
      }
    }
  }, [isEdit, id, stores]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOperatingHoursChange = (
    day: keyof OperatingHours,
    field: 'open' | 'close' | 'closed',
    value: string | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileList = Array.from(files);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...fileList] }));

      fileList.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('address', formData.address);
    data.append('city', formData.city);
    data.append('state', formData.state);
    data.append('zipCode', formData.zipCode);
    data.append('contactNumber', formData.contactNumber);
    data.append('email', formData.email);
    data.append('status', formData.status);
    data.append('statusMode', formData.statusMode);
    data.append('mapUrl', formData.mapUrl || 'https://www.google.com/maps/embed');

    // Transform operating hours object to array for backend
    const hoursArray = Object.entries(formData.operatingHours).map(([day, value]) => ({
      day: day.charAt(0).toUpperCase() + day.slice(1),
      time: value.closed ? 'Closed' : `${value.open} - ${value.close}`
    }));
    data.append('hours', JSON.stringify(hoursArray));

    formData.images.forEach((image) => {
      if (image instanceof File) {
        data.append('images', image);
      } else {
        data.append('existingImages', image);
      }
    });

    data.append('imagesUpdated', 'true');
    onSave(data, id);
    navigate('/stores');
  };

  const autoDetectLocation = () => {
    // Simulate auto-detection with a sample map URL
    if (formData.address && formData.city) {
      // In a real app, you would use a geocoding API here
      // const query = encodeURIComponent(`${formData.address}, ${formData.city}, ${formData.state}`);
      setFormData(prev => ({
        ...prev,
        mapUrl: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.217676750664!2d-73.98784408459418!3d40.75797467932688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ1JzI4LjciTiA3M8KwNTknMTIuMiJX!5e0!3m2!1sen!2sus!4v1623456789012!5m2!1sen!2sus`
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={isEdit ? 'Edit Store Location' : 'Add New Store Location'}
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Store Locations', path: '/stores' },
          { label: isEdit ? 'Edit' : 'Add New' }
        ]}
      />

      <div className="p-8">
        <form onSubmit={handleSubmit}>
          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/stores')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isEdit ? 'Update Location' : 'Save Location'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Store Details */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Store className="w-5 h-5 text-red-500" />
                    Store Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g. Downtown Medical Plaza"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-sm font-medium">
                      Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="e.g. 123 Health Ave, Suite 400"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="city" className="text-sm font-medium">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="City Name"
                        className="mt-2"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="state" className="text-sm font-medium">
                        State / Province
                      </Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="State"
                        className="mt-2"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="zipCode" className="text-sm font-medium">
                        Zip / Postal Code
                      </Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        placeholder="00000"
                        className="mt-2"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactNumber" className="text-sm font-medium">
                        Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="contactNumber"
                          value={formData.contactNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                            handleInputChange('contactNumber', value);
                          }}
                          onWheel={(e) => e.currentTarget.blur()}
                          placeholder="Enter 10-digit number"
                          className="pr-10"
                          required
                        />
                      </div>
                      {formData.contactNumber && formData.contactNumber.length < 10 && (
                        <p className="text-xs text-red-500 mt-1">Please enter a valid 10-digit number</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="store@claritone.com"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-sm font-medium">
                      Status <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.status}
                      disabled={formData.statusMode === 'Auto'}
                      onValueChange={(value: 'Open' | 'Closed' | 'Renovation') =>
                        setFormData(prev => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                        <SelectItem value="Renovation">Renovation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="statusMode" className="text-sm font-medium">
                      Status Mode <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.statusMode}
                      onValueChange={(value: 'Auto' | 'Manual') =>
                        setFormData(prev => ({ ...prev, statusMode: value }))
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Auto">Automatic (Follows Schedule)</SelectItem>
                        <SelectItem value="Manual">Manual Override</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-400 mt-1">
                      {formData.statusMode === 'Auto'
                        ? "Store status will automatically change based on operating hours."
                        : "Store status will remain fixed regardless of operating hours."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Operating Hours */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-red-500" />
                    Operating Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {daysOfWeek.map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-4">
                        <span className="w-24 text-sm font-medium text-gray-700">{label}</span>
                        <div className="flex items-center gap-3 flex-1">
                          <Checkbox
                            checked={formData.operatingHours[key].closed}
                            onCheckedChange={(checked) =>
                              handleOperatingHoursChange(key, 'closed', checked as boolean)
                            }
                          />
                          <span className="text-sm text-gray-600">Closed</span>
                        </div>
                        {!formData.operatingHours[key].closed && (
                          <>
                            <Input
                              type="time"
                              value={formData.operatingHours[key].open}
                              onChange={(e) => handleOperatingHoursChange(key, 'open', e.target.value)}
                              className="w-32"
                            />
                            <span className="text-gray-400">-</span>
                            <Input
                              type="time"
                              value={formData.operatingHours[key].close}
                              onChange={(e) => handleOperatingHoursChange(key, 'close', e.target.value)}
                              className="w-32"
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Map Location */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-500" />
                    Map Location
                  </CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={autoDetectLocation}
                  >
                    <Navigation className="w-4 h-4 mr-1" />
                    Auto-detect from Address
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  <div>
                    <Label htmlFor="mapUrl" className="text-sm font-medium">
                      Google Maps Embed Link / URL
                    </Label>
                    <Input
                      id="mapUrl"
                      value={formData.mapUrl}
                      onChange={(e) => handleInputChange('mapUrl', e.target.value)}
                      placeholder="https://www.google.com/maps/embed..."
                      className="mt-2"
                      required
                    />
                  </div>
                  {formData.mapUrl && (
                    <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
                      <iframe
                        src={formData.mapUrl}
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Store Location"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Store Images */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="w-5 h-5 text-red-500" />
                    Store Photo
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-red-300 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="text-red-500 font-medium">Upload a file</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="store-image-upload"
                    />
                    <Label
                      htmlFor="store-image-upload"
                      className="mt-4 inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 cursor-pointer transition-colors"
                    >
                      Choose Files
                    </Label>
                  </div>

                  {previewImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {previewImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
