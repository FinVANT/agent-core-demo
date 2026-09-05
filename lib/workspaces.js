const WORKSPACES = [
    {
        projectId: 1,
        projectName: "샘플 웹 서비스",
        organizationName: "Demo Org",
        targetRepo: "agent-core-demo-org/sample-webapp",
        defaultBaseBranch: "main",
    },
    {
        projectId: 2,
        projectName: "미완성 사이드 프로젝트",
        organizationName: "Demo Org",
        targetRepo: "agent-core-demo-org/side-project",
        defaultBaseBranch: "main",
    },
];

const byProjectId = (projectId) => WORKSPACES.find((w) => String(w.projectId) === String(projectId)) || null;

module.exports = { WORKSPACES, byProjectId };
