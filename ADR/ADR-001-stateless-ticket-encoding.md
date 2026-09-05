# ADR-001: DB 없이 `ticketId`에 상태를 인코딩한다

- Status: Accepted

## Context

`POST /api/office/directive`로 만든 티켓을 `GET /api/dashboard/assignments?ticketId=`로
다시 조회할 수 있어야 FE가 정상 동작한다. 근데 이 프로젝트는 Vercel 서버리스 함수라 두 요청이
같은 인스턴스에서 처리된다는 보장이 없고, DB(Vercel KV 등)를 붙이려면 Vercel 계정에서
수동으로 데이터베이스를 프로비저닝해야 한다 — 코드만으로 끝나지 않는다.

## Decision

`directive` 응답의 `ticketId`에 요청 내용(`projectId`, `requirement`, 타임스탬프)을 그대로
base64url로 인코딩해서 돌려준다. `assignments` 조회는 그 문자열을 디코딩해서 같은 입력으로
같은 배분 결과를 다시 계산한다(`lib/tickets.js`).

## Consequences

- 장점: 추가 인프라(DB, KV, 환경변수)가 전혀 없어도 "방금 만든 티켓이 조회된다"는 흐름이
  성립한다. 배포가 `vercel --prod` 한 줄로 끝난다.
- 단점: `ticketId`가 사실상 base64로 인코딩된 원문이라 디코딩하면 요청 내용이 그대로 보인다.
  민감할 게 없는 데모 데이터라 문제되지 않지만, 이 패턴을 실제 제품에 그대로 옮기면 안 된다.
- 단점: 브라우저 뒤로가기/새로고침 이후에도 재현되지만, 서버가 "몇 개의 티켓이 있었는지"는
  알 수 없다 — `hive-graph`의 티켓 목록은 미리 손으로 짜둔 예시 2개뿐이고 방금 만든 티켓은
  거기 포함되지 않는다(대신 FE의 `setTickets`가 선택된 티켓을 목록에 강제로 끼워 넣는 방어
  로직을 이미 갖고 있어서 문제없이 동작한다).
