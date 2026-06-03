import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with original site data...');

  // 1. Clean existing data
  await prisma.propertyImage.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.property.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Default Staff Users
  // Helper for email password encryption
  const ALGORITHM = 'aes-256-cbc';
  const SECRET = process.env.JWT_SECRET || 'edifice-properties-default-encryption-secret-key-32-chars-long';
  const ENCRYPTION_KEY = crypto.createHash('sha256').update(SECRET).digest(); 
  const IV_LENGTH = 16; 

  function encryptMailPassword(text: string): string {
    if (!text) return '';
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  const usersToSeed = [
    // Standard mock users
    { 
      email: 'admin@edifice.ug', 
      name: 'Edifice Admin', 
      role: 'super_admin',
      password: 'Edifice2026!'
    },
    { 
      email: 'ceo@edifice.ug', 
      name: 'Abbas Rasheed (CEO)', 
      role: 'ceo',
      password: 'Edifice2026!'
    },
    { 
      email: 'sales@edifice.ug', 
      name: 'John Tumusiime (Sales)', 
      role: 'sales',
      password: 'Edifice2026!'
    },
    { 
      email: 'marketing@edifice.ug', 
      name: 'Sarah Namubiru (Marketing)', 
      role: 'marketing',
      password: 'Edifice2026!'
    },
    { 
      email: 'accounting@edifice.ug', 
      name: 'David Okello (Accounting)', 
      role: 'accounting',
      password: 'Edifice2026!'
    },
    { 
      email: 'manager@edifice.ug', 
      name: 'Grace Kemigisha (Manager)', 
      role: 'manager',
      password: 'Edifice2026!'
    },
    // Corporate domain users
    {
      email: 'sales@edificepropertiesug.com',
      name: 'Edifice Sales Desk',
      role: 'sales',
      password: 'Edifice2026!@',
      emailHost: 'mail.privateemail.com',
      emailPort: 993,
      emailUsername: 'sales@edificepropertiesug.com',
      emailPassword: encryptMailPassword('Edifice2026!@'),
      smtpHost: 'mail.privateemail.com',
      smtpPort: 465
    },
    {
      email: 'accounts@edificepropertiesug.com',
      name: 'Edifice Accounts Desk',
      role: 'accounting',
      password: 'Edifice2026@!',
      emailHost: 'mail.privateemail.com',
      emailPort: 993,
      emailUsername: 'accounts@edificepropertiesug.com',
      emailPassword: encryptMailPassword('Edifice2026@!'),
      smtpHost: 'mail.privateemail.com',
      smtpPort: 465
    },
    {
      email: 'collections@edificepropertiesug.com',
      name: 'Edifice Collections Desk',
      role: 'accounting',
      password: 'Edifice2026@#',
      emailHost: 'mail.privateemail.com',
      emailPort: 993,
      emailUsername: 'collections@edificepropertiesug.com',
      emailPassword: encryptMailPassword('Edifice2026@#'),
      smtpHost: 'mail.privateemail.com',
      smtpPort: 465
    },
    {
      email: 'abu.accounts@edificepropertiesug.com',
      name: 'Abu (Accounts)',
      role: 'accounting',
      password: 'Edifice2026@!',
      emailHost: 'mail.privateemail.com',
      emailPort: 993,
      emailUsername: 'abu.accounts@edificepropertiesug.com',
      emailPassword: encryptMailPassword('Edifice2026@!'),
      smtpHost: 'mail.privateemail.com',
      smtpPort: 465
    },
    {
      email: 'daniella.accounts@edificepropertiesug.com',
      name: 'Daniella (Accounts)',
      role: 'accounting',
      password: 'Edifice2026@!',
      emailHost: 'mail.privateemail.com',
      emailPort: 993,
      emailUsername: 'daniella.accounts@edificepropertiesug.com',
      emailPassword: encryptMailPassword('Edifice2026@!'),
      smtpHost: 'mail.privateemail.com',
      smtpPort: 465
    },
    {
      email: 'ritah.sales@edificepropertiesug.com',
      name: 'Ritah (Sales)',
      role: 'sales',
      password: 'Edifice2026!@',
      emailHost: 'mail.privateemail.com',
      emailPort: 993,
      emailUsername: 'ritah.sales@edificepropertiesug.com',
      emailPassword: encryptMailPassword('Edifice2026!@'),
      smtpHost: 'mail.privateemail.com',
      smtpPort: 465
    },
    {
      email: 'milly.sales@edificepropertiesug.com',
      name: 'Milly (Sales)',
      role: 'sales',
      password: 'Edifice2026!@',
      emailHost: 'mail.privateemail.com',
      emailPort: 993,
      emailUsername: 'milly.sales@edificepropertiesug.com',
      emailPassword: encryptMailPassword('Edifice2026!@'),
      smtpHost: 'mail.privateemail.com',
      smtpPort: 465
    },
    {
      email: 'hatim.sales@edificepropertiesug.com',
      name: 'Hatim (Sales)',
      role: 'sales',
      password: 'Edifice2026!@',
      emailHost: 'mail.privateemail.com',
      emailPort: 993,
      emailUsername: 'hatim.sales@edificepropertiesug.com',
      emailPassword: encryptMailPassword('Edifice2026!@'),
      smtpHost: 'mail.privateemail.com',
      smtpPort: 465
    },
    {
      email: 'leah.sales@edificepropertiesug.com',
      name: 'Leah (Sales)',
      role: 'sales',
      password: 'Edifice2026!@',
      emailHost: 'mail.privateemail.com',
      emailPort: 993,
      emailUsername: 'leah.sales@edificepropertiesug.com',
      emailPassword: encryptMailPassword('Edifice2026!@'),
      smtpHost: 'mail.privateemail.com',
      smtpPort: 465
    }
  ];

  for (const u of usersToSeed) {
    const passwordHash = bcrypt.hashSync(u.password, 10);
    const user = await prisma.user.create({
      data: {
        email: u.email,
        name: u.name,
        passwordHash,
        role: u.role,
        emailHost: u.emailHost || null,
        emailPort: u.emailPort || null,
        emailUsername: u.emailUsername || null,
        emailPassword: u.emailPassword || null,
        smtpHost: u.smtpHost || null,
        smtpPort: u.smtpPort || null,
      }
    });
    console.log('User seeded:', user.email, `(${user.role})`);
  }

  // 3. Create Global Settings
  const settings = [
    // Branding & Global
    { key: 'site_logo_url', value: '/assets/images/edifice-logo.svg', description: 'Logo URL for header and footer' },
    
    // Contacts & Addresses
    { key: 'phone_primary', value: '+256786000112', description: 'Primary contact phone number' },
    { key: 'phone_alt1', value: '+256763700206', description: 'Secondary phone number' },
    { key: 'phone_alt2', value: '+256766759416', description: 'Third phone number (Sales)' },
    { key: 'phone_alt3', value: '+256709269168', description: 'Fourth phone number (Support)' },
    { key: 'phone_alt4', value: '+256770833189', description: 'Fifth phone number (Lead Specialist)' },
    { key: 'whatsapp_number', value: '256786000112', description: 'WhatsApp number in international format (no +)' },
    { key: 'contact_email', value: 'edificepropertiesltd@gmail.com', description: 'Contact email address' },
    { key: 'office_address', value: 'Plot 8, Kanjokya Street, (Beside The Aleph Restaurant and Africana Tours & Travels Office), Kololo, Kampala, Uganda.', description: 'Physical office address' },
    { key: 'po_box', value: 'P.O. Box 108048 Kampala Nakawa.', description: 'P.O. Box address' },
    { key: 'business_hours', value: 'Mon - Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 1:00 PM, Sun: Closed (visits by appointment)', description: 'Office operating hours' },
    { key: 'map_iframe_url', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.742880345094!2d32.59733471475396!3d0.33870809975306606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb0e35dc8f5d%3A0x7d0fa5a40bf5b9f7!2sKanjokya%20St%2C%20Kampala!5e0!3m2!1sen!2sug!4v1700000000000!5m2!1sen!2sug', description: 'Google Maps embed iframe URL' },
    
    // Homepage Banner & Headers
    { key: 'home_exclusive_offer_banner_tag', value: 'Exclusive Portfolio Offer', description: 'Homepage top banner tag' },
    { key: 'home_exclusive_offer_banner_text', value: 'Discount of up to 3% on specific 1BHK, 2BHK & 3BHK premium suites. Limited inventory remaining.', description: 'Homepage top banner discount message' },
    { key: 'home_featured_properties_tag', value: 'Exclusive Portfolio', description: 'Featured properties section tag' },
    { key: 'home_featured_properties_title', value: 'Beyond shaping skylines, Edifice is shaping futures', description: 'Featured properties section title' },
    { key: 'home_featured_properties_desc', value: 'Dive into our world where architectural prowess meets natural design, curating urban oases that redefine modern living in Kampala.', description: 'Featured properties section description' },
    
    // Homepage Identity
    { key: 'home_identity_tag', value: 'Our Identity', description: 'About section identity tag' },
    { key: 'home_identity_title', value: 'Redefining urban spaces for future living', description: 'About section identity title' },
    { key: 'home_identity_desc1', value: 'Started with a casual conversation between three people having coffee at a cafe, talking about developments to overcome the housing deficit in Uganda, the Pearl of Africa. Founded in 2022, Edifice Properties is Uganda’s design-led real estate developer and endeavours to craft beautiful properties and communities for high-quality lifestyles.', description: 'About section identity description paragraph 1' },
    { key: 'home_identity_desc2', value: 'A truly customer-centric developer in the Ugandan real estate market, we develop beautiful residences in Kampala designed by incredible artistry and impeccable architecture.', description: 'About section identity description paragraph 2' },
    
    // Homepage Pillars
    { key: 'home_pillar1_title', value: 'Innovate Luxury', description: 'Homepage Pillar 1 title' },
    { key: 'home_pillar1_desc', value: 'Develop high-quality, luxurious residential and commercial properties that leverage the latest in technology and architectural thinking, remaining financially accessible.', description: 'Homepage Pillar 1 description' },
    { key: 'home_pillar2_title', value: 'Sustainability', description: 'Homepage Pillar 2 title' },
    { key: 'home_pillar2_desc', value: 'Commit to environmentally responsible building practices that minimize ecological impact, incorporating green tech and renewable materials where possible.', description: 'Homepage Pillar 2 description' },
    { key: 'home_pillar3_title', value: 'Enhance Lifestyles', description: 'Homepage Pillar 3 title' },
    { key: 'home_pillar3_desc', value: 'Focus on properties that offer enhanced lifestyles through smart-home ready systems, resort-style shared amenities, and wellness-focused communal designs.', description: 'Homepage Pillar 3 description' },
    { key: 'home_pillar4_title', value: 'Customer Focus', description: 'Homepage Pillar 4 title' },
    { key: 'home_pillar4_desc', value: 'Maintain a steadfast focus on customer satisfaction, providing clear title guarantees, transparent purchase steps, and reliable post-handover support.', description: 'Homepage Pillar 4 description' },
    
    // Homepage Leadership (Co-Founders)
    { key: 'cofounder1_name', value: 'Abbas Rasheed', description: 'Co-founder 1 name' },
    { key: 'cofounder1_title', value: 'C. E. O, Edifice Properties Limited', description: 'Co-founder 1 designation' },
    { key: 'cofounder1_image', value: '/assets/images/Mr.-abbas-Message-02-1.jpg', description: 'Co-founder 1 photo path' },
    { key: 'cofounder1_statement', value: 'Our focus is to redefine the standard of living by integrating cutting-edge technology and modern design with innovative luxury, making luxury accessible for everyone. Our vision is to create homes that not only boast aesthetic excellence and innovative features but also enhance the living experience of our customers through sustainability and smart solutions.', description: 'Co-founder 1 message statement' },
    
    { key: 'cofounder2_name', value: 'Mr. Mou Shaojiu', description: 'Co-founder 2 name' },
    { key: 'cofounder2_title', value: 'Director, Edifice Properties Limited', description: 'Co-founder 2 designation' },
    { key: 'cofounder2_image', value: '/assets/images/WhatsApp-Image-2025-10-01-at-1.01.10-PM.jpeg', description: 'Co-founder 2 photo path' },
    { key: 'cofounder2_statement', value: 'At Edifice Properties Limited, we believe that construction is not just about building structures, but about creating enduring value for our clients and communities. With a strong foundation in both construction management and contractor supervision, I personally ensure that every project is executed with precision, efficiency, and integrity.', description: 'Co-founder 2 message statement' },
    
    // Homepage Cinematic Media
    { key: 'home_video_title', value: 'Horizon Residency & Edifice Property Developments', description: 'Cinematic video section title' },
    { key: 'home_video_thumbnail', value: '/assets/images/horizon.png', description: 'Cinematic video cover thumbnail' },
    { key: 'youtube_hero_url', value: 'https://youtu.be/LYgWq4vRT8c?si=ZIuQnIDVuzGkP-oh', description: 'Background video link for Homepage' },
    
    // Homepage Testimonials
    { key: 'testimonial1_name', value: 'Sarah K.', description: 'Testimonial 1 client name' },
    { key: 'testimonial1_role', value: 'Kampala Resident', description: 'Testimonial 1 client role' },
    { key: 'testimonial1_text', value: 'Buying my first apartment with Edifice Properties was the best decision I ever made. The team guided me through every step, from the site visit to paperwork, making the process smooth and stress-free. Today, I’m a proud home owner and couldn’t be happier with the quality and finishing of my home.', description: 'Testimonial 1 review text' },
    
    { key: 'testimonial2_name', value: 'Mr. Okello', description: 'Testimonial 2 client name' },
    { key: 'testimonial2_role', value: 'Entebbe Resident', description: 'Testimonial 2 client role' },
    { key: 'testimonial2_text', value: 'Our family needed more space, and Edifice Properties delivered beyond our expectations. The 3BHK apartment at Horizon Residency has everything we dreamed of – modern design, secure environment, and great amenities for our kids. It truly feels like home.', description: 'Testimonial 2 review text' },
    
    { key: 'testimonial3_name', value: 'James M.', description: 'Testimonial 3 client name' },
    { key: 'testimonial3_role', value: 'Real Estate Investor', description: 'Testimonial 3 client role' },
    { key: 'testimonial3_text', value: 'As an investor, I look for professionalism and reliability. Edifice Properties not only provided excellent property options but also gave me a strong return on my investment. Their projects are strategically located and built with great attention to detail.', description: 'Testimonial 3 review text' },
    
    // About Us Page Hero
    { key: 'about_hero_tag', value: 'Our Story', description: 'About hero section tag' },
    { key: 'about_hero_title', value: 'Crafting Artful Suburbs', description: 'About hero section title' },
    { key: 'about_hero_desc', value: 'Uganda\'s design-led real estate developer creating high-quality properties and communities for sophisticated lifestyles.', description: 'About hero section description' },
    
    // About Us Main Story
    { key: 'about_story_tag', value: 'Who We Are', description: 'About main story section tag' },
    { key: 'about_story_title', value: 'About Edifice Properties', description: 'About main story section title' },
    { key: 'about_story_desc1', value: 'Started with a casual conversation between three people having coffee at a cafe, talking about the development to overcome the housing deficit in Uganda aka The Pearl of Africa. Founded in 2022, Edifice Properties is Uganda’s design-led real estate developer and endeavours to craft beautiful properties and communities for high-quality lifestyles.', description: 'About main story paragraph 1' },
    { key: 'about_story_desc2', value: 'A truly customer-centric developer in the Ugandan real estate market, we develop beautiful residences in Kampala designed by incredible artistry and impeccable architecture.', description: 'About main story paragraph 2' },
    { key: 'about_story_desc3', value: 'Our customers\' refined tastes inspire us to create compelling luxury properties that consistently transcend fashions and trends. We dream to build residences for people who truly appreciate design – from the first principles to the last detail.', description: 'About main story paragraph 3' },
    { key: 'about_story_coffee_quote', value: 'Started with a casual conversation between three people having coffee at a cafe...', description: 'About main story coffee callout quote' },
    
    // About Us Design Philosophy
    { key: 'about_design_philosophy_image', value: '/assets/images/horizon.png', description: 'About page philosophy image path' },
    { key: 'about_design_philosophy_title', value: 'design philosophy', description: 'About page philosophy tag text' },
    { key: 'about_design_philosophy_caption', value: 'Impeccable Architecture & Artistry', description: 'About page philosophy caption title' },
    
    // About Us Pillars
    { key: 'about_pillar1_title', value: 'Change Mindsets', description: 'About page Pillar 1 title' },
    { key: 'about_pillar1_desc', value: 'Reimagining what urban residential living in Kampala can look and feel like.', description: 'About page Pillar 1 description' },
    { key: 'about_pillar2_title', value: 'Establish Credibility', description: 'About page Pillar 2 title' },
    { key: 'about_pillar2_desc', value: 'Delivering uncompromised building standards, transparent titles, and on-time completion.', description: 'About page Pillar 2 description' },
    { key: 'about_pillar3_title', value: 'Evoke Emotions', description: 'About page Pillar 3 title' },
    { key: 'about_pillar3_desc', value: 'Crafting spaces that resonate deeply, bringing joy, comfort, and pride to our homeowners.', description: 'About page Pillar 3 description' },
    { key: 'about_pillar4_title', value: 'Differentiation', description: 'About page Pillar 4 title' },
    { key: 'about_pillar4_desc', value: 'Leading with distinct, artful architecture rather than replicating standard designs.', description: 'About page Pillar 4 description' },
    
    // About Us Corporate Mission
    { key: 'about_mission_tag', value: 'Our Vision', description: 'About page mission section tag' },
    { key: 'about_mission_title', value: 'Our Corporate Mission', description: 'About page mission section title' },
    { key: 'about_mission_desc', value: 'To build a reliable bridge between luxury living and financial feasibility, creating long-term value for investors and beautiful homes for owners.', description: 'About page mission section description' },
    { key: 'about_mission_item1_title', value: 'Innovate Luxury', description: 'About mission point 1 title' },
    { key: 'about_mission_item1_desc', value: 'Develop high-quality, luxurious residential and commercial properties that leverage the latest in technology and architectural thinking, while remaining financially accessible to a broad market segment.', description: 'About mission point 1 description' },
    { key: 'about_mission_item2_title', value: 'Sustainability', description: 'About mission point 2 title' },
    { key: 'about_mission_item2_desc', value: 'Commit to environmentally responsible building practices that minimize ecological impact and promote long-term sustainability, incorporating green technologies and renewable materials wherever possible.', description: 'About mission point 2 description' },
    { key: 'about_mission_item3_title', value: 'Enhance Lifestyles', description: 'About mission point 3 title' },
    { key: 'about_mission_item3_desc', value: 'Focus on properties that offer enhanced lifestyles through smart home features, community amenities, and wellness-focused designs.', description: 'About mission point 3 description' },
    { key: 'about_mission_item4_title', value: 'Customer Focus', description: 'About mission point 4 title' },
    { key: 'about_mission_item4_desc', value: 'Maintain a steadfast focus on customer satisfaction and user experience, ensuring that all developments cater to the intricate needs and preferences of our clients.', description: 'About mission point 4 description' },
    
    // About Us Global Standards
    { key: 'about_global_tag', value: 'Global Standards', description: 'About page global section tag' },
    { key: 'about_global_title', value: 'Redefining Global Skylines', description: 'About page global section title' },
    { key: 'about_global_desc1', value: 'At Edifice, we pride ourselves on redefining cityscapes across the globe. We’re not just about constructing iconic buildings; our vision transcends traditional boundaries.', description: 'About page global description paragraph 1' },
    { key: 'about_global_desc2', value: 'We aim to reshape the essence of urban living by creating self-contained micro-cities that flawlessly blend residential, commercial, and recreational spaces, delivering a comprehensive urban experience tailored for the modern individual.', description: 'About page global description paragraph 2' },
    { key: 'about_global_cta_title', value: 'Get Your Dream House', description: 'About page global sidebar CTA title' },
    { key: 'about_global_cta_desc', value: 'Get in touch with us and our experts and developers would love to contribute their expertise and insights and help you today.', description: 'About page global sidebar CTA description' },
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

  // 4b. Create Property Images
  const propertyImages = [
    // Horizon Residency
    { propertyId: 'horizon-residency', url: '/assets/images/horizon.png', category: 'exterior', label: 'Architectural Entrance Facade', description: 'Stunning modern exterior featuring floor-to-ceiling glass paneling and premium structural finishing.' },
    { propertyId: 'horizon-residency', url: '/assets/images/1.webp', category: 'exterior', label: 'Cinematic Facade Rendering', description: 'Photorealistic exterior rendering displaying the modern verticality and premium paint styling of Horizon Residency.' },
    { propertyId: 'horizon-residency', url: '/assets/images/2-1.webp', category: 'exterior', label: 'Corner & Balcony Perspectives', description: 'Detailed exterior perspective highlighting double-aspect balconies and architectural sunshading.' },
    { propertyId: 'horizon-residency', url: '/assets/images/5.webp', category: 'exterior', label: 'Exterior Access & Driveway', description: 'Double-entry driveway with beautifully landscaped drop-off zones directly along Luthuli Avenue.' },
    { propertyId: 'horizon-residency', url: '/assets/images/6.webp', category: 'interior', label: 'Bespoke Interior Living Space', description: 'Sophisticated living lounge area featuring custom walnut wall panels, gold accents, and recessed LED ambient lighting.' },
    { propertyId: 'horizon-residency', url: '/assets/images/3-1.webp', category: 'interior', label: 'Signature Master Bedroom Showcase', description: 'Luxury bedroom visualization detailing premium floor tiling, integrated wardrobes, and warm ambient light channels.' },
    { propertyId: 'horizon-residency', url: '/assets/images/4-1.webp', category: 'interior', label: 'Panoramic Lounge View Concept', description: 'Spacious open-plan lounge concept looking out over the city with distinct dining partitions.' },
    { propertyId: 'horizon-residency', url: '/assets/images/EDIFICE-PROFILE._page-0071.jpg', category: 'floorplan', label: 'Development Block Diagram Layout', description: 'Detailed site map and blocks routing overview demonstrating secure neighborhood boundary lines.' },
    { propertyId: 'horizon-residency', url: '/assets/images/EDIFICE-PROFILE._page-0072.jpg', category: 'floorplan', label: 'Apartment Type 1 Layout Specifications', description: 'Engineering plans highlighting door width clearances, window placements, and structural partitions.' },
    { propertyId: 'horizon-residency', url: '/assets/images/EDIFICE-PROFILE._page-0073.jpg', category: 'floorplan', label: 'Apartment Type 2 Layout Specifications', description: 'Detailed bathroom plumbing guides and kitchen cabinetry partition outlines.' },
    { propertyId: 'horizon-residency', url: '/assets/images/DTB-Flyers-Horizon-Residency-1638x2048.png', category: 'floorplan', label: 'Horizon Residency Brochure Flyer', description: 'Complete project documentation flyer detailing dimensions, structural specifications, and corporate features.' },

    // Embassy Towers
    { propertyId: 'embassy-towers', url: '/assets/images/embassy.webp', category: 'exterior', label: 'Corporate District Elevation', description: 'Grand towering steel-and-glass design set in the heart of Kampala\'s prestigious business district.' },
    { propertyId: 'embassy-towers', url: '/assets/images/WhatsApp-Image-2024-09-12-at-1.16.19-PM-2.jpeg', category: 'exterior', label: 'Structural Foundation Progress', description: 'High-durability reinforced concrete pillar framework under construction on the Embassy Towers site.' },
    { propertyId: 'embassy-towers', url: '/assets/images/WhatsApp-Image-2024-09-12-at-1.16.20-PM.jpeg', category: 'exterior', label: 'Floor Level Construction Update', description: 'Laying out high-strength post-tensioned slabs and primary conduits during main framing.' },
    { propertyId: 'embassy-towers', url: '/assets/images/WhatsApp-Image-2024-09-12-at-1.16.22-PM.jpeg', category: 'exterior', label: 'Exterior Facade Glass Installation', description: 'Double-glazed soundproof glass panels being assembled across the building facade layers.' },
    { propertyId: 'embassy-towers', url: '/assets/images/WhatsApp-Image-2024-09-12-at-1.16.24-PM.jpeg', category: 'exterior', label: 'Acoustic Glazing Assembly', description: 'Engineered structural panels details providing optimal noise dampening for interior office layouts.' },
    { propertyId: 'embassy-towers', url: '/assets/images/8-1.png', category: 'interior', label: 'Modular Luxury Kitchen Layout', description: 'Bespoke cabinet plans featuring gold framing, integrated cooktop ventilation, and quartz counters.' },
    { propertyId: 'embassy-towers', url: '/assets/images/9.png', category: 'interior', label: 'Premium Bathroom Finishes', description: 'Elegantly tiled walk-in rain showers with gold fixtures and suspended vanity layouts.' },
    { propertyId: 'embassy-towers', url: '/assets/images/10.png', category: 'interior', label: 'Executive Living Room Salon', description: 'Warm lounge renderings showcasing custom wall sconces, integrated media walls, and ceiling coves.' },
    { propertyId: 'embassy-towers', url: '/assets/images/2-1-1024x722.png', category: 'floorplan', label: '1BHK & 2BHK Layout Outline', description: 'Open living-dining space optimization plans showing structural columns and partition layouts.' },
    { propertyId: 'embassy-towers', url: '/assets/images/3-1-1024x722.png', category: 'floorplan', label: '3BHK Executive Layout Outline', description: 'High-density three-bedroom floor plans with en-suite master facilities and dual aspect balconies.' },
    { propertyId: 'embassy-towers', url: '/assets/images/DTB-Flyers-Embassy-Towers-1638x2048.png', category: 'floorplan', label: 'Embassy Towers Brochure Flyer', description: 'Promotional brochure highlighting payment installments, project location metrics, and site layouts.' },

    // Elite Palazzo Naguru
    { propertyId: 'elite-palazzo-naguru', url: '/assets/images/pallazo.webp', category: 'exterior', label: 'Naguru Hilltop Architectural Facade', description: 'Majestic design standing at Kampala\'s highest point, offering panoramic outlooks over the cityscape.' },
    { propertyId: 'elite-palazzo-naguru', url: '/assets/images/envato-labs-image-edit-2.webp', category: 'exterior', label: 'Perimeter Driveway & Dropoff', description: 'Gated parking approach, secure guard facilities, and beautifully paved modern vehicular rampways.' },
    { propertyId: 'elite-palazzo-naguru', url: '/assets/images/WhatsApp-Image-2025-01-09-at-12.57.20_31ca38cf.jpg', category: 'exterior', label: 'Construction Site Earthworks', description: 'Deep excavation and soil retention wall construction on the Naguru hilltop site.' },
    { propertyId: 'elite-palazzo-naguru', url: '/assets/images/WhatsApp-Image-2025-01-09-at-12.57.20_cb4802eb.jpg', category: 'exterior', label: 'Structural Floor Construction', description: 'Laying concrete columns and tensioning deck reinforcements for upper apartment levels.' },
    { propertyId: 'elite-palazzo-naguru', url: '/assets/images/WhatsApp-Image-2025-01-09-at-12.57.20_f3822509.jpg', category: 'exterior', label: 'Foundation Core Piling Update', description: 'Piling machine active on site, drilling deep concrete piers to ensure load-bearing hilltop stability.' },
    { propertyId: 'elite-palazzo-naguru', url: '/assets/images/2.png', category: 'interior', label: 'Marble Reception Lobby', description: 'Imported Greek marble floors and custom gold-accented light installations welcoming residents.' },
    { propertyId: 'elite-palazzo-naguru', url: '/assets/images/3.png', category: 'interior', label: 'Hilltop Sunset Balcony View', description: 'Spacious interior salon with double glass doors leading directly to sprawling hilltop viewing terraces.' },
    { propertyId: 'elite-palazzo-naguru', url: '/assets/images/Flux_Schnell_a_lush_3d_render_of_Photorealistic_luxury_standar_2.jpg', category: 'interior', label: 'Master Penthouse Suite Rendering', description: 'Luxury master bedroom space detailing plush headboard panels, gold accents, and floor-to-ceiling windows.' },
    { propertyId: 'elite-palazzo-naguru', url: '/assets/images/4.png', category: 'floorplan', label: 'Precision Penthouse Layout', description: 'Elite layout prioritizing cross-ventilation, panoramic terraces, and distinct domestic quarters.' },
    { propertyId: 'elite-palazzo-naguru', url: '/assets/images/EDIFICE-PROFILE._page-0029.jpg', category: 'floorplan', label: 'Elite Palazzo Layout Dimensions', description: 'Dimension specs sheets showing bedroom sizes, terrace areas, and total square footage breakdowns.' },
    { propertyId: 'elite-palazzo-naguru', url: '/assets/images/DTB-FlyersElite-Palazzo-1638x2048.png', category: 'floorplan', label: 'Naguru Palazzo Brochure Flyer', description: 'Executive project overview brochure displaying premium finishes and amenity highlights.' },

    // Atlantic Apartments
    { propertyId: 'atlantic-apartments', url: '/assets/images/envato-labs-image-edit-64-1.png', category: 'exterior', label: 'Atlantic Heights Main Facade', description: 'Clean architectural lines and modern high-end stucco finish with custom structural accents.' },
    { propertyId: 'atlantic-apartments', url: '/assets/images/2-4-496x279.png', category: 'exterior', label: 'Lush Landscaping & Approach', description: 'Secure gated security perimeter and landscaped front walkways tailored for family arrivals.' },
    { propertyId: 'atlantic-apartments', url: '/assets/images/3-4-496x279.png', category: 'interior', label: 'Sophisticated Living Area', description: 'Premium hardwood paneling and contemporary luxury lighting fixture layouts.' },
    { propertyId: 'atlantic-apartments', url: '/assets/images/4-3-496x279.png', category: 'interior', label: 'Luxury Master Suite Room', description: 'Plush master bedroom renders showing expansive closets and elegant, relaxing vanity units.' },
    { propertyId: 'atlantic-apartments', url: '/assets/images/5-2-496x279.png', category: 'floorplan', label: '1BHK Family Starter Plan', description: 'Optimal layout highlighting separate laundry cabinets and an integrated breakfast bar.' },
    { propertyId: 'atlantic-apartments', url: '/assets/images/6-1-496x279.png', category: 'floorplan', label: '2BHK Premium Family Plan', description: 'Balanced space offering two self-contained bedrooms and high daylight penetration.' },
    { propertyId: 'atlantic-apartments', url: '/assets/images/7-1-496x279.png', category: 'floorplan', label: '3BHK Spacious Residence Plan', description: 'Sprawling three-bedroom layout optimized specifically for diaspora buyers seeking secure investment equity.' },

    // Urban View Apartments
    { propertyId: 'urban-view-apartments', url: '/assets/images/urban.webp', category: 'exterior', label: 'Urban View Main Approach', description: 'Peaceful residential architecture nestled within the green, serene valleys of Kulambiro.' },
    { propertyId: 'urban-view-apartments', url: '/assets/images/DJI-0001-1024x576.png', category: 'exterior', label: 'Panoramic Aerial Drone View', description: 'Sweeping drone photography of the building\'s rooftop gazebo oasis and landscaped perimeter.' },
    { propertyId: 'urban-view-apartments', url: '/assets/images/DJI-0002-1024x576.png', category: 'interior', label: 'Light-Filled Living Room', description: 'Warm, cozy family lounge showing high ceilings and broad double-glazed slider windows.' },
    { propertyId: 'urban-view-apartments', url: '/assets/images/DJI-0003.png', category: 'floorplan', label: 'Type A Optimized Floor Plan', description: 'Functional layout maximizing kitchen cabinetry and private bedroom alcoves.' },
    { propertyId: 'urban-view-apartments', url: '/assets/images/DJI-0004.png', category: 'floorplan', label: 'Type B Multi-Balcony Floor Plan', description: 'Large family layout featuring dual aspects and expansive outdoor balcony seating area plans.' },
    { propertyId: 'urban-view-apartments', url: '/assets/images/EDIFICE-PROFILE._page-0048.jpg', category: 'floorplan', label: 'Block Walkway Site Diagram', description: 'Site layout plan displaying building access roadways, common gardens, and children play fields.' },
    { propertyId: 'urban-view-apartments', url: '/assets/images/EDIFICE-PROFILE._page-0049.jpg', category: 'floorplan', label: '1BHK Dimensions & Sizing Sheets', description: 'Technical drawing demonstrating room boundaries, structural doors, and plumbing pipes layout.' },
    { propertyId: 'urban-view-apartments', url: '/assets/images/EDIFICE-PROFILE._page-0050.jpg', category: 'floorplan', label: '2BHK Dimensions & Sizing Sheets', description: 'Comprehensive 2-bedroom dimensions outlining balcony spaces and kitchen counter widths.' },
    { propertyId: 'urban-view-apartments', url: '/assets/images/EDIFICE-PROFILE._page-0052.jpg', category: 'floorplan', label: '3BHK Executive Penthouses Layout', description: 'Upper floor planning detailing maids rooms, separate laundry utilities, and penthouse layouts.' }
  ];

  for (const img of propertyImages) {
    await prisma.propertyImage.create({ data: img });
  }
  console.log('Seeded property gallery images.');

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
