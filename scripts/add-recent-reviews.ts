import { PrismaClient, ReviewChannel, ReviewStatus } from "@prisma/client";

const prisma = new PrismaClient();

const recentReviews = [
    {
        propertySlug: "shoreditch-heights",
        guestName: "Emma Johnson",
        guestEmail: "emma.j@email.com",
        overallRating: 4.8,
        review: "Just checked out this morning - absolutely fantastic stay! The apartment is modern, clean, and perfectly located. The host was super responsive and check-in was seamless. Highly recommend!",
        channel: "AIRBNB" as ReviewChannel,
        status: "PUBLISHED" as ReviewStatus,
        isApproved: true,
        cleanliness: 4.9,
        communication: 4.8,
        location: 4.9,
        checkin: 4.7,
        accuracy: 4.8,
        value: 4.6,
        submittedAt: new Date("2025-09-15T10:30:00Z"), // Today
    },
    {
        propertySlug: "canary-wharf-tower",
        guestName: "David Chen",
        guestEmail: "d.chen@email.com",
        overallRating: 4.9,
        review: "Perfect for business travel! Amazing views from the 15th floor and excellent amenities. The location is unbeatable for Canary Wharf meetings. Will definitely book again.",
        channel: "BOOKING" as ReviewChannel,
        status: "PUBLISHED" as ReviewStatus,
        isApproved: true,
        cleanliness: 4.8,
        communication: 4.9,
        location: 5.0,
        checkin: 4.8,
        accuracy: 4.9,
        value: 4.7,
        submittedAt: new Date("2025-09-15T09:15:00Z"), // Today
    },
    {
        propertySlug: "fitzrovia-square",
        guestName: "Sophie Martinez",
        guestEmail: "sophie.m@email.com",
        overallRating: 4.7,
        review: "Lovely studio in the heart of Fitzrovia! Everything you need for a perfect London stay. Great restaurants and transport links nearby. The space is small but very well designed.",
        channel: "DIRECT" as ReviewChannel,
        status: "PUBLISHED" as ReviewStatus,
        isApproved: true,
        cleanliness: 4.8,
        communication: 4.6,
        location: 4.8,
        checkin: 4.7,
        accuracy: 4.6,
        value: 4.8,
        submittedAt: new Date("2025-09-14T18:45:00Z"), // Yesterday
    },
    {
        propertySlug: "chelsea-garden-mews",
        guestName: "James Thompson",
        guestEmail: "j.thompson@email.com",
        overallRating: 5.0,
        review: "Absolutely stunning property! The three bedrooms are spacious and beautifully furnished. The private garden is a real gem in central London. Exceptional service from start to finish.",
        channel: "HOSTAWAY" as ReviewChannel,
        status: "PENDING" as ReviewStatus,
        isApproved: false,
        cleanliness: 5.0,
        communication: 5.0,
        location: 5.0,
        checkin: 5.0,
        accuracy: 5.0,
        value: 4.8,
        submittedAt: new Date("2025-09-14T14:20:00Z"), // Yesterday - pending approval
    },
    {
        propertySlug: "paddington-central",
        guestName: "Maria Garcia",
        guestEmail: "maria.g@email.com",
        overallRating: 4.6,
        review: "Great location near Paddington Station! Perfect for travelers. The apartment is modern and has everything you need. Both bathrooms were very convenient for our family.",
        channel: "AIRBNB" as ReviewChannel,
        status: "PUBLISHED" as ReviewStatus,
        isApproved: true,
        cleanliness: 4.7,
        communication: 4.5,
        location: 4.8,
        checkin: 4.6,
        accuracy: 4.5,
        value: 4.7,
        submittedAt: new Date("2025-09-13T20:10:00Z"), // 2 days ago
    },
];

async function addRecentReviews() {
    console.log("🌱 Adding recent reviews...");

    // Get all properties
    const properties = await prisma.property.findMany();

    for (const reviewData of recentReviews) {
        const property = properties.find(
            (p) => p.slug === reviewData.propertySlug
        );
        if (!property) {
            console.log(`❌ Property not found: ${reviewData.propertySlug}`);
            continue;
        }

        const { propertySlug, ...reviewWithoutSlug } = reviewData;
        await prisma.review.create({
            data: {
                ...reviewWithoutSlug,
                propertyId: property.id,
            },
        });
        console.log(
            `✅ Added recent review by ${reviewData.guestName} for ${property.name}`
        );
    }

    console.log("🎉 Recent reviews added successfully!");
}

addRecentReviews()
    .catch((e) => {
        console.error("❌ Error adding recent reviews:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
