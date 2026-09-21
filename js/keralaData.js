/**
 * Kerala Healthcare Directory & District Metadata
 * Comprehensive dataset covering all 14 districts in Kerala
 */

export const KERALA_DISTRICT_DATA = {
  Ernakulam: {
    zone: 'Central',
    headquarters: 'Kakkanad / Kochi',
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
    headquarters: 'Thrissur City',
    hospitals: [
      { name: 'Jubilee Mission Medical College', locality: 'East Fort', phone: '+91 487 2432200' },
      { name: 'Government Medical College Thrissur', locality: 'Mulankunnathukavu', phone: '+91 487 2200310' },
      { name: 'Amala Institute of Medical Sciences', locality: 'Amalanagar', phone: '+91 487 2304000' },
      { name: 'District General Hospital', locality: 'Swaraj Round', phone: '+91 487 2333060' }
    ]
  },
  Kottayam: {
    zone: 'South-Central',
    headquarters: 'Kottayam Town',
    hospitals: [
      { name: 'Caritas Hospital', locality: 'Thellakom', phone: '+91 481 2790025' },
      { name: 'Government Medical College Kottayam', locality: 'Gandhinagar', phone: '+91 481 2597284' },
      { name: 'District Hospital Kottayam', locality: 'Collectorate', phone: '+91 481 2563611' },
      { name: 'Bharat Hospital', locality: 'Azad Lane', phone: '+91 481 2565555' }
    ]
  },
  Kozhikode: {
    zone: 'North',
    headquarters: 'Calicut',
    hospitals: [
      { name: 'Baby Memorial Hospital', locality: 'Arayidathupalam', phone: '+91 495 2777777' },
      { name: 'Government Medical College Kozhikode', locality: 'Chevayur', phone: '+91 495 2350216' },
      { name: 'Aster MIMS Hospital', locality: 'Mini Bypass', phone: '+91 495 2488000' },
      { name: 'District General Hospital Beach', locality: 'Beach Road', phone: '+91 495 2365367' }
    ]
  },
  Thiruvananthapuram: {
    zone: 'South',
    headquarters: 'Trivandrum',
    hospitals: [
      { name: 'Government Medical College Thiruvananthapuram', locality: 'Medical College', phone: '+91 471 2528300' },
      { name: 'KIMSHEALTH Hospital', locality: 'Anayara', phone: '+91 471 2941000' },
      { name: 'Sree Chitra Tirunal Institute (SCTIMST)', locality: 'Kumarapuram', phone: '+91 471 2524444' },
      { name: 'General Hospital Trivandrum', locality: 'Vanchiyoor', phone: '+91 471 2471017' }
    ]
  },
  Alappuzha: {
    zone: 'South',
    headquarters: 'Alappuzha',
    hospitals: [
      { name: 'Government Medical College Alappuzha', locality: 'Vandanam', phone: '+91 477 2282015' },
      { name: 'District General Hospital', locality: 'Iron Bridge', phone: '+91 477 2253324' }
    ]
  },
  Palakkad: {
    zone: 'Central-North',
    headquarters: 'Palakkad',
    hospitals: [
      { name: 'District Hospital Palakkad', locality: 'Sultanpet', phone: '+91 491 2533323' },
      { name: 'Government Medical College Palakkad', locality: 'Yakkara', phone: '+91 491 2505220' },
      { name: 'Valluvanad Hospital', locality: 'Ottapalam', phone: '+91 466 2244400' }
    ]
  },
  Kannur: {
    zone: 'North',
    headquarters: 'Kannur',
    hospitals: [
      { name: 'Government Medical College Kannur', locality: 'Pariyaram', phone: '+97 497 2808080' },
      { name: 'District Hospital Kannur', locality: 'South Bazar', phone: '+91 497 2706344' },
      { name: 'Koyili Hospital', locality: 'Pallikkunnu', phone: '+91 497 2701000' }
    ]
  },
  Malappuram: {
    zone: 'North-Central',
    headquarters: 'Malappuram',
    hospitals: [
      { name: 'Government Medical College Manjeri', locality: 'Manjeri', phone: '+91 483 2766056' },
      { name: 'District Hospital Perinthalmanna', locality: 'Perinthalmanna', phone: '+91 4933 227239' },
      { name: 'Al Shifa Hospital', locality: 'Perinthalmanna', phone: '+91 4933 227600' }
    ]
  },
  Kollam: {
    zone: 'South',
    headquarters: 'Kollam',
    hospitals: [
      { name: 'Government Medical College Kollam', locality: 'Parippally', phone: '+91 474 2575050' },
      { name: 'District Hospital Kollam', locality: 'Asramam', phone: '+91 474 2742055' },
      { name: 'N.S. Memorial Hospital', locality: 'Palathara', phone: '+91 474 2723199' }
    ]
  },
  Idukki: {
    zone: 'High Ranges',
    headquarters: 'Painavu',
    hospitals: [
      { name: 'District Hospital Idukki', locality: 'Painavu', phone: '+91 4862 232230' },
      { name: 'Taluk Hospital Thodupuzha', locality: 'Thodupuzha', phone: '+91 4862 222434' },
      { name: 'St. John’s Hospital', locality: 'Kattappana', phone: '+91 4868 272230' }
    ]
  },
  Pathanamthitta: {
    zone: 'South',
    headquarters: 'Pathanamthitta',
    hospitals: [
      { name: 'General Hospital Pathanamthitta', locality: 'Ring Road', phone: '+91 468 2222364' },
      { name: 'Taluk Headquarters Hospital Thiruvalla', locality: 'Thiruvalla', phone: '+91 469 2602330' },
      { name: 'Pushpagiri Medical College', locality: 'Thiruvalla', phone: '+91 469 2700755' }
    ]
  },
  Wayanad: {
    zone: 'High Ranges',
    headquarters: 'Kalpetta',
    hospitals: [
      { name: 'District Hospital Mananthavady', locality: 'Mananthavady', phone: '+91 4935 240223' },
      { name: 'General Hospital Kalpetta', locality: 'Kalpetta', phone: '+91 4936 202234' },
      { name: 'Assumption Hospital', locality: 'Sulthan Bathery', phone: '+91 4936 220268' }
    ]
  },
  Kasaragod: {
    zone: 'North',
    headquarters: 'Kasaragod',
    hospitals: [
      { name: 'General Hospital Kasaragod', locality: 'Vidyanagar', phone: '+91 4994 225300' },
      { name: 'District Hospital Kanhangad', locality: 'Kanhangad', phone: '+91 467 2204040' }
    ]
  }
};
