/**
 * agent-core-fe는 보통 vercel.json rewrite로 같은 도메인에서 이 API를 부르지만(그러면
 * CORS가 필요 없다), 데모 API를 다른 곳에서 직접 열어볼 수도 있으니 방어적으로 전체 허용한다.
 * 실 데이터가 없는 목업이라 넓게 열어도 위험이 없다.
 */
function applyCors(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

/** OPTIONS 프리플라이트를 처리했으면 true — 호출부는 이때 바로 return 한다. */
function handlePreflight(req, res) {
    applyCors(res);
    if (req.method === "OPTIONS") {
        res.status(204).end();
        return true;
    }
    return false;
}

module.exports = { applyCors, handlePreflight };
