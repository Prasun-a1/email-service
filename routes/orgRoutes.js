const express = require("express");
const { createOrganizationAndInvite, inviteUser, getOrganizations } = require("../controllers/organizationController");

const router = express.Router();

// Organization routes
router.post("/create", createOrganizationAndInvite);
router.post("/invite", inviteUser);
router.get("/", getOrganizations);

module.exports = router;
