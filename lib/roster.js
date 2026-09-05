/**
 * 실제 Agent Core의 AgentRosterView와 같은 모양이지만, 값은 전부 데모용으로 새로 지었다 —
 * 실제 agents/*.md 프롬프트나 스킬 목록을 옮겨오지 않았다(그게 이 프로젝트의 진짜 노하우다).
 */
const ROSTER = [
    {
        agentType: "PLANNING",
        component: "PLANNING",
        beanName: "planningAgent",
        displayName: "총괄",
        emoji: "🧭",
        skills: ["요구사항 분해", "우선순위 판단"],
        isMaster: true,
        hasMemory: true,
    },
    {
        agentType: "BACKEND",
        component: "BE",
        beanName: "backendAgent",
        displayName: "백엔드",
        emoji: "💻",
        skills: ["REST API", "데이터베이스"],
        isMaster: false,
        hasMemory: true,
    },
    {
        agentType: "FRONTEND",
        component: "FE",
        beanName: "frontendAgent",
        displayName: "프런트엔드",
        emoji: "🎨",
        skills: ["UI 구현", "상태 관리"],
        isMaster: false,
        hasMemory: false,
    },
    {
        agentType: "DEVOPS",
        component: "DEVOPS",
        beanName: "devopsAgent",
        displayName: "데브옵스",
        emoji: "🛠️",
        skills: ["배포", "모니터링"],
        isMaster: false,
        hasMemory: false,
    },
    {
        agentType: "REVIEW",
        component: "REVIEW",
        beanName: "reviewAgent",
        displayName: "리뷰어",
        emoji: "🔍",
        skills: ["코드 리뷰", "품질 검증"],
        isMaster: false,
        hasMemory: true,
    },
    {
        agentType: "TEST",
        component: "TEST",
        beanName: "testAgent",
        displayName: "테스터",
        emoji: "🧪",
        skills: ["단위 테스트", "통합 테스트"],
        isMaster: false,
        hasMemory: false,
    },
    {
        agentType: "DOCUMENTATION",
        component: "DOCUMENTATION",
        beanName: "documentationAgent",
        displayName: "문서화",
        emoji: "📝",
        skills: ["기술 문서", "API 문서"],
        isMaster: false,
        hasMemory: false,
    },
];

const MASTER = ROSTER.find((agent) => agent.isMaster);
const byComponent = (component) => ROSTER.find((agent) => agent.component === component) || null;

const SAMPLE_MEMORY = {
    PLANNING: "# 샘플 메모\n\n이 데모는 요청마다 초기화됩니다 — 실제 서비스에서는 이 자리에\n운영 중 배운 내용(예: 이 저장소는 항상 컨벤션 커밋을 쓴다)이 쌓입니다.",
    BACKEND: "# 샘플 메모\n\n예) 이 저장소의 테스트는 ./gradlew test로 돌린다.",
    REVIEW: "# 샘플 메모\n\n예) PR 설명에는 항상 테스트 방법을 적는다.",
};

module.exports = { ROSTER, MASTER, byComponent, SAMPLE_MEMORY };
