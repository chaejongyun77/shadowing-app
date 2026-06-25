# 🗣️ Shadowing App (일본어 쉐도잉 학습 서비스)

유튜브 영상을 보며 일본어 대사를 따라 읽고, 브라우저의 음성 인식(STT)을 통해 발음의 정확도를 즉각적으로 피드백받을 수 있는 **일본어 쉐도잉 학습 웹 애플리케이션 (MVP)** 입니다.

---

## 🛠 Tech Stack (기술 스택)

### Frontend
- **Framework/Library:** React 19, Vite, TypeScript
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand, TanStack Query
- **HTTP Client:** Axios
- **Player:** react-youtube (YouTube IFrame Player API)
- **Router:** React Router DOM v7

### Backend
- **Language/Framework:** Java 17, Spring Boot 3.5.x
- **ORM / DB:** Spring Data JPA, Hibernate, MariaDB
- **HTTP Client:** Spring WebFlux (WebClient)
- **Build Tool:** Gradle (Kotlin DSL)

### External API
- **자막 추출:** youtube-transcript-api (io.github.thoroldvix)
- **AI 가공:** Google Gemini API (gemini-3.1-flash)
  - 한자 요미가나 `<ruby>/<rt>` 태그 자동 생성
  - 한국어 번역 자동 생성
  - 긴 문장 의미 단위 분리
  - 배경음/효과음 자막 자동 제거

---

## 📁 Repository Structure (폴더 구조)

모노레포(Monorepo) 구조로 백엔드와 프론트엔드가 하나의 저장소에서 관리됩니다.

```text
shadowing-app/
├── backend/                          # Spring Boot REST API 서버 (port: 8080)
│   └── src/main/java/com/example/shadowing/
│       ├── admin/                    # 영상 임포트 파이프라인 (관리자 API)
│       ├── video/                    # 영상 도메인 (Entity, Repository, Service, Controller)
│       ├── script/                   # 스크립트 도메인
│       ├── infra/
│       │   ├── gemini/               # Gemini API 클라이언트
│       │   └── youtube/              # YouTube 자막 추출 클라이언트
│       └── common/                   # 공통 (ApiResponse, ErrorCode, GlobalExceptionHandler)
├── frontend/                         # React + Vite 웹 애플리케이션 (port: 5173)
│   └── src/
│       ├── api/                      # Axios 인스턴스 및 API 함수
│       ├── components/
│       │   ├── editor/               # 스크립트 편집 컴포넌트
│       │   ├── layout/               # 공통 레이아웃 (Header)
│       │   ├── player/               # 학습 플레이어 컴포넌트
│       │   └── video/                # 영상 목록/카드 컴포넌트
│       ├── hooks/                    # usePlayer, useScripts, useVideos
│       ├── pages/                    # HomePage, StudyPage, AdminPage, ScriptEditorPage
│       └── types/                    # TypeScript 타입 정의
├── claude.md                         # AI(Claude) 전용 프로젝트 개발 가이드라인
└── README.md
```

---

## 🚀 Getting Started (로컬 실행 방법)

### 1. Prerequisites (사전 준비)
- Java 17 이상
- Node.js 20.x 이상
- MariaDB 실행 중
- Google Gemini API 키 ([Google AI Studio](https://aistudio.google.com)에서 무료 발급)

### 2. Database Setting (DB 세팅)
```sql
CREATE DATABASE shadowing DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Backend 환경 설정
`backend/src/main/resources/application-local.yml` 파일을 생성하고 아래 내용을 작성합니다.
```yaml
spring:
  datasource:
    url: jdbc:mariadb://localhost:3306/shadowing
    driver-class-name: org.mariadb.jdbc.Driver
    username: {DB_USERNAME}
    password: {DB_PASSWORD}
  jpa:
    show-sql: true

gemini:
  api-key: {GEMINI_API_KEY}
```
> `application-local.yml`은 `.gitignore`에 등록되어 있어 커밋되지 않습니다.

### 4. Backend Run (백엔드 실행)
```bash
cd backend
./gradlew bootRun   # Windows: gradlew.bat bootRun
```
> 실행 포트: `http://localhost:8080`

### 5. Frontend Run (프론트엔드 실행)
```bash
cd frontend
npm install
npm run dev
```
> 실행 포트: `http://localhost:5173`

---

## 🌟 Core Features (주요 기능)

### 학습 기능 (StudyPage)
1. **영상 재생 & 대사 동기화:** 유튜브 영상 재생 중 현재 시간에 맞는 일본어 스크립트를 자동 하이라이팅 (250ms 폴링)
2. **요미가나(후리가나) 표시:** `<ruby>/<rt>` 태그로 한자 위에 히라가나를 정확하게 표시
3. **A-B 구간 반복:** 현재 활성 구간을 무한 반복 재생
4. **구간 이동:** 이전/다음 버튼 및 대본 목록 클릭으로 원하는 구간으로 이동
5. **발음 녹음:** 마이크 버튼으로 발음 녹음 (STT 채점은 개발 예정)

### 콘텐츠 관리 기능 (AdminPage)
6. **영상 자동 임포트:** YouTube URL 입력 시 자막 자동 추출 → Gemini AI 가공 → DB 저장 파이프라인
7. **스크립트 직접 수정:** 영상을 보며 각 구간의 시작/종료 시간과 한국어 번역을 직접 수정 (ScriptEditorPage)

---

## 🔗 API Endpoints

### Video
| Method | URL | 설명 |
|--------|-----|------|
| GET | `/api/videos` | 영상 목록 조회 |

### Script
| Method | URL | 설명 |
|--------|-----|------|
| GET | `/api/videos/{videoId}/scripts` | 영상별 스크립트 목록 조회 |
| PUT | `/api/scripts/{scriptId}` | 스크립트 수정 (시간/번역) |

### Admin
| Method | URL | 설명 |
|--------|-----|------|
| POST | `/api/admin/videos/import` | 유튜브 영상 자막 자동 임포트 |

---

## 🤖 AI Development Guide
본 프로젝트는 AI 에이전트(Claude)의 적극적인 지원을 받아 개발됩니다.
AI가 코드를 작성하거나 수정할 때는 루트 디렉토리에 위치한 [`claude.md`](./claude.md) 가이드라인을 최우선으로 준수합니다.
