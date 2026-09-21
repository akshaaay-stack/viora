import { KeralaDistrict } from '../types/database';

export const KERALA_DISTRICTS: KeralaDistrict[] = [
  'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam',
  'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta',
  'Thiruvananthapuram', 'Thrissur', 'Wayanad'
];

export const DISTRICT_LOCALITIES: Record<KeralaDistrict, string[]> = {
  Ernakulam: ['Kakkanad', 'Edappally', 'Aluva', 'Fort Kochi', 'Kalamassery', 'Palarivattom', 'Vyttila', 'Thripunithura', 'Maradu', 'Kaloor'],
  Kottayam: ['Thellakom', 'Changanassery', 'Pala', 'Kanjirappally', 'Ettumanoor', 'Vaikom'],
  Thrissur: ['Amalanagar', 'Ollur', 'Kunnamkulam', 'Chalakudy', 'Guruvayur', 'Kodungallur'],
  Kozhikode: ['Arayidathupalam', 'Mavoor', 'Feroke', 'Vadakara', 'Koyilandy', 'Medical College'],
  Thiruvananthapuram: ['Anayara', 'Pattom', 'Medical College', 'Kazhakkoottam', 'Kowdiar', 'Attingal'],
  Alappuzha: ['Cherthala', 'Kayamkulam', 'Mavelikkara', 'Ambalappuzha', 'Haripad'],
  Palakkad: ['Ottapalam', 'Shornur', 'Chittur', 'Mannarkkad', 'Alathur'],
  Malappuram: ['Manjeri', 'Perinthalmanna', 'Tirur', 'Ponnani', 'Nilambur'],
  Kannur: ['Thalassery', 'Payyanur', 'Taliparamba', 'Mattannur'],
  Kollam: ['Kottarakkara', 'Karunagappally', 'Punalur', 'Paravur'],
  Idukki: ['Thodupuzha', 'Munnar', 'Adimali', 'Kattappana'],
  Pathanamthitta: ['Thiruvalla', 'Adoor', 'Ranni', 'Pandalam'],
  Kasaragod: ['Kanhangad', 'Nileshwaram', 'Manjeshwar'],
  Wayanad: ['Kalpetta', 'Sulthan Bathery', 'Mananthavady']
};

export const POPULAR_HOSPITALS = [
  { name: 'Aster Medcity', district: 'Ernakulam', locality: 'Kakkanad' },
  { name: 'Amrita Institute of Medical Sciences', district: 'Ernakulam', locality: 'Edappally' },
  { name: 'Rajagiri Hospital', district: 'Ernakulam', locality: 'Aluva' },
  { name: 'Medical Trust Hospital', district: 'Ernakulam', locality: 'Fort Kochi' },
  { name: 'Renai Medicity', district: 'Ernakulam', locality: 'Kalamassery' },
  { name: 'VPS Lakeshore Hospital', district: 'Ernakulam', locality: 'Maradu' },
  { name: 'Caritas Hospital', district: 'Kottayam', locality: 'Thellakom' },
  { name: 'Amala Institute of Medical Sciences', district: 'Thrissur', locality: 'Amalanagar' },
  { name: 'Baby Memorial Hospital', district: 'Kozhikode', locality: 'Arayidathupalam' },
  { name: 'KIMSHEALTH Hospital', district: 'Thiruvananthapuram', locality: 'Anayara' }
];
