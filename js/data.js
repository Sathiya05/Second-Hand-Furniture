/* =========================================================
   NestMarket — Demo data (frontend-only, no backend)
   ========================================================= */

const IMG = (id, w) => `./images/${id}.jpg`;
const IMG_PX = (id, w) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w || 900}`;

const NM_CATEGORIES = [
  { key: 'Sofas',   label: 'Sofas & Seating',    count: 128, icon: 'sofa',
    image: './images/photo-1555041469-a586c61ea9bc.jpg' },
  { key: 'Tables',  label: 'Tables',             count: 96,  icon: 'table',
    image: IMG_PX(14715769, 700) },
  { key: 'Beds',    label: 'Beds & Bedroom',     count: 74,  icon: 'bed',
    image: './images/photo-1505693416388-ac5ce068fe85.jpg' },
  { key: 'Storage', label: 'Storage',            count: 63,  icon: 'storage',
    image: './images/photo-1594026112284-02bb6f3352fe.jpg' },
  { key: 'Decor',   label: 'Home Decor',         count: 88,  icon: 'decor',
    image: './images/photo-1513506003901-1e6a229e2d15.jpg' },
  { key: 'Office',  label: 'Office Furniture',   count: 52,  icon: 'office',
    image: IMG_PX(7658310, 700) },
  { key: 'Kitchen', label: 'Kitchen & Dining',   count: 71,  icon: 'kitchen',
    image: './images/photo-1556911220-bff31c812dba.jpg' },
  { key: 'Outdoor', label: 'Outdoor Furniture',  count: 34,  icon: 'outdoor',
    image: IMG_PX(12715508, 700) }
];

const NM_LOCATIONS = ['Hosur', 'Bangalore', 'Chennai', 'Krishnagiri', 'Salem', 'Dharmapuri'];

const NM_PRICE_BANDS = [
  { key: 'u2',    label: 'Under ₹2,000',        min: 0,    max: 1999 },
  { key: '2to5',  label: '₹2,000 – ₹5,000',     min: 2000, max: 5000 },
  { key: '5to10', label: '₹5,000 – ₹10,000',    min: 5001, max: 10000 },
  { key: '10to25',label: '₹10,000 – ₹25,000',   min: 10001, max: 25000 },
  { key: '25p',   label: '₹25,000+',            min: 25001, max: Infinity }
];

const NM_CONDITIONS = ['Like New', 'Good', 'Fair', 'Needs Repair'];

const NM_DISTANCE_BANDS = [
  { key: '5',  label: 'Under 5 km',  max: 5 },
  { key: '10', label: 'Under 10 km', max: 10 },
  { key: '25', label: 'Under 25 km', max: 25 },
  { key: 'any',label: 'Any Distance',max: Infinity }
];

const NM_SELLER_TYPES = ['Individual', 'Dealer'];

const NM_LISTINGS = [
  {
    id: 1,
    title: 'Solid Wood Dining Table',
    category: 'Tables',
    price: 8500,
    location: 'Hosur',
    area: 'Sampigehalli',
    pincode: '635109',
    condition: 'Good',
    distance: 2.4,
    seller: 'Priya S.',
    sellerType: 'Individual',
    sellerSince: 'Member since 2024',
    sellerResponse: 'Responds within a few hours',
    posted: '2 days ago',
    postedDays: 2,
    negotiable: true,
    featured: true,
    views: 214,
    image: IMG('photo-1577140917170-285929fb55b7'),
    gallery: [
      IMG('photo-1577140917170-285929fb55b7', 1200),
      IMG_PX(4119832, 1200),
      IMG_PX(18823960, 1200),
      IMG_PX(5990698, 1200)
    ],
    description: 'Solid wood dining table in good condition. Minor signs of use but structurally strong. Seats six comfortably and has been kept in a smoke-free home.',
    details: { Material: 'Solid Wood', Seating: '6 People', Dimensions: '180 × 90 cm', Age: '3 Years', Pickup: 'Available', Delivery: 'Discuss with seller' },
    pickup: true, delivery: true
  },
  {
    id: 2,
    title: '3-Seater Fabric Sofa',
    category: 'Sofas',
    price: 12000,
    location: 'Bangalore',
    area: 'HSR Layout',
    pincode: '560102',
    condition: 'Good',
    distance: 5.8,
    seller: 'Arun K.',
    sellerType: 'Individual',
    sellerSince: 'Member since 2023',
    sellerResponse: 'Responds within a day',
    posted: '4 days ago',
    postedDays: 4,
    negotiable: true,
    featured: true,
    views: 341,
    image: IMG('photo-1555041469-a586c61ea9bc'),
    gallery: [
      IMG('photo-1555041469-a586c61ea9bc', 1200),
      IMG('photo-1493663284031-b7e3aefcae8e', 1200),
      IMG('photo-1586023492125-27b2c045efd7', 1200)
    ],
    description: 'Comfortable three-seater fabric sofa, well maintained. No tears or stains. Moving out soon so it needs a new home.',
    details: { Material: 'Fabric / Foam', Seating: '3 People', Dimensions: '200 × 85 cm', Age: '2 Years', Pickup: 'Available', Delivery: 'Discuss with seller' },
    pickup: true, delivery: false
  },
  {
    id: 3,
    title: 'Queen Size Bed with Storage',
    category: 'Beds',
    price: 9500,
    location: 'Chennai',
    area: 'Velachery',
    pincode: '600042',
    condition: 'Like New',
    distance: 12.6,
    seller: 'Meena R.',
    sellerType: 'Individual',
    sellerSince: 'Member since 2025',
    sellerResponse: 'Responds within a few hours',
    posted: '1 day ago',
    postedDays: 1,
    negotiable: false,
    featured: true,
    views: 189,
    image: IMG('photo-1505693416388-ac5ce068fe85'),
    gallery: [
      IMG('photo-1505693416388-ac5ce068fe85', 1200),
      IMG_PX(5644712, 1200),
      IMG('photo-1522771739844-6a9f6d5f14af', 1200)
    ],
    description: 'Barely used queen size bed with hydraulic storage. Mattress can be included on discussion. Sturdy frame with no wobble.',
    details: { Material: 'Engineered Wood', Seating: '—', Dimensions: '78 × 60 in', Age: '8 Months', Pickup: 'Available', Delivery: 'Available at extra cost' },
    pickup: true, delivery: true
  },
  {
    id: 4,
    title: 'Compact Study Table',
    category: 'Office',
    price: 2500,
    location: 'Hosur',
    area: 'Krishnagiri Road',
    pincode: '635109',
    condition: 'Fair',
    distance: 3.1,
    seller: 'Karthik V.',
    sellerType: 'Individual',
    sellerSince: 'Member since 2024',
    sellerResponse: 'Responds within a day',
    posted: '6 days ago',
    postedDays: 6,
    negotiable: true,
    featured: false,
    views: 97,
    image: './images/Compact Study Table.avif',
    gallery: [
      './images/Compact Study Table.avif',
      IMG_PX(36123565, 1200)
    ],
    description: 'Simple study table with one drawer. Surface has some scratches but is perfectly usable for students.',
    details: { Material: 'Plywood', Seating: '—', Dimensions: '100 × 60 cm', Age: '4 Years', Pickup: 'Available', Delivery: 'Not available' },
    pickup: true, delivery: false
  },
  {
    id: 5,
    title: 'Solid Wood Bookshelf',
    category: 'Storage',
    price: 4500,
    location: 'Hosur',
    area: 'Bargur',
    pincode: '635104',
    condition: 'Good',
    distance: 2.4,
    seller: 'Priya S.',
    sellerType: 'Individual',
    sellerSince: 'Member since 2024',
    sellerResponse: 'Responds within a few hours',
    posted: '3 days ago',
    postedDays: 3,
    negotiable: true,
    featured: true,
    views: 156,
    image: IMG_PX(35269123),
    gallery: [
      IMG_PX(35269123, 1200),
      IMG_PX(8045884, 1200)
    ],
    description: 'Five-shelf solid wood bookshelf. Holds a good number of books and showpieces. Cleaned and ready to move.',
    details: { Material: 'Teak Wood', Seating: '—', Dimensions: '90 × 30 × 180 cm', Age: '5 Years', Pickup: 'Available', Delivery: 'Discuss with seller' },
    pickup: true, delivery: true
  },
  {
    id: 6,
    title: 'Vintage Teak Armchair',
    category: 'Sofas',
    price: 3200,
    location: 'Krishnagiri',
    area: 'College Road',
    pincode: '635001',
    condition: 'Good',
    distance: 8.2,
    seller: 'Divya N.',
    sellerType: 'Individual',
    sellerSince: 'Member since 2025',
    sellerResponse: 'Responds within a day',
    posted: '5 days ago',
    postedDays: 5,
    negotiable: true,
    featured: false,
    views: 132,
    image: IMG_PX(13813929),
    gallery: [
      IMG_PX(13813929, 1200)
    ],
    description: 'Classic teak armchair with curved arms and a cushioned seat, works beautifully in a living room or reading corner. Cushion included.',
    details: { Material: 'Teak Wood', Seating: '1 Person', Dimensions: '68 × 74 cm', Age: '6 Years', Pickup: 'Available', Delivery: 'Not available' },
    pickup: true, delivery: false
  },
  {
    id: 7,
    title: 'TV Unit with Drawers',
    category: 'Storage',
    price: 5500,
    location: 'Salem',
    area: 'Fairlands',
    pincode: '636016',
    condition: 'Good',
    distance: 4.7,
    seller: 'Rahul M.',
    sellerType: 'Dealer',
    sellerSince: 'Member since 2022',
    sellerResponse: 'Responds within a few hours',
    posted: '1 week ago',
    postedDays: 7,
    negotiable: true,
    featured: false,
    views: 203,
    image: IMG_PX(13141770),
    gallery: [
      IMG_PX(13141770, 1200),
      IMG('photo-1618221195710-dd6b41faaea6', 1200)
    ],
    description: 'Spacious TV unit with two drawers and an open shelf for set-top boxes. Fits televisions up to 55 inches.',
    details: { Material: 'Engineered Wood', Seating: '—', Dimensions: '150 × 40 cm', Age: '3 Years', Pickup: 'Available', Delivery: 'Available at extra cost' },
    pickup: true, delivery: true
  },
  {
    id: 8,
    title: 'Low Wooden Coffee Table',
    category: 'Tables',
    price: 2200,
    location: 'Bangalore',
    area: 'Indiranagar',
    pincode: '560038',
    condition: 'Fair',
    distance: 6.5,
    seller: 'Sneha P.',
    sellerType: 'Individual',
    sellerSince: 'Member since 2024',
    sellerResponse: 'Responds within a day',
    posted: '9 days ago',
    postedDays: 9,
    negotiable: true,
    featured: false,
    views: 88,
    image: IMG_PX(16933766),
    gallery: [
      IMG_PX(16933766, 1200),
      IMG_PX(28055261, 1200)
    ],
    description: 'Round low coffee table with a warm wood finish. A few ring marks on top, otherwise sturdy and charming.',
    details: { Material: 'Mango Wood', Seating: '—', Dimensions: '80 cm diameter', Age: '4 Years', Pickup: 'Available', Delivery: 'Not available' },
    pickup: true, delivery: false
  },
  {
    id: 9,
    title: 'L-Shaped Sectional Sofa',
    category: 'Sofas',
    price: 18500,
    location: 'Chennai',
    area: 'Adyar',
    pincode: '600020',
    condition: 'Like New',
    distance: 11.2,
    seller: 'Vikram D.',
    sellerType: 'Dealer',
    sellerSince: 'Member since 2021',
    sellerResponse: 'Responds within a few hours',
    posted: '2 days ago',
    postedDays: 2,
    negotiable: true,
    featured: true,
    views: 402,
    image: IMG_PX(6758245),
    gallery: [
      IMG_PX(6758245, 1200),
      IMG('photo-1554995207-c18c203602cb', 1200),
      IMG_PX(7601374, 1200)
    ],
    description: 'Large L-shaped sectional in excellent condition. Firm cushions, removable covers, and a chaise on the left side.',
    details: { Material: 'Fabric / Wood Frame', Seating: '5 People', Dimensions: '270 × 180 cm', Age: '1 Year', Pickup: 'Available', Delivery: 'Available at extra cost' },
    pickup: true, delivery: true
  },
  {
    id: 10,
    title: 'Ergonomic Office Chair',
    category: 'Office',
    price: 4800,
    location: 'Hosur',
    area: 'Attibele',
    pincode: '635103',
    condition: 'Good',
    distance: 4.0,
    seller: 'Suresh B.',
    sellerType: 'Individual',
    sellerSince: 'Member since 2023',
    sellerResponse: 'Responds within a day',
    posted: '3 days ago',
    postedDays: 3,
    negotiable: false,
    featured: false,
    views: 176,
    image: IMG_PX(7658310),
    gallery: [
      IMG_PX(7658310, 1200),
      IMG_PX(9300770, 1200)
    ],
    description: 'Adjustable ergonomic office chair with lumbar support and height control. Wheels roll smoothly on both tile and carpet.',
    details: { Material: 'Mesh / Metal', Seating: '1 Person', Dimensions: 'Adjustable', Age: '2 Years', Pickup: 'Available', Delivery: 'Discuss with seller' },
    pickup: true, delivery: true
  },
  {
    id: 11,
    title: 'Ceramic Dinner Set (16 Pieces)',
    category: 'Kitchen',
    price: 1200,
    location: 'Bangalore',
    area: 'Whitefield',
    pincode: '560066',
    condition: 'Like New',
    distance: 7.3,
    seller: 'Anitha J.',
    sellerType: 'Individual',
    sellerSince: 'Member since 2025',
    sellerResponse: 'Responds within a day',
    posted: '1 day ago',
    postedDays: 1,
    negotiable: true,
    featured: false,
    views: 64,
    image: IMG_PX(9098766),
    gallery: [
      IMG_PX(9098766, 1200),
      IMG_PX(7303783, 1200)
    ],
    description: 'Sixteen piece ceramic dinner set used for a couple of gatherings only. No chips or cracks.',
    details: { Material: 'Ceramic', Seating: '4 People', Dimensions: 'Standard', Age: '6 Months', Pickup: 'Available', Delivery: 'Not available' },
    pickup: true, delivery: false
  },
  {
    id: 12,
    title: 'Wooden Wardrobe (2 Door)',
    category: 'Storage',
    price: 7500,
    location: 'Dharmapuri',
    area: 'Collectorate',
    pincode: '636701',
    condition: 'Good',
    distance: 14.5,
    seller: 'Manoj T.',
    sellerType: 'Individual',
    sellerSince: 'Member since 2023',
    sellerResponse: 'Responds within a day',
    posted: '12 days ago',
    postedDays: 12,
    negotiable: true,
    featured: false,
    views: 141,
    image: IMG_PX(7587809),
    gallery: [
      IMG_PX(7587809, 1200),
      IMG_PX(37030080, 1200)
    ],
    description: 'Two door wooden wardrobe with a mirror on one side and internal hanging space. Needs minor polish on the edges.',
    details: { Material: 'Sheesham Wood', Seating: '—', Dimensions: '120 × 60 × 200 cm', Age: '6 Years', Pickup: 'Available', Delivery: 'Discuss with seller' },
    pickup: true, delivery: true
  },

];

/* ---------- Dashboard demo data ---------- */

const NM_MY_LISTINGS = [
  { id: 101, item: 'Vintage Wooden Dining Table', price: 8500, views: 214, enquiries: 6, offers: 2, status: 'Active',   posted: '2 days ago' },
  { id: 102, item: 'Solid Wood Bookshelf',        price: 4500, views: 156, enquiries: 4, offers: 1, status: 'Active',   posted: '3 days ago' },
  { id: 103, item: 'Rattan Accent Chair',         price: 3200, views: 132, enquiries: 2, offers: 0, status: 'Pending',  posted: '5 days ago' },
  { id: 104, item: 'Compact Study Table',         price: 2500, views: 97,  enquiries: 3, offers: 1, status: 'Sold',     posted: '6 days ago' },
  { id: 105, item: 'Cane Lounge Chair',           price: 2900, views: 61,  enquiries: 1, offers: 0, status: 'Expired',  posted: '1 month ago' },
  { id: 106, item: 'Cane Swing Chair',          price: 6800, views: 167, enquiries: 5, offers: 2, status: 'Active',   posted: '10 days ago' }
];

const NM_SAVED_ITEMS = [
  { id: 2,  title: '3-Seater Fabric Sofa',        price: 12000, location: 'Bangalore',  condition: 'Good',     image: '../images/photo-1555041469-a586c61ea9bc.jpg' },
  { id: 3,  title: 'Queen Size Bed with Storage', price: 9500,  location: 'Chennai',    condition: 'Like New', image: '../images/photo-1505693416388-ac5ce068fe85.jpg' },
  { id: 9,  title: 'L-Shaped Sectional Sofa',     price: 18500, location: 'Chennai',    condition: 'Like New', image: '../images/photo-1513506003901-1e6a229e2d15.jpg' },
  { id: 7,  title: 'TV Unit with Drawers',        price: 5500,  location: 'Salem',      condition: 'Good',     image: '../images/photo-1594026112284-02bb6f3352fe.jpg' }
];

const NM_ENQUIRIES = [
  { buyer: 'Arun K.',   listing: 'Vintage Wooden Dining Table', message: 'Is the table still available? Can I view it this weekend?', date: 'Today, 10:24 AM',     status: 'New' },
  { buyer: 'Divya N.',  listing: 'Solid Wood Bookshelf',        message: 'Would you accept ₹4,000 if I arrange pickup myself?',     date: 'Yesterday',           status: 'Replied' },
  { buyer: 'Sneha P.',  listing: 'Cane Swing Chair',          message: 'Can you share more photos of the chains and hooks?',      date: '28 Sep 2026',         status: 'New' },
  { buyer: 'Manoj T.',  listing: 'Compact Study Table',         message: 'Picked up yesterday. Thanks for the smooth handover!',    date: '25 Sep 2026',         status: 'Closed' },
  { buyer: 'Karthik V.',listing: 'Rattan Accent Chair',         message: 'Is the cushion cover washable?',                          date: '24 Sep 2026',         status: 'Replied' }
];

const NM_OFFERS = [
  { listing: 'Vintage Wooden Dining Table', buyer: 'Arun K.',   offer: 7500, asking: 8500, date: 'Today',      status: 'Pending' },
  { listing: 'Solid Wood Bookshelf',        buyer: 'Divya N.',  offer: 4000, asking: 4500, date: 'Yesterday',  status: 'Countered' },
  { listing: 'Cane Swing Chair',          buyer: 'Sneha P.',  offer: 6000, asking: 6800, date: '28 Sep 2026',status: 'Accepted' },
  { listing: 'Compact Study Table',         buyer: 'Manoj T.',  offer: 1800, asking: 2500, date: '25 Sep 2026',status: 'Declined' }
];

const NM_MESSAGES = [
  { from: 'Arun K.',   listing: 'Vintage Wooden Dining Table', preview: 'Hi! Is the dining table still available? I can come by Saturday morning.', time: '10:24 AM', unread: true },
  { from: 'Divya N.',  listing: 'Solid Wood Bookshelf',        preview: 'Thanks for the counter offer. ₹4,200 works for me if pickup is this week.', time: 'Yesterday', unread: true },
  { from: 'Karthik V.',listing: 'Rattan Accent Chair',         preview: 'Yes, the cushion cover is washable and comes with the chair.', time: '24 Sep', unread: false },
  { from: 'Manoj T.',  listing: 'Compact Study Table',         preview: 'Collected the table. Appreciate the quick responses!', time: '25 Sep', unread: false }
];

const NM_PICKUPS = [
  { listing: 'Vintage Wooden Dining Table', party: 'Arun K. (Buyer)',   location: 'Sampigehalli, Hosur',  date: '04 Oct 2026', time: '11:00 AM', type: 'Pickup',    status: 'Scheduled' },
  { listing: 'Cane Swing Chair',          party: 'Sneha P. (Buyer)',  location: 'Mathigiri, Hosur',     date: '05 Oct 2026', time: '04:30 PM', type: 'Delivery',  status: 'Pending Coordination' },
  { listing: 'Solid Wood Bookshelf',        party: 'Divya N. (Buyer)',  location: 'Bargur, Hosur',        date: '06 Oct 2026', time: '10:00 AM', type: 'Pickup',    status: 'Scheduled' },
  { listing: 'Compact Study Table',         party: 'Manoj T. (Buyer)',  location: 'Krishnagiri Road, Hosur', date: '25 Sep 2026', time: '05:00 PM', type: 'Pickup', status: 'Completed' }
];

const NM_ADMIN_LISTINGS = [
  { listing: 'Handwoven Jute Rug',        seller: 'Nithya R.',  category: 'Decor',   location: 'Hosur',      price: 1900, status: 'Pending',  date: '01 Oct 2026' },
  { listing: '3-Seater Fabric Sofa',      seller: 'Arun K.',    category: 'Sofas',   location: 'Bangalore',  price: 12000,status: 'Approved', date: '28 Sep 2026' },
  { listing: 'Queen Size Bed with Storage',seller: 'Meena R.',  category: 'Beds',    location: 'Chennai',    price: 9500, status: 'Approved', date: '30 Sep 2026' },
  { listing: 'Mention: Fake Branded Sofa',seller: 'bulk_user9', category: 'Sofas',   location: 'Salem',      price: 4000, status: 'Rejected', date: '27 Sep 2026' },
  { listing: 'Ergonomic Office Chair',    seller: 'Suresh B.',  category: 'Office',  location: 'Hosur',      price: 4800, status: 'Sold',     date: '26 Sep 2026' },
  { listing: 'Study Table (Damaged)',     seller: 'Karthik V.', category: 'Office',  location: 'Hosur',      price: 2500, status: 'Pending',  date: '01 Oct 2026' },
  { listing: 'Arched Wall Mirror',        seller: 'Lakshmi K.', category: 'Decor',   location: 'Chennai',    price: 1500, status: 'Approved', date: '29 Sep 2026' }
];

const NM_ADMIN_USERS = [
  { user: 'Priya S.',    email: 'priya.s@example.com',   location: 'Hosur',      listings: 6, joined: '12 Jan 2024',  status: 'Active' },
  { user: 'Arun K.',     email: 'arun.k@example.com',    location: 'Bangalore',  listings: 3, joined: '03 Mar 2023',  status: 'Active' },
  { user: 'Meena R.',    email: 'meena.r@example.com',   location: 'Chennai',    listings: 2, joined: '19 Feb 2025',  status: 'Active' },
  { user: 'bulk_user9',  email: 'bulkuser9@mailinator.com', location: 'Salem',   listings: 1, joined: '27 Sep 2026',  status: 'Suspended' },
  { user: 'Suresh B.',   email: 'suresh.b@example.com',  location: 'Hosur',      listings: 4, joined: '08 Aug 2023',  status: 'Active' },
  { user: 'Lakshmi K.',  email: 'lakshmi.k@example.com', location: 'Chennai',    listings: 1, joined: '22 May 2025',  status: 'Active' }
];

const NM_REPORTS = [
  { listing: 'Mention: Fake Branded Sofa', reason: 'Fraud Concern',       reporter: 'Anonymous', date: '01 Oct 2026', status: 'Open' },
  { listing: 'Duplicate Coffee Table Ad',  reason: 'Duplicate Listing',   reporter: 'Sneha P.',   date: '30 Sep 2026', status: 'Open' },
  { listing: 'Refurbished Warehouse Deal', reason: 'Spam',                reporter: 'Karthik V.', date: '29 Sep 2026', status: 'Resolved' },
  { listing: 'Broken Chair – Stock Photo', reason: 'Incorrect Information',reporter: 'Divya N.',  date: '28 Sep 2026', status: 'Open' }
];

const NM_ADMIN_CATEGORIES = [
  { name: 'Sofas',   listings: 128, status: 'Active' },
  { name: 'Tables',  listings: 96,  status: 'Active' },
  { name: 'Beds',    listings: 74,  status: 'Active' },
  { name: 'Storage', listings: 63,  status: 'Active' },
  { name: 'Decor',   listings: 88,  status: 'Active' },
  { name: 'Office',  listings: 52,  status: 'Active' },
  { name: 'Kitchen', listings: 71,  status: 'Active' },
  { name: 'Outdoor', listings: 34,  status: 'Active' }
];

const NM_ADMIN_PICKUPS = [
  { listing: 'Vintage Wooden Dining Table', buyer: 'Arun K.',  seller: 'Priya S.',   type: 'Pickup',   location: 'Hosur',     date: '04 Oct 2026', status: 'Scheduled' },
  { listing: 'L-Shaped Sectional Sofa',     buyer: 'Rahul M.', seller: 'Vikram D.',  type: 'Delivery', location: 'Chennai',   date: '05 Oct 2026', status: 'Pending Coordination' },
  { listing: 'Wooden Wardrobe (2 Door)',    buyer: 'Suresh B.',seller: 'Manoj T.',   type: 'Delivery', location: 'Dharmapuri',date: '07 Oct 2026', status: 'Pending Coordination' },
  { listing: 'Ergonomic Office Chair',      buyer: 'Divya N.', seller: 'Suresh B.',  type: 'Pickup',   location: 'Hosur',     date: '25 Sep 2026', status: 'Completed' },
  { listing: 'Ceramic Dinner Set',          buyer: 'Priya S.', seller: 'Anitha J.',  type: 'Pickup',   location: 'Bangalore', date: '26 Sep 2026', status: 'Completed' }
];

/* ---------- Helpers shared across pages ---------- */

function nmFormatPrice(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function nmConditionClass(condition) {
  switch (condition) {
    case 'Like New':     return 'bg-emerald-100 text-emerald-800';
    case 'Good':         return 'bg-sky-100 text-sky-800';
    case 'Fair':         return 'bg-amber-100 text-amber-800';
    case 'Needs Repair': return 'bg-rose-100 text-rose-800';
    default:             return 'bg-stone-100 text-stone-700';
  }
}

function nmStatusClass(status) {
  switch (status) {
    case 'Active': case 'Approved': case 'Accepted': case 'Completed': case 'Resolved':
      return 'bg-emerald-100 text-emerald-800';
    case 'Pending': case 'Pending Coordination': case 'New': case 'Open': case 'Countered':
      return 'bg-amber-100 text-amber-800';
    case 'Replied': case 'Scheduled':
      return 'bg-sky-100 text-sky-800';
    case 'Rejected': case 'Declined': case 'Expired': case 'Suspended': case 'Sold':
      return 'bg-rose-100 text-rose-800';
    default:
      return 'bg-stone-100 text-stone-700';
  }
}

function nmStatusDot(status) {
  switch (status) {
    case 'Active': case 'Approved': case 'Accepted': case 'Completed': case 'Resolved':
      return 'bg-emerald-500';
    case 'Pending': case 'Pending Coordination': case 'New': case 'Open': case 'Countered':
      return 'bg-amber-500';
    case 'Replied': case 'Scheduled':
      return 'bg-sky-500';
    default:
      return 'bg-rose-500';
  }
}

function nmGetListingById(id) {
  return NM_LISTINGS.find(l => l.id === Number(id)) || NM_LISTINGS[0];
}

