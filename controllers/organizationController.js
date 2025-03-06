const { PrismaClient } = require('@prisma/client');
const InviteEmail = require('../utils/InviteEmail');
const prisma = new PrismaClient();

/**
 * Create a new organization and assign an admin.
 */
const createOrganizationAndInvite = async (req, res) => {
    try {
        const { name, adminEmail } = req.body;

        // Check if a user with the given email already exists
        const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });

        if (existingUser) {
            // If email already exists, create organization but do not send invite
            const organization = await prisma.organization.create({
                data: {
                    name,
                    orgAdminId: existingUser.id,
                    users: { connect: { id: existingUser.id } }, // Admin is also a member
                },
            });

            return res.status(200).json({
                message: "Organization created successfully, but admin email already exists.",
                organization,
            });
        }

        // If user does not exist, send an invite and create the organization
        await InviteEmail(adminEmail, name, "ORG_ADMIN");

        const organization = await prisma.organization.create({
            data: {
                name,
                orgAdminEmail: adminEmail, // Store email since user doesn't exist yet
            },
        });

        res.status(201).json({
            message: "Organization created, and invitation sent to the admin.",
            organization,
        });
    } catch (error) {
        console.error("Error creating organization:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


/**
 * Invite a user to an organization.
 */
const inviteUser = async (req, res) => {
    try {
        const { email, organizationId } = req.body;

        // Check if organization exists
        const organization = await prisma.organization.findUnique({ where: { id: organizationId } });
        if (!organization) return res.status(404).json({ error: "Organization not found" });

        // Send invite
        await sendInvite(email, organization.name);

        res.json({ message: "Invite sent successfully" });
    } catch (error) {
        console.error("Error sending invite:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Get all organizations.
 */
const getOrganizations = async (req, res) => {
    try {
        const organizations = await prisma.organization.findMany({
            include: {
                users: true, // Still valid since users are related
            },
        });

        res.status(200).json(organizations);
    } catch (error) {
        console.error("Error fetching organizations:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports = { createOrganizationAndInvite, inviteUser, getOrganizations };