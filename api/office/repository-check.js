const { handlePreflight } = require("../../lib/cors");
const { byProjectId } = require("../../lib/workspaces");
const { hashString } = require("../../lib/hash");

module.exports = (req, res) => {
    if (handlePreflight(req, res)) return;

    const workspace = byProjectId(req.query.projectId);
    if (!workspace) {
        res.status(200).json({
            status: "NOT_FOUND",
            message: "그런 프로젝트가 없습니다.",
            repository: "",
            fileCount: 0,
            truncated: false,
        });
        return;
    }

    const fileCount = 40 + (hashString(workspace.targetRepo) % 260);
    res.status(200).json({
        status: "OK",
        message: `✓ 읽을 수 있습니다. 파일 ${fileCount}개. (데모 — 실제 저장소를 읽지 않습니다)`,
        repository: workspace.targetRepo,
        fileCount,
        truncated: false,
    });
};
