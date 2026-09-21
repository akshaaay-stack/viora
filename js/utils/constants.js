/**
 * VIORA System Constants & Kerala Healthcare Directory
 * Challenge: SC-12 — District Blood Donor Matching
 * Tagline: "The right donor, at the right moment — not everyone, all at once."
 */

export const CONFIG = {
  APP_NAME: 'VIORA',
  TAGLINE: 'The right donor, at the right moment — not everyone, all at once.',
  SUBTITLE: 'A privacy-first district blood donor matching platform that connects blood requests with eligible nearby donors instead of broadcasting every request to everyone.',
  
  // Supabase Live Backend Configuration
  SUPABASE_URL: 'https://jpultvoodifhjqmbsjvh.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwdWx0dm9vZGlmaGpxbWJzanZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NTQ4MTcsImV4cCI6MjEwNTIzMDgxN30.xnGN2RbFYl2HHj583swTzU83GdOr9oHNO2EMPYjY6sk',
  
  // Core SC-12 Business Logic Constants (Configurable, no magic numbers scattered)
  MIN_DONATION_INTERVAL_DAYS: 90,
  MAX_WAVE_MATCH_LIMIT: 6,
  REQUEST_EXPIRY_HOURS: 48,

  // Supported Blood Groups
  BLOOD_GROUPS: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],

  // Kerala 14 Districts
  KERALA_DISTRICTS: [
    'Ernakulam',
    'Thrissur',
    'Kottayam',
    'Alappuzha',
    'Idukki',
    'Kozhikode',
    'Kannur',
    'Malappuram',
    'Palakkad',
    'Kollam',
    'Thiruvananthapuram',
    'Pathanamthitta',
    'Wayanad',
    'Kasaragod'
  ],

  // Kerala Emergency Helplines
  HELPLINES: {
    DISHA: '1056',
    AMBULANCE: '108',
    STATE_BLOOD_TRANSFUSION_COUNCIL: '0471-2470123'
  }
};

export const KERALA_DISTRICT_DATA = {
  Ernakulam: {
    zone: 'Central',
    hospitals: [
      { name: 'Aster Medcity', locality: 'Cheranalloor', phone: '+91 484 6699999' },
      { name: 'Amrita Institute of Medical Sciences (AIMS)', locality: 'Edappally', phone: '+91 484 2851234' },
      { name: 'Medical Trust Hospital', locality: 'MG Road', phone: '+91 484 2358001' },
      { name: 'General Hospital Ernakulam', locality: 'Marine Drive', phone: '+91 484 2361251' },
      { name: 'Lisie Hospital', locality: 'Kaloor', phone: '+91 484 2402044' },
      { name: 'Rajagiri Hospital', locality: 'Aluva', phone: '+91 484 2905000' }
    ]
  },
  Thrissur: {
    zone: 'Central',
    hospitals: [
      { name: 'Jubilee Mission Medical College', locality: 'East Fort', phone: '+91 487 2432200' },
      { name: 'Government Medical College Thrissur', locality: 'Mulankunnathukavu', phone: '+91 487 2200310' },
      { name: 'Amala Institute of Medical Sciences', locality: 'Amalanagar', phone: '+91 487 2304000' },
      { name: 'District General Hospital', locality: 'Swaraj Round', phone: '+91 487 2333060' }
    ]
  },
  Kottayam: {
    zone: 'South-Central',
    hospitals: [
      { name: 'Caritas Hospital', locality: 'Thellakom', phone: '+91 481 2790025' },
      { name: 'Government Medical College Kottayam', locality: 'Gandhinagar', phone: '+91 481 2597284' },
      { name: 'District Hospital Kottayam', locality: 'Collectorate', phone: '+91 481 2563611' }
    ]
  },
  Kozhikode: {
    zone: 'North',
    hospitals: [
      { name: 'Baby Memorial Hospital', locality: 'Arayidathupalam', phone: '+91 495 2777777' },
      { name: 'Government Medical College Kozhikode', locality: 'Chevayur', phone: '+91 495 2350216' },
      { name: 'Aster MIMS Hospital', locality: 'Mini Bypass', phone: '+91 495 2488000' }
    ]
  },
  Thiruvananthapuram: {
    zone: 'South',
    hospitals: [
      { name: 'Government Medical College Thiruvananthapuram', locality: 'Medical College', phone: '+91 471 2528300' },
      { name: 'KIMSHEALTH Hospital', locality: 'Anayara', phone: '+91 471 2941000' },
      { name: 'Sree Chitra Tirunal Institute (SCTIMST)', locality: 'Kumarapuram', phone: '+91 471 2524444' }
    ]
  },
  Alappuzha: {
    zone: 'South',
    hospitals: [
      { name: 'Government Medical College Alappuzha', locality: 'Vandanam', phone: '+91 477 2282015' },
      { name: 'District General Hospital', locality: 'Iron Bridge', phone: '+91 477 2253324' }
    ]
  },
  Palakkad: {
    zone: 'Central-North',
    hospitals: [
      { name: 'District Hospital Palakkad', locality: 'Sultanpet', phone: '+91 491 2533323' },
      { name: 'Government Medical College Palakkad', locality: 'Yakkara', phone: '+91 491 2505220' }
    ]
  },
  Kannur: {
    zone: 'North',
    hospitals: [
      { name: 'Government Medical College Kannur', locality: 'Pariyaram', phone: '+91 497 2808080' },
      { name: 'District Hospital Kannur', locality: 'South Bazar', phone: '+91 497 2706344' }
    ]
  },
  Malappuram: {
    zone: 'North-Central',
    hospitals: [
      { name: 'Government Medical College Manjeri', locality: 'Manjeri', phone: '+91 483 2766056' },
      { name: 'District Hospital Perinthalmanna', locality: 'Perinthalmanna', phone: '+91 4933 227239' }
    ]
  },
  Kollam: {
    zone: 'South',
    hospitals: [
      { name: 'Government Medical College Kollam', locality: 'Parippally', phone: '+91 474 2575050' },
      { name: 'District Hospital Kollam', locality: 'Asramam', phone: '+91 474 2742055' }
    ]
  },
  Idukki: {
    zone: 'High Ranges',
    hospitals: [
      { name: 'District Hospital Idukki', locality: 'Painavu', phone: '+91 4862 232230' },
      { name: 'Taluk Hospital Thodupuzha', locality: 'Thodupuzha', phone: '+91 4862 222434' }
    ]
  },
  Pathanamthitta: {
    zone: 'South',
    hospitals: [
      { name: 'General Hospital Pathanamthitta', locality: 'Ring Road', phone: '+91 468 2222364' },
      { name: 'Pushpagiri Medical College', locality: 'Thiruvalla', phone: '+91 469 2700755' }
    ]
  },
  Wayanad: {
    zone: 'High Ranges',
    hospitals: [
      { name: 'District Hospital Mananthavady', locality: 'Mananthavady', phone: '+91 4935 240223' },
      { name: 'General Hospital Kalpetta', locality: 'Kalpetta', phone: '+91 4936 202234' }
    ]
  },
  Kasaragod: {
    zone: 'North',
    hospitals: [
      { name: 'General Hospital Kasaragod', locality: 'Vidyanagar', phone: '+91 4994 225300' },
      { name: 'District Hospital Kanhangad', locality: 'Kanhangad', phone: '+91 467 2204040' }
    ]
  }
};
