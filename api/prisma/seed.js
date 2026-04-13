const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
    const saltRounds = 10;
    const password = await bcrypt.hash('@doctor123', saltRounds);
    const adminPassword = await bcrypt.hash('@admin123', saltRounds);

    console.log('Clearing existing data...');
    // Order matters for deletion due to relations
    await prisma.auth.deleteMany({});
    await prisma.medicine.deleteMany({});
    await prisma.prescription.deleteMany({});
    await prisma.reviews.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.appointments.deleteMany({});
    await prisma.favourites.deleteMany({});
    await prisma.doctorTimeSlot.deleteMany({});
    await prisma.doctor.deleteMany({});
    await prisma.patient.deleteMany({});

    console.log('Seeding data...');

    // 1. Create Admin
    await prisma.auth.create({
        data: {
            email: 'admin@sevacare.in',
            password: adminPassword,
            role: 'admin',
            isDemo: false
        }
    });

    // 2. Create Doctors
    const doctors = [
        {
            firstName: 'Aditya',
            lastName: 'Kulkarni',
            email: 'aditya.k@sevacare.in',
            specialization: 'Cardiologist',
            designation: 'Senior Consultant & HOD',
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            phone: '+91 98200 12345',
            biography: 'Dr. Aditya Kulkarni is a renowned cardiologist with over 18 years of experience. He specialized in Interventional Cardiology and has performed over 5,000 successful procedures at Lilavati Hospital.',
            degree: 'MBBS, MD (General Medicine), DM (Cardiology)',
            college: 'Grant Medical College & JJ Hospital, Mumbai',
            experience: '18',
            experienceHospitalName: 'Lilavati Hospital & Research Centre',
            expericenceStart: '2006',
            expericenceEnd: 'Present',
            award: 'Top Cardiologist of the Year',
            awardYear: '2022',
            registration: 'MMC-2006/03/1234',
            price: '1200',
            gender: 'male',
            verified: true,
            clinicName: 'Kulkarni Cardiac Care',
            clinicAddress: 'Andheri West, Mumbai'
        },
        {
            firstName: 'Meera',
            lastName: 'Reddy',
            email: 'meera.r@sevacare.in',
            specialization: 'Dermatologist',
            designation: 'Specialist Dermatologist',
            city: 'Bangalore',
            state: 'Karnataka',
            country: 'India',
            phone: '+91 98450 67890',
            biography: 'Dr. Meera Reddy is an expert in clinical and aesthetic dermatology. She has extensive experience in treating complex skin disorders and performing advanced laser procedures.',
            degree: 'MBBS, MD (Dermatology)',
            college: 'Bangalore Medical College and Research Institute',
            experience: '12',
            experienceHospitalName: 'Manipal Hospital, Old Airport Road',
            expericenceStart: '2012',
            expericenceEnd: 'Present',
            award: 'Excellence in Aesthetic Medicine',
            awardYear: '2021',
            registration: 'KMC-12345',
            price: '800',
            gender: 'female',
            verified: true,
            clinicName: 'Glow Skin Clinic',
            clinicAddress: 'Indiranagar, Bangalore'
        },
        {
            firstName: 'Rohan',
            lastName: 'Deshmukh',
            email: 'rohan.d@sevacare.in',
            specialization: 'Orthopedic Surgeon',
            designation: 'Consultant Surgeon',
            city: 'Pune',
            state: 'Maharashtra',
            country: 'India',
            phone: '+91 98230 54321',
            biography: 'Specializes in joint replacement and sports injuries. Completed a fellowship in Sports Medicine from Melbourne, Australia.',
            degree: 'MBBS, MS (Orthopedics), Fellow (Sports Med)',
            college: 'BJ Medical College, Pune',
            experience: '15',
            experienceHospitalName: 'Deenanath Mangeshkar Hospital',
            expericenceStart: '2009',
            expericenceEnd: 'Present',
            award: 'Best Orthopedic Surgeon - Pune',
            awardYear: '2023',
            registration: 'MMC-2009/08/5678',
            price: '1000',
            gender: 'male',
            verified: true,
            clinicName: 'OrthoHeal Clinic',
            clinicAddress: 'Shivajinagar, Pune'
        },
        {
            firstName: 'Ananya',
            lastName: 'Iyer',
            email: 'ananya.i@sevacare.in',
            specialization: 'Pediatrician',
            designation: 'Consultant Pediatrician',
            city: 'Chennai',
            state: 'Tamil Nadu',
            country: 'India',
            phone: '+91 98840 11223',
            biography: 'Dedicated to providing comprehensive healthcare for infants, children, and adolescents with over 10 years of experience.',
            degree: 'MBBS, DCH, DNB (Pediatrics)',
            college: 'Madras Medical College',
            experience: '10',
            experienceHospitalName: 'Apollo Children\'s Hospital',
            expericenceStart: '2014',
            expericenceEnd: 'Present',
            award: 'Child Health Champion',
            awardYear: '2020',
            registration: 'TNC-98765',
            price: '700',
            gender: 'female',
            verified: true,
            clinicName: 'Little Hearts Clinic',
            clinicAddress: 'Adyar, Chennai'
        },
        {
            firstName: 'Amit',
            lastName: 'Verma',
            email: 'amit.v@sevacare.in',
            specialization: 'Neurologist',
            designation: 'Senior Neurologist',
            city: 'Delhi',
            state: 'Delhi',
            country: 'India',
            phone: '+91 98110 55667',
            biography: 'One of the most senior neurologists in North India, specializing in stroke, epilepsy, and neuro-critical care.',
            degree: 'MBBS, MD (Medicine), DM (Neurology)',
            college: 'All India Institute of Medical Sciences (AIIMS), New Delhi',
            experience: '22',
            experienceHospitalName: 'Max Super Speciality Hospital, Saket',
            expericenceStart: '2002',
            expericenceEnd: 'Present',
            award: 'Life Time Achievement in Neurology',
            awardYear: '2024',
            registration: 'DMC-112233',
            price: '1500',
            gender: 'male',
            verified: true,
            clinicName: 'NeuroCare Centre',
            clinicAddress: 'Saket, New Delhi'
        }
    ];

    for (const docData of doctors) {
        const doc = await prisma.doctor.create({ data: docData });
        await prisma.auth.create({
            data: {
                email: doc.email,
                password: password,
                role: 'doctor',
                userId: doc.id
            }
        });

        // Add DoctorTimeSlots so they are available for booking out of the box
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        for (const day of days) {
            await prisma.doctorTimeSlot.create({
                data: {
                    doctorId: doc.id,
                    day: day,
                    maximumPatient: 20,
                    timeSlot: {
                        create: [
                            { startTime: '10:00 am', endTime: '01:00 pm' },
                            { startTime: '02:00 pm', endTime: '05:00 pm' }
                        ]
                    }
                }
            });
        }
    }

    // 3. Create Patients
    const patients = [
        {
            firstName: 'Rahul',
            lastName: 'Sharma',
            email: 'rahul.sharma@gmail.com',
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            mobile: '+91 98200 99887',
            bloodGroup: 'B+',
            gender: 'male'
        },
        {
            firstName: 'Priya',
            lastName: 'Gupta',
            email: 'priya.gupta@yahoo.com',
            city: 'Delhi',
            state: 'Delhi',
            country: 'India',
            mobile: '+91 98110 44332',
            bloodGroup: 'O+',
            gender: 'female'
        }
    ];

    for (const patData of patients) {
        const pat = await prisma.patient.create({ data: patData });
        await prisma.auth.create({
            data: {
                email: pat.email,
                password: password,
                role: 'patient',
                userId: pat.id
            }
        });
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
