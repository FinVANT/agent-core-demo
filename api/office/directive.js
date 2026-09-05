const { handlePreflight } = require("../../lib/cors");
const { encodeTicket, truncate } = require("../../lib/tickets");
const { hashString } = require("../../lib/hash");

module.exports = (req, res) => {
    if (handlePreflight(req, res)) return;
    if (req.method !== "POST") {
        res.status(405).json({ message: "POST만 지원합니다." });
        return;
    }

    const { projectId, requirement } = req.body || {};
    if (!projectId || !requirement || !String(requirement).trim()) {
        res.status(400).json({ message: "projectId와 requirement가 필요합니다." });
        return;
    }

    const ticketId = encodeTicket({ projectId, requirement: String(requirement).trim() });
    const issueId = hashString(ticketId) % 100000;
    const title = truncate(String(requirement).trim(), 40);

    res.status(200).json({ ticketId, issueId, title });
};
