// ========================================
// UNIVERSITIES & COLLEGES DATA - EASY TO EDIT
// ========================================
// To add a new institution: Add a new object with name and whatsappLink
// To edit a WhatsApp link: Change the whatsappLink value
// To remove a university: Delete the entire object

export interface University {
  name: string;
  whatsappLink: string;
  shortName?: string; // Optional short name for display
}

export const universities: University[] = [
  // Public Universities
  { 
    name: "University of Nairobi", 
    shortName: "UoN",
    whatsappLink: "https://chat.whatsapp.com/university-of-nairobi" 
  },
  { 
    name: "Kenyatta University", 
    shortName: "KU",
    whatsappLink: "https://chat.whatsapp.com/kenyatta-university" 
  },
  { 
    name: "Moi University", 
    shortName: "MU",
    whatsappLink: "https://chat.whatsapp.com/moi-university" 
  },
  { 
    name: "Egerton University", 
    shortName: "EU",
    whatsappLink: "https://chat.whatsapp.com/egerton-university" 
  },
  { 
    name: "Jomo Kenyatta University of Agriculture and Technology", 
    shortName: "JKUAT",
    whatsappLink: "https://chat.whatsapp.com/jkuat" 
  },
  { 
    name: "Maseno University", 
    shortName: "Maseno",
    whatsappLink: "https://chat.whatsapp.com/maseno-university" 
  },
  { 
    name: "Pwani University", 
    shortName: "PU",
    whatsappLink: "https://chat.whatsapp.com/pwani-university" 
  },
  { 
    name: "Technical University of Kenya", 
    shortName: "TUK",
    whatsappLink: "https://chat.whatsapp.com/technical-university-of-kenya" 
  },
  { 
    name: "Dedan Kimathi University of Technology", 
    shortName: "DeKUT",
    whatsappLink: "https://chat.whatsapp.com/dedan-kimathi-university" 
  },
  { 
    name: "Multimedia University of Kenya", 
    shortName: "MMU",
    whatsappLink: "https://chat.whatsapp.com/multimedia-university" 
  },
  { 
    name: "Kisii University", 
    shortName: "KSU",
    whatsappLink: "https://chat.whatsapp.com/kisii-university" 
  },
  { 
    name: "Laikipia University", 
    shortName: "LU",
    whatsappLink: "https://chat.whatsapp.com/laikipia-university" 
  },
  { 
    name: "Machakos University", 
    shortName: "MachU",
    whatsappLink: "https://chat.whatsapp.com/machakos-university" 
  },
  { 
    name: "Maasai Mara University", 
    shortName: "MMU",
    whatsappLink: "https://chat.whatsapp.com/maasai-mara-university" 
  },
  { 
    name: "Chuka University", 
    shortName: "CU",
    whatsappLink: "https://chat.whatsapp.com/chuka-university" 
  },
  { 
    name: "Embu University", 
    shortName: "EmU",
    whatsappLink: "https://chat.whatsapp.com/embu-university" 
  },
  { 
    name: "Karatina University", 
    shortName: "KarU",
    whatsappLink: "https://chat.whatsapp.com/karatina-university" 
  },
  { 
    name: "Kirinyaga University", 
    shortName: "KyU",
    whatsappLink: "https://chat.whatsapp.com/kirinyaga-university" 
  },
  { 
    name: "Murang'a University of Technology", 
    shortName: "MUT",
    whatsappLink: "https://chat.whatsapp.com/murang-a-university" 
  },
  { 
    name: "South Eastern Kenya University", 
    shortName: "SEKU",
    whatsappLink: "https://chat.whatsapp.com/south-eastern-kenya-university" 
  },
  { 
    name: "Taita Taveta University", 
    shortName: "TTU",
    whatsappLink: "https://chat.whatsapp.com/taita-taveta-university" 
  },
  { 
    name: "University of Eldoret", 
    shortName: "UoE",
    whatsappLink: "https://chat.whatsapp.com/university-of-eldoret" 
  },
  { 
    name: "Jaramogi Oginga Odinga University of Science and Technology", 
    shortName: "JOOUST",
    whatsappLink: "https://chat.whatsapp.com/jooust" 
  },
  { 
    name: "Masinde Muliro University of Science and Technology", 
    shortName: "MMUST",
    whatsappLink: "https://chat.whatsapp.com/mmust" 
  },
  { 
    name: "Rongo University", 
    shortName: "RU",
    whatsappLink: "https://chat.whatsapp.com/rongo-university" 
  },
  { 
    name: "Tom Mboya University", 
    shortName: "TMU",
    whatsappLink: "https://chat.whatsapp.com/tom-mboya-university" 
  },

  // Private Universities
  { 
    name: "Strathmore University", 
    shortName: "SU",
    whatsappLink: "https://chat.whatsapp.com/strathmore-university" 
  },
  { 
    name: "United States International University Africa", 
    shortName: "USIU-A",
    whatsappLink: "https://chat.whatsapp.com/usiu-africa" 
  },
  { 
    name: "Daystar University", 
    shortName: "DU",
    whatsappLink: "https://chat.whatsapp.com/daystar-university" 
  },
  { 
    name: "Catholic University of Eastern Africa", 
    shortName: "CUEA",
    whatsappLink: "https://chat.whatsapp.com/catholic-university" 
  },
  { 
    name: "Mount Kenya University", 
    shortName: "MKU",
    whatsappLink: "https://chat.whatsapp.com/mount-kenya-university" 
  },
  { 
    name: "Kenya Methodist University", 
    shortName: "KeMU",
    whatsappLink: "https://chat.whatsapp.com/kenya-methodist-university" 
  },
  { 
    name: "Kabarak University", 
    shortName: "Kabarak",
    whatsappLink: "https://chat.whatsapp.com/kabarak-university" 
  },
  { 
    name: "Africa Nazarene University", 
    shortName: "ANU",
    whatsappLink: "https://chat.whatsapp.com/africa-nazarene-university" 
  },
  { 
    name: "Pan Africa Christian University", 
    shortName: "PAC",
    whatsappLink: "https://chat.whatsapp.com/pan-africa-christian-university" 
  },
  { 
    name: "Presbyterian University of East Africa", 
    shortName: "PUEA",
    whatsappLink: "https://chat.whatsapp.com/presbyterian-university" 
  },
  { 
    name: "St. Paul's University", 
    shortName: "SPU",
    whatsappLink: "https://chat.whatsapp.com/st-pauls-university" 
  },
  { 
    name: "Kenya Highlands Evangelical University", 
    shortName: "KHEU",
    whatsappLink: "https://chat.whatsapp.com/kenya-highlands-university" 
  },
  { 
    name: "Great Lakes University of Kisumu", 
    shortName: "GLUK",
    whatsappLink: "https://chat.whatsapp.com/great-lakes-university" 
  },
  { 
    name: "Riara University", 
    shortName: "RU",
    whatsappLink: "https://chat.whatsapp.com/riara-university" 
  },
  { 
    name: "KCA University", 
    shortName: "KCAU",
    whatsappLink: "https://chat.whatsapp.com/kca-university" 
  },

  // Colleges & TVET Institutions
  {
    name: "Kenya Medical Training College",
    shortName: "KMTC",
    whatsappLink: "https://chat.whatsapp.com/kmtc"
  },
  {
    name: "Kenya Coast National Polytechnic",
    shortName: "KCNP",
    whatsappLink: "https://chat.whatsapp.com/kenya-coast-poly"
  },
  {
    name: "The Kabete National Polytechnic",
    shortName: "Kabete Poly",
    whatsappLink: "https://chat.whatsapp.com/kabete-poly"
  },
  {
    name: "The Kisumu National Polytechnic",
    shortName: "Kisumu Poly",
    whatsappLink: "https://chat.whatsapp.com/kisumu-poly"
  },
  {
    name: "Meru National Polytechnic",
    shortName: "Meru Poly",
    whatsappLink: "https://chat.whatsapp.com/meru-poly"
  },
  {
    name: "Nyeri National Polytechnic",
    shortName: "Nyeri Poly",
    whatsappLink: "https://chat.whatsapp.com/nyeri-poly"
  },
  {
    name: "Eldoret National Polytechnic",
    shortName: "Eldoret Poly",
    whatsappLink: "https://chat.whatsapp.com/eldoret-poly"
  },
  {
    name: "Sigalagala National Polytechnic",
    shortName: "Sigalagala",
    whatsappLink: "https://chat.whatsapp.com/sigalagala-poly"
  },
  {
    name: "Kitale National Polytechnic",
    shortName: "Kitale Poly",
    whatsappLink: "https://chat.whatsapp.com/kitale-poly"
  },
  {
    name: "Kenya Technical Trainers College",
    shortName: "KTTC",
    whatsappLink: "https://chat.whatsapp.com/kttc"
  },
  {
    name: "Rift Valley Institute of Science & Technology",
    shortName: "RVIST",
    whatsappLink: "https://chat.whatsapp.com/rvist"
  },
  {
    name: "Nairobi Institute of Technology",
    shortName: "NIT",
    whatsappLink: "https://chat.whatsapp.com/nit"
  },
  {
    name: "Zetech University",
    shortName: "Zetech",
    whatsappLink: "https://chat.whatsapp.com/zetech-university"
  },
  {
    name: "Pioneer International University",
    shortName: "PIU",
    whatsappLink: "https://chat.whatsapp.com/pioneer-university"
  },
  {
    name: "Kenya Institute of Management",
    shortName: "KIM",
    whatsappLink: "https://chat.whatsapp.com/kim"
  },
  {
    name: "Kenya Institute of Mass Communication",
    shortName: "KIMC",
    whatsappLink: "https://chat.whatsapp.com/kimc"
  },
  {
    name: "Utalii College",
    shortName: "Utalii",
    whatsappLink: "https://chat.whatsapp.com/utalii-college"
  }
];

// Support contact information
export const SUPPORT_EMAIL = "support@kuer.co.ke";
export const SUPPORT_WHATSAPP = "https://chat.whatsapp.com/kuer-support";

// Helper function to search universities
export const searchUniversities = (query: string): University[] => {
  if (!query.trim()) return universities;
  
  const searchTerm = query.toLowerCase();
  return universities.filter(
    university => 
      university.name.toLowerCase().includes(searchTerm) ||
      (university.shortName && university.shortName.toLowerCase().includes(searchTerm))
  );
};

// Helper function to get university by name
export const getUniversityByName = (name: string): University | undefined => {
  return universities.find(
    university => 
      university.name.toLowerCase() === name.toLowerCase() ||
      (university.shortName && university.shortName.toLowerCase() === name.toLowerCase())
  );
};