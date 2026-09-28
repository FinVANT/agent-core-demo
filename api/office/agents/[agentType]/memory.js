const { handlePreflight } = require("../../../../lib/cors");
const crypto = require("crypto");
const { ROSTER, SAMPLE_MEMORY } = require("../../../../lib/roster");

// 실제 백엔드와 같은 모양의 버전(본문 해시 앞 16자리). 데모는 저장하지 않으므로 충돌(409)은 나지 않는다.
const versionOf = (content) => crypto.createHash("sha256").update(content || "", "utf8").digest("hex").slice(0, 16);

module.exports = (req, res) => {
    if (handlePreflight(req, res)) return;

    const { agentType } = req.query;
    const known = ROSTER.some((agent) => agent.agentType === agentType);
    if (!known) {
        res.status(404).json({ message: `알 수 없는 에이전트: ${agentType}` });
        return;
    }

    if (req.method === "GET") {
        res.status(200).json({
            agentType,
            content: SAMPLE_MEMORY[agentType] || "",
            version: versionOf(SAMPLE_MEMORY[agentType] || ""),
        });
        return;
    }

    if (req.method === "PUT") {
        // 데모는 저장하지 않는다 — 보낸 값을 그대로 돌려줘서 "저장됨"처럼 보이게만 한다.
        const content = (req.body && req.body.content) || "";
        res.status(200).json({ agentType, content, version: versionOf(content) });
        return;
    }

    res.status(405).json({ message: "GET 또는 PUT만 지원합니다." });
};
