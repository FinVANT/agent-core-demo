# Agent Core — 공개 데모 백엔드

[`agent-core-fe`](https://github.com/FinVANT/agent-core-fe)(실제 제품과 같은 FE 코드)가
공개 데모로 배포될 때 붙는 백엔드다.

## 이게 뭔지 — 그리고 뭐가 아닌지

- **API 계약(경로·요청/응답 모양)은 실제 Agent Core와 같다.** FE 코드를 한 줄도 안 고치고
  그대로 붙일 수 있는 이유가 이거다.
- **안의 로직은 전부 다르다.** 실제 라우팅 판단, 프롬프트, 검증 게이트, LLM 호출 — 이 프로젝트의
  진짜 노하우에 해당하는 코드는 여기 하나도 없다. 이 저장소를 전부 읽어도 실제 제품이
  어떻게 동작하는지는 알 수 없다.
- **DB가 없다.** 상태를 어디에도 저장하지 않는다. `POST /api/office/directive`가 만드는
  `ticketId`는 요청 내용을 그 문자열 안에 그대로 인코딩한 값이라, 나중에 그 문자열만 보고
  같은 배분 결과를 다시 계산해낸다(`lib/tickets.js`의 `encodeTicket`/`decodeTicket`). 그래서
  서버리스 함수가 요청마다 다른 인스턴스에서 떠도, 공유 저장소 없이도 "방금 만든 티켓"이
  다시 조회된다.
- 미리 손으로 짜둔 예시 티켓 2개(`DEMO-EXAMPLE-1`, `DEMO-EXAMPLE-2`)가 있다 — 처음 열었을 때
  빈 화면이 아니라 바로 볼 게 있게 하기 위해서다.

## 구현하는 엔드포인트

`agent-core-fe`의 `office.html`이 쓰는 것만 구현했다 — 다른 화면(대시보드, 이슈, 조직 등)은
지원하지 않는다.

| 엔드포인트 | 파일 |
|---|---|
| `GET /api/office/workspaces` | `api/office/workspaces.js` |
| `POST /api/office/directive` | `api/office/directive.js` |
| `GET /api/office/repository-check` | `api/office/repository-check.js` |
| `GET/PUT /api/office/agents/:agentType/memory` | `api/office/agents/[agentType]/memory.js` |
| `GET /api/dashboard/roster` | `api/dashboard/roster.js` |
| `GET /api/dashboard/hive-graph` | `api/dashboard/hive-graph.js` |
| `GET /api/dashboard/assignments` | `api/dashboard/assignments.js` |

## 로컬 실행

```bash
npm i -g vercel
vercel dev
```

## 배포

```bash
vercel --prod
```

배포된 도메인이 `agent-core-fe`의 `vercel.json` rewrite 대상과 다르면 그쪽을 이 프로젝트의
실제 도메인으로 맞춰준다.

## 왜 별도 저장소인가

`agent-core-fe`(공유 FE)와 합쳐서 한 저장소로 만들 수도 있었지만, 그러면 "이건 목업이다"라는
경계가 코드 안에서 흐려진다. 별도 저장소로 두면 이 저장소를 지우거나 새로 만들어도 FE 코드에는
아무 영향이 없고, 반대로 FE가 바뀌어도(API 계약이 안 바뀌는 한) 이 저장소를 고칠 필요가 없다.
