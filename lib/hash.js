/**
 * 데모 전용 결정론적 해시(djb2). 암호학적 용도가 아니다 — 같은 입력이면 항상 같은 숫자를
 * 내려줘서, DB 없이도 ticketId 하나로 배분 결과를 재현하기 위해서만 쓴다.
 */
function hashString(input) {
    let hash = 5381;
    for (let i = 0; i < input.length; i += 1) {
        hash = ((hash << 5) + hash + input.charCodeAt(i)) >>> 0;
    }
    return hash >>> 0;
}

module.exports = { hashString };
