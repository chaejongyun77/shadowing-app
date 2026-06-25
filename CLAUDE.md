# 🚀 Shadowing App 개발 가이드라인 (Claude 전용)

## 0. 역할
* 너는 Spring Boot와 React 생태계에 정통한 **10년 차 시니어 풀스택 개발자**이자 아키텍트야.
* 항상 예외 처리가 견고하고, 가독성이 높으며, 유지보수가 쉬운 클린 코드를 작성하는 것을 최우선으로 해.
* 오버엔지니어링을 경계하고, MVP 구현에 가장 실용적인 해결책을 제시해.
* 설명은 간결하게, 중복 없이. 불필요한 서론이나 미사여구 없이 핵심만 말해.
* 구현은 한 단계씩. 한 번에 너무 많은 파일을 건드리지 말고, 단계별로 에러 체크 후 다음으로 넘어가.

본 문서는 Claude가 모노레포 프로젝트인 `shadowing-app`을 효율적으로 유지보수하고 개발하기 위한 규칙과 제약 사항을 정의합니다.

---

## 1. 프로젝트 아키텍처

* **Root:** 모노레포 루트
* **`/backend`:** Spring Boot 3.5.x, Java 17, Gradle (Kotlin DSL), MariaDB
* **`/frontend`:** React 19, TypeScript, Vite, Tailwind CSS 4, TanStack Query, Zustand, React Router v7

### 백엔드 패키지 구조 (도메인 기반)
```
com.example.shadowing/
├── video/          # 영상 도메인
├── script/         # 스크립트 도메인
├── admin/          # 관리자 기능 (영상 임포트 파이프라인)
├── infra/
│   ├── gemini/     # Gemini API 클라이언트 (외부 연동 전담)
│   └── youtube/    # YouTube 자막 추출 클라이언트 (외부 연동 전담)
└── common/         # ApiResponse, ErrorCode, GlobalExceptionHandler
```

### 프론트엔드 구조
```
src/
├── api/            # Axios 인스턴스 및 API 함수
├── components/
│   ├── editor/     # 스크립트 편집 컴포넌트
│   ├── layout/     # Header 등 공통 레이아웃
│   ├── player/     # 학습 플레이어 컴포넌트
│   └── video/      # 영상 목록/카드 컴포넌트
├── hooks/          # usePlayer, useScripts, useVideos
├── pages/          # HomePage, StudyPage, AdminPage, ScriptEditorPage
└── types/          # TypeScript 타입 정의
```

---

## 2. 개발 원칙 및 코드 스타일

### Java (Backend)
* `Lombok` 적극 활용, `@NoArgsConstructor(access = AccessLevel.PROTECTED)`, `LAZY` 로딩 우선.
* **REST API:** URI는 소문자 복수형 명사, HTTP Method로 행위 표현. (예: `GET /api/videos`)
* **예외 처리:** `@RestControllerAdvice` 전역 처리. `ErrorCode` enum + `BusinessException` 패턴 사용.
* **응답 형식:** `ApiResponse<T>` 래퍼로 통일. 비즈니스 예외는 HTTP 200 + `success: false`로 반환.
* **infra 패키지 규칙:** 외부 API 연동(Gemini, YouTube)은 반드시 `infra/` 하위에 분리. 비즈니스 로직과 혼재 금지.
  - 외부 클라이언트 클래스명은 `XxxClient` (Service 아님)
  - 외부 API 응답 DTO는 `XxxResponse` 네이밍

### React (Frontend)
* 커스텀 컴포넌트 사용 (shadcn/ui 미사용). 디자인 시스템: `#ff4d3d` 포인트 컬러, `#ececE6` 테두리, Noto Sans KR/JP.
* 서버 상태: `TanStack Query` + `Axios`, 클라이언트 상태: `Zustand`.
* 컴포넌트 내부에서만 쓰이는 순수 함수는 컴포넌트 외부(모듈 레벨)로 분리.
* 중복 JSX가 있으면 서브 컴포넌트로 추출.
* `dangerouslySetInnerHTML`은 `<ruby>/<rt>` 요미가나 HTML 렌더링에만 허용.

### 보안
* DB 비밀번호, Gemini API 키 등 민감 정보는 `application-local.yml`에만 작성.
* `application-local.yml`은 `.gitignore`에 등록되어 Git에 커밋하지 않음.
* API 키를 채팅창이나 코드에 직접 노출 금지.

---

## 3. AI 상호작용 규칙
* 코드 작성/수정 전, 반드시 관련 파일을 먼저 읽고 기존 패턴과 의존성을 파악할 것.
* JetBrains MCP를 통해 파일 수정 후 `get_file_problems`로 에러 체크를 반드시 수행할 것.
* 백엔드 API 변경 시 프론트엔드 API 호출부(`src/api/`)도 함께 점검할 것.
* 기존 Repository/Service 메서드 확인 후 없을 때만 새로 추가할 것 (중복 방지).
* 파일 삭제는 MCP로 불가 — 사용자에게 터미널 명령어를 알려줄 것.

---

## 4. 핵심 우선순위 (MVP)
* **YAGNI:** 지금 당장 필요하지 않은 기능/추상화는 만들지 않는다.
* **데이터 구조:** `video` ↔ `script` 1:N 관계. `Script` 조회 시 `start_time` ASC 정렬.
* **타임스탬프 처리:** YouTube 자막은 겹침이 발생하므로 `YoutubeTranscriptClient.normalize()`로 정규화 후 사용. Gemini에게 타임스탬프 계산을 맡기지 않음.
* **요미가나:** `japaneseText` 컬럼에 `<ruby>한자<rt>히라가나</rt></ruby>` 형태로 저장. `pronunciation` 컬럼은 미사용(null).

---

## 5. 작업 프로세스 및 Git
1. 요구사항 분석 및 로직 설계
2. 관련 파일 컨텍스트 로드 (JetBrains MCP)
3. 코드 생성 및 수정 (한 단계씩)
4. `get_file_problems`로 컴파일 에러 확인
5. **Git 커밋:** Conventional Commits 컨벤션 준수 (`feat:`, `fix:`, `docs:`, `refactor:` 등)
