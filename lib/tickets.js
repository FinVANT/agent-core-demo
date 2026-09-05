const { hashString } = require("./hash");
const { ROSTER, MASTER, byComponent } = require("./roster");

const PREFIX = "DEMO-";
const COMPONENT_POOL = ["BE", "FE", "DEVOPS", "TEST", "DOCUMENTATION", "REVIEW"];
const STATUS_POOL = ["SUCCESS", "WAITING_CI", "PROCESSING"];
const COMPLEXITY_POOL = ["LOW", "MEDIUM", "HIGH"];

function truncate(text, max) {
    if (!text || text.length <= max) return text || "";
    return `${text.slice(0, max)}…`;
}

/** 지시 하나를 ticketId 문자열 하나에 인코딩한다 — 별도 저장소 없이 나중에 그대로 복원하기 위해서다. */
function encodeTicket({ projectId, requirement }) {
    const payload = JSON.stringify({ projectId, requirement, ts: Date.now() });
    const encoded = Buffer.from(payload, "utf8").toString("base64url");
    return `${PREFIX}${encoded}`;
}

function decodeTicket(ticketId) {
    if (!ticketId || !ticketId.startsWith(PREFIX)) return null;
    try {
        const json = Buffer.from(ticketId.slice(PREFIX.length), "base64url").toString("utf8");
        const payload = JSON.parse(json);
        if (typeof payload.requirement !== "string") return null;
        return payload;
    } catch (error) {
        return null;
    }
}

/** 해시값으로 배열에서 count개를 결정론적으로 고른다(순서도 항상 같다 — 진짜 랜덤이면 재현이 안 된다). */
function pickComponents(seed, pool, count) {
    const picked = [];
    let cursor = seed;
    const remaining = [...pool];
    for (let i = 0; i < count && remaining.length > 0; i += 1) {
        cursor = hashString(String(cursor + i));
        const index = cursor % remaining.length;
        picked.push(remaining.splice(index, 1)[0]);
    }
    return picked;
}

function buildAssignment(component, seed, requirement) {
    const agent = byComponent(component);
    return {
        component,
        agent,
        instruction: `"${truncate(requirement, 50)}" 중 ${component} 관련 부분만 정리해서 진행하세요.`,
        status: STATUS_POOL[(seed + component.length) % STATUS_POOL.length],
        branchName: null,
        prUrl: null,
        attempts: 1,
    };
}

/** 실제 티켓처럼 보이되 전부 계산으로 만든 값이다 — 어떤 저장도 하지 않는다. */
function buildProceduralAssignment(ticketId, payload) {
    const seed = hashString(ticketId);
    const count = 2 + (seed % 3); // 2~4개
    const components = pickComponents(seed, COMPONENT_POOL, count);
    return {
        ticketId,
        title: truncate(payload.requirement, 40),
        requirement: payload.requirement,
        complexity: COMPLEXITY_POOL[seed % COMPLEXITY_POOL.length],
        decidedBy: seed % 4 === 0 ? "KEYWORD_CLASSIFIER" : "PLANNING_AGENT",
        master: MASTER,
        assignments: components.map((component) => buildAssignment(component, seed, payload.requirement)),
    };
}

/** 미리 손으로 짜둔 시나리오 — 처음 열었을 때 바로 보여줄 "이미 있는 티켓" 몇 개. */
const CANNED_EXAMPLES = {
    "DEMO-EXAMPLE-1": {
        ticketId: "DEMO-EXAMPLE-1",
        title: "이슈 동시 편집 시 서로 덮어쓰지 않게 처리",
        requirement: "여러 사용자가 같은 이슈를 동시에 열어도 서로 덮어쓰지 않게 해줘",
        complexity: "MEDIUM",
        decidedBy: "PLANNING_AGENT",
        master: MASTER,
        assignments: [
            {
                component: "BE",
                agent: byComponent("BE"),
                instruction: "이슈 저장 API에 낙관적 락(버전 컬럼)을 추가하고, 편집 시작 시 짧은 리스를 거는 엔드포인트를 만드세요.",
                status: "SUCCESS",
                branchName: null,
                prUrl: null,
                attempts: 1,
            },
            {
                component: "FE",
                agent: byComponent("FE"),
                instruction: "편집 화면에서 리스를 주기적으로 갱신하고, 저장 실패(버전 충돌) 시 최신 값을 다시 불러오게 하세요.",
                status: "SUCCESS",
                branchName: null,
                prUrl: null,
                attempts: 1,
            },
            {
                component: "TEST",
                agent: byComponent("TEST"),
                instruction: "두 사용자가 동시에 저장을 시도하는 시나리오의 통합 테스트를 작성하세요.",
                status: "WAITING_CI",
                branchName: null,
                prUrl: null,
                attempts: 1,
            },
        ],
    },
    "DEMO-EXAMPLE-2": {
        ticketId: "DEMO-EXAMPLE-2",
        title: "작업 결과를 PDF로 내보내기",
        requirement: "완료된 작업 목록을 PDF로 내보낼 수 있게 해줘",
        complexity: "LOW",
        decidedBy: "KEYWORD_CLASSIFIER",
        master: MASTER,
        assignments: [
            {
                component: "BE",
                agent: byComponent("BE"),
                instruction: "완료 목록을 조회해 PDF 스트림으로 응답하는 엔드포인트를 추가하세요.",
                status: "PROCESSING",
                branchName: null,
                prUrl: null,
                attempts: 1,
            },
            {
                component: "FE",
                agent: byComponent("FE"),
                instruction: "목록 화면에 'PDF로 내보내기' 버튼을 추가하세요.",
                status: "PROCESSING",
                branchName: null,
                prUrl: null,
                attempts: 2,
            },
        ],
    },
};

function findAssignment(ticketId) {
    if (CANNED_EXAMPLES[ticketId]) {
        return CANNED_EXAMPLES[ticketId];
    }
    const payload = decodeTicket(ticketId);
    if (!payload) return null;
    return buildProceduralAssignment(ticketId, payload);
}

module.exports = {
    encodeTicket,
    decodeTicket,
    findAssignment,
    CANNED_EXAMPLES,
    truncate,
};
