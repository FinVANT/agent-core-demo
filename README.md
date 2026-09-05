<div align="center">

# 🎭 Agent Core — 공개 데모 백엔드

**[`agent-core-fe`](https://github.com/FinVANT/agent-core-fe)(제품과 동일한 FE)가 공개
데모로 배포될 때 붙는, 실제 로직 없는 목업 백엔드**

[![No DB](https://img.shields.io/badge/storage-none-lightgrey)](./ADR/ADR-001-stateless-ticket-encoding.md)
[![Mock Logic](https://img.shields.io/badge/logic-100%25%20mock-red)](./BRD.md)
[![Vercel](https://img.shields.io/badge/runtime-Vercel%20Functions-black)](https://vercel.com)

[ERD](./ERD.md) · [BRD](./BRD.md) · [ADR](./ADR)

</div>

---

## ⚠️ 이게 뭔지 — 그리고 뭐가 아닌지

- **API 계약(경로·요청/응답 모양)은 실제 Agent Core와 같다.** FE 코드를 한 줄도 안 고치고
  그대로 붙일 수 있는 이유가 이거다.
- **안의 로직은 전부 다르다.** 실제 라우팅 판단, 프롬프트, 검증 게이트, LLM 호출 — 이
  프로젝트의 진짜 노하우에 해당하는 코드는 여기 하나도 없다. 무엇이 진짜고 무엇이 mock인지는
  [`BRD.md`](./BRD.md)의 표에 전부 명시했다.
- **DB가 없다.** 상태를 어디에도 저장하지 않는다 — 어떻게 재현되는지는 [`ERD.md`](./ERD.md)와
  [`ADR/ADR-001`](./ADR/ADR-001-stateless-ticket-encoding.md) 참고.
- 실제 기술적 성과를 보여줘야 하는 포트폴리오 용도는 여기가 아니라 비공개BE
  (`HoSeong0731/agent-core`)에서 가져온다 — 이 저장소는 "컨셉을 눌러볼 수 있게" 하는 것
  이상을 의도적으로 맡지 않는다.

## ✨ 무엇을 볼 수 있나

- 커맨드 센터에 지시를 입력하면 실제로 요청이 서버까지 가서, 매번 다르게(그러나 같은 입력엔
  항상 같게) 컴포넌트 배분이 계산되어 돌아온다 — 고정된 영상이 아니다.
- 미리 짜둔 예시 티켓 2개(`DEMO-EXAMPLE-1`, `DEMO-EXAMPLE-2`)로 첫 화면부터 볼 게 있다.
- 저장소 읽기 확인, 에이전트 메모리 편집(저장은 안 되고 echo만) 등 실제 화면의 상호작용을
  그대로 눌러볼 수 있다.

## 🛠 기술 스택

| 분류 | 기술 |
|---|---|
| 런타임 | Node.js (Vercel Serverless Functions, CommonJS) |
| 저장소 | 없음 — 상태는 `ticketId` 자체에 인코딩 (`ADR-001`) |
| 배포 | Vercel |

## 🚀 시작하기

### 로컬 실행

```bash
npm i -g vercel
vercel dev
```

### 배포

```bash
vercel --prod
```

배포된 도메인을 [`agent-core-fe`](https://github.com/FinVANT/agent-core-fe)의
`vercel.json` rewrite 대상으로 맞춰준다.

## 📁 프로젝트 구조

```
agent-core-demo
├── api/
│   ├── office/
│   │   ├── workspaces.js          GET  /api/office/workspaces
│   │   ├── directive.js           POST /api/office/directive
│   │   ├── repository-check.js    GET  /api/office/repository-check
│   │   └── agents/[agentType]/memory.js   GET/PUT
│   └── dashboard/
│       ├── roster.js              GET  /api/dashboard/roster
│       ├── hive-graph.js          GET  /api/dashboard/hive-graph
│       └── assignments.js         GET  /api/dashboard/assignments
├── lib/
│   ├── hash.js        결정론적 해시 (djb2) — 랜덤 대신
│   ├── tickets.js      ticketId 인코딩/디코딩 + 예시 티켓
│   ├── roster.js       더미 에이전트 명단
│   ├── workspaces.js   더미 프로젝트 목록
│   └── cors.js
├── ERD.md   데이터 모양 (DB는 없다)
├── BRD.md   무엇이 진짜고 무엇이 mock인지
└── ADR/     설계 결정 3건
```

## 🌐 API 연동

`agent-core-fe`의 `office.html`이 쓰는 것만 구현했다. 자세한 요청/응답 필드는
[`ERD.md`](./ERD.md) 참고.

| 엔드포인트 | 설명 |
|---|---|
| `GET /api/office/workspaces` | 데모용 프로젝트 2개 |
| `POST /api/office/directive` | 지시 제출 → `ticketId` 발급 |
| `GET /api/office/repository-check` | 가짜 저장소 읽기 확인 |
| `GET/PUT /api/office/agents/:agentType/memory` | 메모리 조회/저장(저장 안 됨, echo) |
| `GET /api/dashboard/roster` | 더미 에이전트 7명 |
| `GET /api/dashboard/hive-graph` | 예시 티켓 2건 + 에이전트 그래프 |
| `GET /api/dashboard/assignments?ticketId=` | 배분 결과(예시 or 계산된 값) |

## 🤝 Contributing

이 저장소는 데모 전용이라 기능 확장보다는 "실제 계약과 어긋나지 않는지"가 더 중요하다.
FE가 새 필드를 기대하게 되면 이 저장소의 mock 응답에도 같은 필드를 (역시 가짜 값으로) 추가한다.

## 📄 License

Public 데모 목적의 저장소. 실제 로직을 포함하지 않으므로 자유롭게 참고해도 된다.
