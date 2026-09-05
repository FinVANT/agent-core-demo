const { handlePreflight } = require("../../lib/cors");
const { WORKSPACES } = require("../../lib/workspaces");

module.exports = (req, res) => {
    if (handlePreflight(req, res)) return;
    res.status(200).json(WORKSPACES);
};
