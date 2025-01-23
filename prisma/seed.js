const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedRoles() {
    const roles = [
        { name: 'ADMIN' },
        { name: 'SUPER_ADMIN' },
        { name: 'USER' },
        { name: 'ORG_ADMIN' },
    ];

    for (const role of roles) {
        await prisma.role.upsert({
            where: { name: role.name },
            update: {},
            create: role,
        });
    }

    console.log('Roles seeded successfully!');
}

seedRoles()
    .catch((e) => {
        console.error('Error seeding roles:', e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
