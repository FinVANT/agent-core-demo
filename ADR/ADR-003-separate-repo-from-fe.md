# ADR-003: FE와 별도 저장소로 분리한다

- Status: Accepted

## Context

`agent-core-fe`(공유 FE)와 이 목업 백엔드를 한 저장소에 합칠 수도 있었다.

## Decision

별도 저장소로 뒀다. `agent-core-fe`의 `vercel.json`이 `/api/*`를 이 저장소의 배포 도메인으로
rewrite하는 방식으로 둘을 연결한다.

## Consequences

- 장점: "이건 FE(제품과 동일)"와 "이건 mock(속이 텅 빈 껍데기)"이라는 경계가 저장소 단위로
  분명해진다. 코드 안에서 `if (isDemo)` 같은 분기로 섞였다면 이 경계는 리뷰할 때마다 다시
  확인해야 했을 것이다.
- 장점: 이 저장소를 통째로 지우거나 새로 만들어도 `agent-core-fe`는 전혀 영향받지 않는다 —
  rewrite 대상 URL 하나만 바꾸면 된다.
- 단점: 배포가 두 단계(FE 배포, BE 배포)로 늘었고, `agent-core-fe`의 `vercel.json`에 이
  저장소의 실제 배포 도메인을 수동으로 맞춰줘야 한다.
