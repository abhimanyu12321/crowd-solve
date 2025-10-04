// Seed script to add sample problems for Delhi/NCR residents
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const mongoUri = envContent.match(/MONGODB_URI=(.+)/)?.[1]?.trim();

if (!mongoUri) {
  console.error('❌ Could not find MONGODB_URI in .env.local');
  process.exit(1);
}

// Use existing user ID
const EXISTING_USER_ID = '68e0c0853ed6c16b19770425';

// Sample problems data
const sampleProblems = [
  {
    title: "Street lights not working on Main Road",
    description: "The street lights on Main Road near Connaught Place have been non-functional for the past week. This is causing safety concerns for pedestrians and commuters during night hours. Multiple bulbs need replacement.",
    location: "Delhi"
  },
  {
    title: "Garbage collection irregular in Sector 18",
    description: "Garbage collection has been very irregular in Sector 18 residential area. Waste is piling up on streets for days, causing health hazards and bad odor. Need regular daily collection service.",
    location: "Noida"
  },
  {
    title: "Pothole on NH-48 near Cyber City",
    description: "Large pothole has developed on NH-48 near Cyber City metro station. It's causing traffic jams and vehicle damage. The pothole is approximately 2 feet deep and 4 feet wide. Urgent repair needed.",
    location: "Gurgaon"
  },
  {
    title: "Water supply issues in Dwarka Sector 10",
    description: "Residents of Dwarka Sector 10 are facing severe water shortage. Water supply is available only for 2 hours daily instead of promised 4 hours. Water pressure is also very low.",
    location: "Delhi"
  },
  {
    title: "Broken footpath near City Center Mall",
    description: "The footpath near City Center Mall in Sector 32 has broken tiles and exposed manholes. Several people have tripped and injured themselves. Immediate repair and safety measures needed.",
    location: "Noida"
  },
  {
    title: "Traffic signal malfunction at Sohna Road",
    description: "Traffic signal at Sohna Road intersection has been malfunctioning for 3 days. All lights remain red or don't change properly, causing massive traffic congestion during peak hours.",
    location: "Gurgaon"
  },
  {
    title: "Stray dog menace in Rohini Sector 15",
    description: "Increasing number of aggressive stray dogs in Rohini Sector 15 parks and streets. Children and elderly people are afraid to go out. Need animal control and vaccination drive.",
    location: "Delhi"
  },
  {
    title: "Poor drainage system in Sector 62",
    description: "Water logging during monsoon season in Sector 62 due to poor drainage system. Roads become impassable after even light rain. Many areas remain flooded for hours affecting daily commute.",
    location: "Noida"
  },
  {
    title: "Illegal parking near Metro Station",
    description: "Illegal parking of vehicles near MG Road Metro Station is blocking the main road. Traffic police presence is minimal. This creates traffic bottlenecks especially during office hours.",
    location: "Gurgaon"
  },
  {
    title: "Public toilet maintenance in Karol Bagh",
    description: "Public toilets in Karol Bagh market area are in terrible condition. No water supply, broken doors, and extremely unhygienic. Needs immediate cleaning and regular maintenance.",
    location: "Delhi"
  },
  {
    title: "Park equipment broken in Sector 50",
    description: "Children's park in Sector 50 has broken swings, slides, and see-saws. Equipment is rusty and dangerous. Park needs renovation and new equipment installation for kids' safety.",
    location: "Noida"
  },
  {
    title: "Air pollution from construction site",
    description: "Construction site near Golf Course Road is causing severe air pollution. No dust control measures, causing breathing problems for nearby residents. Construction material scattered on roads.",
    location: "Gurgaon"
  },
  {
    title: "Power cuts in Lajpat Nagar during summer",
    description: "Frequent unannounced power cuts in Lajpat Nagar area lasting 2-3 hours. This is causing problems especially during summer heat. Inverters are not sufficient for long duration cuts.",
    location: "Delhi"
  },
  {
    title: "Bus stop shelter damaged in Sector 137",
    description: "Bus stop shelter in Sector 137 is completely damaged with broken roof and benches. Commuters have no protection from sun and rain while waiting for buses.",
    location: "Noida"
  },
  {
    title: "Overflowing sewage in DLF Phase 2",
    description: "Sewage overflow near residential complex in DLF Phase 2. Manholes are overflowing with waste water, creating unhygienic conditions and foul smell in the entire area.",
    location: "Gurgaon"
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');
    
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Get existing Problem model
    const Problem = mongoose.model('Problem', new mongoose.Schema({}, { strict: false }));

    console.log('📝 Adding sample problems...\n');
    console.log(`👤 Using existing user ID: ${EXISTING_USER_ID}\n`);

    // Check existing problems count
    const existingCount = await Problem.countDocuments();
    console.log(`   Current problems in database: ${existingCount}`);

    // Add each problem
    let addedCount = 0;
    for (const problemData of sampleProblems) {
      // Check if similar problem exists
      const exists = await Problem.findOne({ title: problemData.title });
      
      if (!exists) {
        await Problem.create({
          ...problemData,
          createdBy: new mongoose.Types.ObjectId(EXISTING_USER_ID),
          createdAt: new Date()
        });
        console.log(`   ✅ Added: ${problemData.title}`);
        addedCount++;
      } else {
        console.log(`   ⏭️  Skipped (exists): ${problemData.title}`);
      }
    }

    const finalCount = await Problem.countDocuments();
    
    console.log('\n' + '='.repeat(60));
    console.log('✨ Seeding Complete!');
    console.log('='.repeat(60));
    console.log(`📊 Problems added: ${addedCount}`);
    console.log(`📊 Total problems in database: ${finalCount}`);
    console.log('\n👤 Existing Account:');
    console.log('   Email: test@tes.com');
    console.log('\n🚀 Start your app with: npm run dev');
    console.log('🌐 Visit: http://localhost:3000\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed\n');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
