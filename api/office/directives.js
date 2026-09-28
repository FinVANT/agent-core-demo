const { handlePreflight } = require("../../lib/cors");

// 데모는 상태를 저장하지 않는다(ADR-001). 그래서 "지시 이력"은 미리 짜 둔 예시 두 건만 돌려준다.
// 방금 데모에서 내린 지시는 이력에 남지 않는다 — 실제 백엔드는 이벤트 로그에 남긴다.
const HISTORY = [
    {
        ticketId: "DEMO-EXAMPLE-2",
        projectId: 2,
        projectName: "미완성 사이드 프로젝트",
        title: "작업 결과를 PDF로 내보내기",
        submittedAt: "2026-09-27T09:12:00Z",
        mine: false,
    },
    {
        ticketId: "DEMO-EXAMPLE-1",
        projectId: 1,
        projectName: "샘플 웹 서비스",
        title: "이슈 동시 편집 시 서로 덮어쓰지 않게 처리",
        submittedAt: "2026-09-27T08:40:00Z",
        mine: true,
    },
];

module.exports = (req, res) => {
    if (handlePreflight(req, res)) return;
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 20));
    res.status(200).json(HISTORY.slice(0, limit));
};
