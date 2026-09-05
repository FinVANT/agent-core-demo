const { handlePreflight } = require("../../lib/cors");
const { findAssignment } = require("../../lib/tickets");

module.exports = (req, res) => {
    if (handlePreflight(req, res)) return;

    const ticketId = req.query.ticketId;
    const assignment = ticketId ? findAssignment(ticketId) : null;
    if (!assignment) {
        res.status(404).json({ message: `${ticketId || ""} 를 찾을 수 없습니다.` });
        return;
    }
    res.status(200).json(assignment);
};
