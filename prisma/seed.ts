import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with original site data...');

  // 1. Clean existing data
  await prisma.unit.deleteMany();
  await prisma.property.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Default Admin User
  const passwordHash = bcrypt.hashSync('Edifice2026!', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@edifice.ug',
      name: 'Edifice Admin',
      passwordHash,
      role: 'super_admin',
    },
  });
  console.log('Admin user created:', admin.email);

  // 3. Create Global Settings
  const settings = [
    { key: 'phone_primary', value: '+256786000112', description: 'Primary contact phone number' },
    { key: 'phone_alt1', value: '+256763700206', description: 'Secondary phone number' },
    { key: 'phone_alt2', value: '+256766759416', description: 'Third phone number' },
    { key: 'phone_alt3', value: '+256709269168', description: 'Fourth phone number' },
    { key: 'phone_alt4', value: '+256770833189', description: 'Fifth phone number' },
    { key: 'whatsapp_number', value: '256786000112', description: 'WhatsApp number in international format (no +)' },
    { key: 'contact_email', value: 'edificepropertiesltd@gmail.com', description: 'Contact email address' },
    { key: 'office_address', value: 'Plot 8, Kanjokya Street, (Beside The Aleph Restaurant and Africana Tours & Travels Office), Kololo, Kampala, Uganda.', description: 'Physical office address' },
    { key: 'po_box', value: 'P.O. Box 108048 Kampala Nakawa.', description: 'P.O. Box address' },
    { key: 'business_hours', value: 'Mon - Sun: 9:00 AM - 5:00 PM', description: 'Office operating hours' },
    { key: 'youtube_hero_url', value: 'https://youtu.be/LYgWq4vRT8c?si=ZIuQnIDVuzGkP-oh', description: 'Background video link for Homepage' },
  ];

  for (const s of settings) {
    await prisma.setting.create({ data: s });
  }
  console.log('Global settings seeded.');

  // 4. Create Properties & Units
  // Horizon Residency
  const horizon = await prisma.property.create({
    data: {
      id: 'horizon-residency',
      name: 'Horizon Residency',
      slug: 'horizon-residency',
      location: 'Luthuli Avenue, Bugolobi',
      description: 'Horizon Residency is a premium apartment development by Edifice Properties located on Luthuli Avenue, Bugolobi. It offers modern 1BHK, 2BHK, and 3BHK apartments with luxury features, functional layouts, and resort-style amenities.',
      fullDescription: 'Horizon Residency represents the pinnacle of urban sophistication in Bugolobi. Located on the prestigious Luthuli Avenue (opposite Dolphin Suites), it offers premium 1, 2, and 3 bedroom apartments starting at $92,000. Features include floor-to-ceiling windows, private balconies, and smart-home readiness.',
      startingPrice: 92000,
      currency: 'USD',
      status: 'Available',
      type: 'Apartment',
      bedrooms: '1BHK, 2BHK, 3BHK',
      bathrooms: '1-3',
      sizeRange: '600–1,700 sq.ft',
      mainImage: '/assets/images/horizon.png',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7562095908226!2d32.617192314753956!3d0.31505309977017647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb8a0d0a2f5f%3A0xe54d588523dfad2f!2sLuthuli%20Ave%2C%20Kampala!5e0!3m2!1sen!2sug!4v1700000000000!5m2!1sen!2sug',
      youtubeUrl: '/assets/images/WhatsApp-Video-2024-08-15-at-9.07.47-AM.mp4',
      featured: true,
      seoTitle: 'Horizon Residency Bugolobi | Luxury Apartments for Sale in Kampala',
      seoDescription: 'Discover Horizon Residency by Edifice Properties on Luthuli Avenue, Bugolobi. Offers modern 1BHK, 2BHK, and 3BHK apartments starting at $92,000 with premium amenities.',
      orderIndex: 1,
    },
  });

  await prisma.unit.createMany({
    data: [
      {
        propertyId: horizon.id,
        name: 'Horizon 1BHK',
        price: 92000,
        size: '600–720 sq.ft',
        bedrooms: 1,
        bathrooms: 1,
        status: 'Available',
        description: 'Open-plan living & dining area, compact modern kitchen with utility space, spacious bedroom with attached washroom, balcony with scenic views, and quality flooring & natural lighting.',
        floorPlanImage: '/assets/images/EDIFICE-PROFILE._page-0072.jpg',
      },
      {
        propertyId: horizon.id,
        name: 'Horizon 1BHK-B',
        price: 92000,
        size: '600–727 sq.ft',
        bedrooms: 1,
        bathrooms: 1,
        status: 'Available',
        description: 'Open-plan living & dining area, compact kitchen with utility space, spacious bedroom with attached washroom, balcony with scenic views, and quality flooring & natural lighting.',
        floorPlanImage: '/assets/images/EDIFICE-PROFILE._page-0072.jpg',
      },
      {
        propertyId: horizon.id,
        name: 'Horizon 2BHK',
        price: 124000,
        size: '1,000–1,200 sq.ft',
        bedrooms: 2,
        bathrooms: 2,
        status: 'Available',
        description: 'Large living & dining area with balcony, modern kitchen with separate utility area, master bedroom with en-suite bathroom & balcony, second bedroom for kids/guests, common washroom, and high-quality finishes.',
        floorPlanImage: '/assets/images/EDIFICE-PROFILE._page-0072.jpg',
      },
      {
        propertyId: horizon.id,
        name: 'Horizon 3BHK',
        price: 160000,
        size: '1,450–1,700 sq.ft',
        bedrooms: 3,
        bathrooms: 3,
        status: 'Available',
        description: 'Grand living & dining space with balcony access, modern kitchen with utility & store room, master bedroom with attached bathroom & private balcony, two additional bedrooms with ample storage, guest/common washroom, and maid’s room & washroom with separate entrance on select units.',
        floorPlanImage: '/assets/images/EDIFICE-PROFILE._page-0073.jpg',
      },
    ],
  });

  // Embassy Towers
  const embassy = await prisma.property.create({
    data: {
      id: 'embassy-towers',
      name: 'Embassy Towers',
      slug: 'embassy-towers',
      location: 'Kampala Road, Kampala',
      description: 'Embassy Towers offers modern urban living in the heart of Kampala with premium 1BHK, 2BHK, and 3BHK apartments designed to ensure maximum comfort and convenience for residents.',
      fullDescription: 'This luxury high-rise community provides its residents with sophisticated and trendy apartment features, extravagant and resort-style amenities at a very cost-effective price. Features include double glazing for noise insulation, spacious balconies, and 24/7 security.',
      startingPrice: 68000,
      currency: 'USD',
      status: 'Available',
      type: 'Apartment',
      bedrooms: '1BHK, 2BHK, 3BHK',
      bathrooms: '1-3',
      sizeRange: '700–1,650 sq.ft',
      mainImage: '/assets/images/embassy.webp',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7594954497333!2d32.57864831475394!3d0.3129520997717088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbc8096f5b9d7%3A0xe54d588523dfad2e!2sKampala%20Road%2C%20Kampala!5e0!3m2!1sen!2sug!4v1700000000001!5m2!1sen!2sug',
      youtubeUrl: '/assets/images/WhatsApp-Video-2024-08-15-at-9.08.16-AM.mp4',
      featured: true,
      seoTitle: 'Embassy Towers Kampala | High-Rise Luxury Living',
      seoDescription: 'Invest in Embassy Towers Kampala. Offering premium 1, 2, and 3 bedroom apartments starting at $68,000. Prime location, 24/7 security, and modern layouts.',
      orderIndex: 2,
    },
  });

  await prisma.unit.createMany({
    data: [
      {
        propertyId: embassy.id,
        name: 'Embassy Towers 1BHK',
        price: 68000,
        size: '700 sq.ft',
        bedrooms: 1,
        bathrooms: 1,
        status: 'Available',
        description: 'Living Room: A modern and open living space designed to maximize natural light. Bedroom: A cozy sanctuary with spacious wardrobes. Kitchen: Compact modular layout. Bathroom: Sleek design with premium tiles. Balcony: Private outdoor extension.',
        floorPlanImage: '/assets/images/2-1-1024x722.png',
      },
      {
        propertyId: embassy.id,
        name: 'Embassy Towers 2BHK',
        price: 86000,
        size: '1,150 sq.ft',
        bedrooms: 2,
        bathrooms: 2,
        status: 'Available',
        description: 'Living Room: Bright, airy, and expansive. Master Bedroom: King-size layout with ensuite bathroom and private balcony. Second Bedroom: Flexible space for kids or guest. Modular kitchen and multiple balconies.',
        floorPlanImage: '/assets/images/2-1-1024x722.png',
      },
      {
        propertyId: embassy.id,
        name: 'Embassy Towers 3BHK',
        price: 122000,
        size: '1,650 sq.ft',
        bedrooms: 3,
        bathrooms: 3,
        status: 'Available',
        description: 'Living Room: Grand, central hub with high ceilings. Master Bedroom: Walk-in closet, ensuite bath, and private balcony. Second and Third Bedrooms: Generous storage and window views. Large modular kitchen with utility zone.',
        floorPlanImage: '/assets/images/3-1-1024x722.png',
      },
    ],
  });

  // Elite Palazzo Naguru
  const elite = await prisma.property.create({
    data: {
      id: 'elite-palazzo-naguru',
      name: 'Elite Palazzo Naguru',
      slug: 'elite-palazzo-naguru',
      location: 'Naguru, Kampala',
      description: 'Elite Palazzo is positioned as a premium residential address offering modern elegance, strong connectivity, and city-inspired residences. Being an Elite resident means having Kampala within reach.',
      fullDescription: 'Located around the crossroads of Naguru/Ntinda II road, Elite Palazzo offers connectivity and road access to Kampala within a 4 to 5 km radius. The project features elegant apartments, large terraces, and premium locally and internationally sourced finishes.',
      startingPrice: 120000,
      currency: 'USD',
      status: 'Available',
      type: 'Apartment',
      bedrooms: '2BHK, 3BHK',
      bathrooms: '2-3',
      sizeRange: '90–128 sqm',
      mainImage: '/assets/images/pallazo.webp',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.742337778546!2d32.60742131475396!3d0.33924309975267077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb13b1ab9403%3A0xe54d588523dfad2d!2sNaguru%2C%20Kampala!5e0!3m2!1sen!2sug!4v1700000000002!5m2!1sen!2sug',
      youtubeUrl: 'https://www.youtube.com/watch?v=cM3C75n-k5M',
      featured: true,
      seoTitle: 'Elite Palazzo Naguru | Luxury Real Estate Uganda',
      seoDescription: 'Elite Palazzo in Naguru, Kampala offers premium 2BHK and 3BHK luxury apartments starting at $120,000. Enjoy high-elevation views and prime city connectivity.',
      orderIndex: 3,
    },
  });

  await prisma.unit.createMany({
    data: [
      {
        propertyId: elite.id,
        name: 'Elite Palazzo 2BHK Apartment',
        price: 120000,
        size: '90 sqm',
        bedrooms: 2,
        bathrooms: 2,
        status: 'Available',
        description: 'Spacious living and dining area, modern open-plan kitchen, elegant interiors with high-quality finishes, and peaceful residential surroundings.',
        floorPlanImage: '/assets/images/2.png',
      },
      {
        propertyId: elite.id,
        name: 'Elite Palazzo 3BHK Apartment',
        price: 150000,
        size: '128 sqm',
        bedrooms: 3,
        bathrooms: 3,
        status: 'Available',
        description: 'Designed for comfort and long-term value. Includes a large living and dining area, fully fitted modern kitchen, three well-sized bedrooms with attached master bathroom, and private balconies with neighborhood views.',
        floorPlanImage: '/assets/images/3.png',
      },
    ],
  });

  // Atlantic Apartments
  const atlantic = await prisma.property.create({
    data: {
      id: 'atlantic-apartments',
      name: 'Atlantic Apartments',
      slug: 'atlantic-apartments',
      location: 'Kampala',
      description: 'Atlantic Apartments (Atlantic Heights) is a design-led residential project close to schools, shopping malls, hospitals, business hubs, and key lifestyle amenities in Kampala.',
      fullDescription: 'Atlantic Heights offers stunning modern layouts, prioritizing natural light, ventilation, and functional design. Built with premium materials, this development provides outstanding long-term rental yields and is ideal for diaspora and home buyers alike.',
      startingPrice: 97000,
      currency: 'USD',
      status: 'Available',
      type: 'Apartment',
      bedrooms: '2BHK, 3BHK',
      bathrooms: '2-3',
      sizeRange: '100–150 sqm',
      mainImage: '/assets/images/envato-labs-image-edit-64-1.png',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15959.030806497223!2d32.582519999999996!3d0.31628000000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbc8096f5b9d7%3A0xe54d588523dfad2e!2sKampala%2C%20Uganda!5e0!3m2!1sen!2sug!4v1700000000003!5m2!1sen!2sug',
      youtubeUrl: 'https://www.youtube.com/watch?v=s1X9eM6y6o8',
      featured: false,
      seoTitle: 'Atlantic Apartments | Modern Residences in Kampala',
      seoDescription: 'Atlantic Apartments (Atlantic Heights) Kampala offers 2BHK and 3BHK luxury suites starting at $97,000. Convenient access to shopping, schools, and medical facilities.',
      orderIndex: 4,
    },
  });

  await prisma.unit.createMany({
    data: [
      {
        propertyId: atlantic.id,
        name: 'Atlantic Heights 2BHK',
        price: 97000,
        size: '100 sqm',
        bedrooms: 2,
        bathrooms: 2,
        status: 'Available',
        description: 'Large living & dining area with natural lighting, fully fitted kitchen with utility space, master bedroom with ensuite bathroom, guest bedroom with balcony access, and common bathroom.',
        floorPlanImage: '/assets/images/3-4-496x279.png',
      },
      {
        propertyId: atlantic.id,
        name: 'Atlantic Heights Premium Unit',
        price: 148000,
        size: '150 sqm',
        bedrooms: 3,
        bathrooms: 3,
        status: 'Available',
        description: 'Expansive living + dining room with balcony, modern kitchen with store & utility area, master suite with ensuite bath & private balcony, two additional bedrooms (1 ensuite, 1 with shared bathroom), and large windows.',
        floorPlanImage: '/assets/images/4-3-496x279.png',
      },
    ],
  });

  // Urban View Apartments
  const urban = await prisma.property.create({
    data: {
      id: 'urban-view-apartments',
      name: 'Urban View Apartments',
      slug: 'urban-view-apartments',
      location: 'Kulambiro, Kampala',
      description: 'Urban View is a high-rise residential community designed for professionals, families, and creatives seeking city convenience with peaceful residential comfort. All units are sold out.',
      fullDescription: 'Located in Kulambiro, Urban View Apartments combines convenience, comfort, and affordability. Featuring sleek elevations, landscaped courtyards, and scenic city views, this project has been fully handed over and stands as a testament to Edifice Properties’ capability.',
      startingPrice: 160000000,
      currency: 'UGX',
      status: 'Sold out',
      type: 'Apartment',
      bedrooms: '1BHK, 2BHK, 3BHK',
      bathrooms: '1-3',
      sizeRange: '55–120 sqm',
      mainImage: '/assets/images/urban.webp',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.713601579294!2d32.617300714754026!3d0.37050309972985166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbba2c366ff05%3A0xe54d588523dfad2c!2sKulambiro%2C%20Kampala!5e0!3m2!1sen!2sug!4v1700000000004!5m2!1sen!2sug',
      youtubeUrl: '/assets/images/urban-view-apartments.mp4',
      featured: false,
      seoTitle: 'Urban View Apartments Kulambiro | Sold Out Premium Residences',
      seoDescription: 'Urban View Apartments in Kulambiro, Kampala. Fully sold out high-rise residential community built by Edifice Properties for professionals and families.',
      orderIndex: 5,
    },
  });

  await prisma.unit.createMany({
    data: [
      {
        propertyId: urban.id,
        name: 'Urban View 1BHK',
        price: 160000000,
        size: '55 sqm',
        bedrooms: 1,
        bathrooms: 1,
        status: 'Sold out',
        description: 'Cozy living & dining space, modern fitted kitchen, spacious bedroom, bathroom with premium fittings, balcony with city view, and wardrobe space.',
        floorPlanImage: '/assets/images/DJI-0001-1024x576.png',
      },
      {
        propertyId: urban.id,
        name: 'Urban View 2BHK',
        price: 235000000,
        size: '85 sqm',
        bedrooms: 2,
        bathrooms: 2,
        status: 'Sold out',
        description: 'Spacious living & dining area, fully equipped modular kitchen + utility space, master bedroom with attached bathroom, second bedroom with balcony access, common washroom, and ample storage space.',
        floorPlanImage: '/assets/images/DJI-0002-1024x576.png',
      },
      {
        propertyId: urban.id,
        name: 'Urban View 3BHK',
        price: 310000000,
        size: '120 sqm',
        bedrooms: 3,
        bathrooms: 3,
        status: 'Sold out',
        description: 'Expansive living & dining area with natural lighting, modern kitchen with store & utility area, master bedroom with ensuite & private balcony, two additional bedrooms (1 ensuite, 1 with balcony), and common washroom.',
        floorPlanImage: '/assets/images/DJI-0003.png',
      },
    ],
  });

  console.log('Properties and units seeded successfully.');

  // 5. Seed Blogs/News for SEO
  const blogs = [
    {
      title: 'Why Investing in Bugolobi Real Estate Yields High Returns',
      slug: 'why-investing-in-bugolobi-real-estate-yields-high-returns',
      featuredImage: '/assets/images/horizon.png',
      content: '<p>Bugolobi has long been recognized as one of Kampala\'s most premium residential suburbs. With its central location, easy access to the business district, and rich lifestyle amenities, properties like <strong>Horizon Residency</strong> on Luthuli Avenue are commanding impressive rental yields.</p><h3>High Demand for Corporate Rentals</h3><p>Due to the presence of multinational offices, schools, and medical facilities, there is a steady stream of expats and corporate managers seeking high-end apartments in Bugolobi. 2BHK and 3BHK units command premium monthly rental rates, making them attractive for buy-to-let investors.</p><h3>Infrastructure and Road Accessibility</h3><p>With Luthuli Avenue recently upgraded and improved connectivity to the Kampala-Entebbe Expressway links, Bugolobi offers seamless commutes, making it highly desirable for working professionals.</p>',
      category: 'Investment advice',
      author: 'Edifice Properties Team',
      seoTitle: 'Why Invest in Bugolobi Real Estate | Kampala Property Guide',
      seoDescription: 'Explore the high ROI potential of Bugolobi real estate. Read why Horizon Residency on Luthuli Avenue offers some of Kampala\'s best rental yields.',
      tags: 'Bugolobi, Investment, Kampala, Luxury Real Estate',
    },
    {
      title: 'Construction Update: Embassy Towers Reaches Landmark Completion Stage',
      slug: 'construction-update-embassy-towers-reaches-landmark-completion-stage',
      featuredImage: '/assets/images/embassy.webp',
      content: '<p>We are excited to share the latest progress from our <strong>Embassy Towers</strong> development. The structure is now at 85% completion, with internal plastering, piping, and wiring currently under way.</p><h3>Focusing on Premium Finishing</h3><p>At Edifice, we do not compromise on quality. Our site teams are installing high-grade aluminum windows, double glazing for noise insulation, and laying down Italian porcelain tiles in all living spaces.</p><h3>Handover Timelines</h3><p>We remain on track to begin the final walkthroughs and handovers to our reservation holders within the next few months. Limited units are still available for sale starting at $68,000.</p>',
      category: 'Construction updates',
      author: 'Project Engineering Team',
      seoTitle: 'Embassy Towers Construction Progress Report | Edifice Properties',
      seoDescription: 'Embassy Towers construction update: Structure is 85% completed. Read more about our premium fittings installation and handover timelines in Kampala.',
      tags: 'Embassy Towers, Construction Update, Kampala Road',
    },
    {
      title: '7 Crucial Steps in the Property Buying Journey in Uganda',
      slug: '7-crucial-steps-in-the-property-buying-journey-in-uganda',
      featuredImage: '/assets/images/pallazo.webp',
      content: '<p>Purchasing an apartment is an exciting milestone, but navigating the legal and financial process can feel overwhelming. Here is a clear breakdown of the customer journey when buying with Edifice Properties:</p><h3>1. Initial Consultation</h3><p>Meet with property consultants to discuss your budget, layout preferences, and select the best projects matching your needs.</p><h3>2. Exclusive Site Visit</h3><p>Take a guided site tour to see the location, view mock apartments, and inspect the building construction quality.</p><h3>3. Reservation</h3><p>Secure your unit with a reservation fee and obtain a formal reservation agreement containing specifications and price.</p><h3>4. Financial Arrangement</h3><p>Finalize your custom installment plan (we offer flexible 12 to 36-month options) or coordinate with your mortgage bank.</p><h3>5. Legal Documentation & Registration</h3><p>Our legal team prepares the sales agreement, verifies title deeds, coordinates stamp duty payment, and processes ownership transfer registration.</p><h3>6. Handover & Key Ceremony</h3><p>Once construction is fully complete, perform a joint walkthrough, log any minor snagging issues, sign the handover sheet, and receive your keys and structural warranties.</p>',
      category: 'Homeownership tips',
      author: 'Legal & Sales Dept',
      seoTitle: 'How to Buy an Apartment in Uganda | Property Buying Guide',
      seoDescription: 'Read the comprehensive 7-step guide to buying real estate in Kampala. Learn about reservation, legal processes, stamp duty, and handover.',
      tags: 'Buying Process, Legal, Homeownership, Guide',
    },
  ];

  for (const b of blogs) {
    await prisma.blog.create({ data: b });
  }
  console.log('Seeded news and blogs.');
  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
