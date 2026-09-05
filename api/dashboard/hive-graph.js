const { handlePreflight } = require("../../lib/cors");
const { ROSTER } = require("../../lib/roster");
const { CANNED_EXAMPLES } = require("../../lib/tickets");

const KIND_AGENT = "AGENT";
const KIND_TICKET = "TICKET";

/** 오피스 화면의 티켓 드롭다운은 이 그래프의 TICKET 노드를 그대로 재사용한다(js/office office.html 참고). */
module.exports = (req, res) => {
    if (handlePreflight(req, res)) return;

    const tickets = Object.values(CANNED_EXAMPLES);

    const agentDegree = Object.fromEntries(ROSTER.map((a) => [a.component, 0]));
    const nodes = [];
    const edges = [];

    for (const ticket of tickets) {
        nodes.push({
            id: ticket.ticketId,
            label: ticket.ticketId,
            kind: KIND_TICKET,
            status: ticket.assignments[0] ? ticket.assignments[0].status : "READY",
            degree: ticket.assignments.length,
        });
        for (const assignment of ticket.assignments) {
            agentDegree[assignment.component] = (agentDegree[assignment.component] || 0) + 1;
            edges.push({ source: ticket.ticketId, target: assignment.component, label: assignment.component });
        }
    }

    for (const agent of ROSTER) {
        nodes.push({
            id: agent.component,
            label: agent.displayName,
            kind: KIND_AGENT,
            status: null,
            degree: agentDegree[agent.component] || 0,
        });
    }

    res.status(200).json({
        nodes,
        edges,
        shownTickets: tickets.length,
        totalTickets: tickets.length,
        truncationNotice: `티켓 ${tickets.length}건 전부 표시 중입니다. (데모 — 예시 티켓만 있습니다)`,
    });
};
