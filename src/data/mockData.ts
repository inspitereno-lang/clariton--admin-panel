import type { Product, Store } from '@/types';

export const initialProducts: Product[] = [
  {
    _id: '1',
    name: 'Oticon Real 1',
    description: 'Premium hearing aid with advanced noise reduction technology',
    price: 2450.00,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200'],
    category: 'BTE',
    stock: 12,
    brand: 'Oticon',
    sku: 'OT-RE-001',
    status: 'Active'
  },
  {
    _id: '2',
    name: 'Phonak Lumity Life',
    description: 'Waterproof rechargeable hearing aid for active lifestyles',
    price: 3100.00,
    images: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200'],
    category: 'ITE',
    stock: 2,
    brand: 'Phonak',
    sku: 'PH-LM-002',
    status: 'Active'
  },
  {
    _id: '3',
    name: 'Signia Pure Charge&Go',
    description: 'Rechargeable hearing aid with Bluetooth connectivity',
    price: 1899.00,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200'],
    category: 'RIC',
    stock: 24,
    brand: 'Signia',
    sku: 'SI-PC-005',
    status: 'Draft'
  },
  {
    _id: '4',
    name: 'Philips HearLink Charger',
    description: 'Portable charging case for Philips hearing aids',
    price: 149.00,
    images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200'],
    category: 'Accessory',
    stock: 0,
    brand: 'Philips',
    sku: 'PH-CH-001',
    status: 'OOS'
  },
  {
    _id: '5',
    name: 'Oticon More 1',
    description: 'AI-powered hearing aid with deep neural network',
    price: 2100.00,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200'],
    category: 'BTE',
    stock: 8,
    brand: 'Oticon',
    sku: 'OT-MO-001',
    status: 'Active'
  },
  {
    _id: '6',
    name: 'Widex Moment Sheer',
    description: 'Natural sound quality with zero delay',
    price: 2799.00,
    images: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200'],
    category: 'RIC',
    stock: 15,
    brand: 'Widex',
    sku: 'WI-MS-001',
    status: 'Active'
  },
  {
    _id: '7',
    name: 'ReSound ONE',
    description: 'Microphone and receiver-in-ear design',
    price: 2299.00,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200'],
    category: 'BTE',
    stock: 6,
    brand: 'ReSound',
    sku: 'RE-ON-001',
    status: 'Active'
  },
  {
    _id: '8',
    name: 'Starkey Evolv AI',
    description: 'Health tracking and fall detection features',
    price: 2599.00,
    images: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200'],
    category: 'ITE',
    stock: 10,
    brand: 'Starkey',
    sku: 'ST-EA-001',
    status: 'Active'
  }
];

export const initialStores: Store[] = [
  {
    _id: '1',
    name: 'Downtown Medical Plaza',
    address: '123 Health Ave, Suite 400',
    city: 'New York City',
    state: 'NY',
    zipCode: '10001',
    contactNumber: '+1 (555) 012-3456',
    email: 'downtown@claritone.com',
    images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200'],
    operatingHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '10:00', close: '14:00', closed: false },
      sunday: { open: '', close: '', closed: true }
    },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.217676750664!2d-73.98784408459418!3d40.75797467932688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1623456789012!5m2!1sen!2sus',
    status: 'Open'
  },
  {
    _id: '2',
    name: 'Northside Wellness Center',
    address: '456 Wellness Blvd',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60614',
    contactNumber: '+1 (555) 012-7890',
    email: 'northside@claritone.com',
    images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200'],
    operatingHours: {
      monday: { open: '08:30', close: '17:30', closed: false },
      tuesday: { open: '08:30', close: '17:30', closed: false },
      wednesday: { open: '08:30', close: '17:30', closed: false },
      thursday: { open: '08:30', close: '17:30', closed: false },
      friday: { open: '08:30', close: '17:30', closed: false },
      saturday: { open: '09:00', close: '13:00', closed: false },
      sunday: { open: '', close: '', closed: true }
    },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d190256.09898647338!2d-87.87204658224992!3d41.83364746946363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2c3cd0f4cbed%3A0xafe0a6ad09c0c000!2sChicago%2C%20IL!5e0!3m2!1sen!2sus!4v1623456789012!5m2!1sen!2sus',
    status: 'Open'
  },
  {
    _id: '3',
    name: 'Eastwood Clinic',
    address: '789 Care Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94103',
    contactNumber: '+1 (555) 012-5555',
    email: 'eastwood@claritone.com',
    images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200'],
    operatingHours: {
      monday: { open: '10:00', close: '19:00', closed: false },
      tuesday: { open: '10:00', close: '19:00', closed: false },
      wednesday: { open: '10:00', close: '19:00', closed: false },
      thursday: { open: '10:00', close: '19:00', closed: false },
      friday: { open: '10:00', close: '19:00', closed: false },
      saturday: { open: '11:00', close: '16:00', closed: false },
      sunday: { open: '', close: '', closed: true }
    },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.98555096471!2d-122.50764017948502!3d37.75780956920463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1623456789012!5m2!1sen!2sus',
    status: 'Closed'
  },
  {
    _id: '4',
    name: 'Riverfront Hearing Center',
    address: '321 River Road',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    contactNumber: '+1 (555) 012-9988',
    email: 'riverfront@claritone.com',
    images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200'],
    operatingHours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '', close: '', closed: true },
      sunday: { open: '', close: '', closed: true }
    },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d220448.68406653356!2d-97.892858852727!3d30.30798271066147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644b599a0cc032f%3A0x5d9b464bd469d57a!2sAustin%2C%20TX!5e0!3m2!1sen!2sus!4v1623456789012!5m2!1sen!2sus',
    status: 'Renovation'
  },
  {
    _id: '5',
    name: 'Metro West Hub',
    address: '555 Metro Parkway',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    contactNumber: '+1 (555) 012-7722',
    email: 'metrowest@claritone.com',
    images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200'],
    operatingHours: {
      monday: { open: '08:00', close: '16:00', closed: false },
      tuesday: { open: '08:00', close: '16:00', closed: false },
      wednesday: { open: '08:00', close: '16:00', closed: false },
      thursday: { open: '08:00', close: '16:00', closed: false },
      friday: { open: '08:00', close: '16:00', closed: false },
      saturday: { open: '09:00', close: '12:00', closed: false },
      sunday: { open: '', close: '', closed: true }
    },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d172139.09069263127!2d-122.34206435645866!3d47.61302835299027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5490102c93e83355%3A0x102565466944d59a!2sSeattle%2C%20WA!5e0!3m2!1sen!2sus!4v1623456789012!5m2!1sen!2sus',
    status: 'Open'
  },
];

export const brands = ['Oticon', 'Phonak', 'Signia', 'Philips', 'Widex', 'ReSound', 'Starkey'];

export const categories = ['BTE', 'ITE', 'RIC', 'IIC', 'Accessory'];
