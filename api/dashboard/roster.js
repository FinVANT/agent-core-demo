const { handlePreflight } = require("../../lib/cors");
const { ROSTER } = require("../../lib/roster");

module.exports = (req, res) => {
    if (handlePreflight(req, res)) return;
    res.status(200).json(ROSTER);
};
