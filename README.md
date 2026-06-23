🗣️ Shadowing App (일본어 쉐도잉 학습 서비스)

유튜브 애니메이션 클립을 보며 대사를 따라 읽고, 브라우저의 음성 인식(STT)을 통해 발음의 정확도를 즉각적으로 피드백받을 수 있는 초경량 일본어 쉐도잉 학습 웹 애플리케이션 (MVP) 입니다.

🛠 Tech Stack (기술 스택)

Frontend

Framework/Library: React 19, Vite

Styling: Tailwind CSS, shadcn/ui

State Management: Zustand

Core API: Web Speech API (음성 인식), YouTube IFrame Player API

Backend

Language/Framework: Java 17, Spring Boot 3.5.x

ORM / DB: Spring Data JPA, Hibernate, MySQL 8.x

Build Tool: Gradle

AI & Environment

Architecture: Monorepo (Git)

AI Tools: Claude Desktop + Context7 MCP (AI 주도 개발 환경 구축)

📁 Repository Structure (폴더 구조)

이 프로젝트는 백엔드와 프론트엔드가 하나의 저장소에서 관리되는 모노레포(Monorepo) 구조를 따릅니다.

shadowing-app/
├── backend/                # Spring Boot REST API 서버
│   ├── src/main/java/      # 비즈니스 로직 및 JPA 엔티티
│   ├── src/main/resources/ # application.yml 등 설정 파일
│   └── build.gradle        # 백엔드 의존성 관리
├── frontend/               # React + Vite 웹 애플리케이션
│   ├── src/                # UI 컴포넌트, 상태 관리, API 호출 로직
│   ├── package.json        # 프론트엔드 패키지 관리
│   └── tailwind.config.js  # 스타일 설정
├── .gitignore              # Git 추적 제외 목록
├── claude.md               # AI(Claude) 전용 프로젝트 개발 가이드라인
└── README.md               # 프로젝트 상세 소개 (현재 파일)


🚀 Getting Started (로컬 실행 방법)

1. Prerequisites (사전 준비)

Java 17 이상 설치

Node.js 20.x 이상 및 npm 설치

MySQL 8.x 실행 중

2. Database Setting (DB 세팅)

MySQL에 접속하여 로컬 개발용 데이터베이스를 생성합니다.

CREATE DATABASE shadowing_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


3. Backend Run (백엔드 실행)

backend/src/main/resources/application.yml 파일에 MySQL 접속 정보(URL, Username, Password)를 설정합니다. (파일이 없다면 생성)

백엔드 디렉토리로 이동하여 서버를 실행합니다.

cd backend
./gradlew bootRun  # Windows의 경우: gradlew.bat bootRun


기본 포트: http://localhost:8080

4. Frontend Run (프론트엔드 실행)

새로운 터미널 창을 열고 프론트엔드 디렉토리로 이동하여 실행합니다.

cd frontend
npm install
npm run dev


기본 포트: http://localhost:5173

🌟 Core Features (주요 기능)

영상 재생 & 대사 동기화: 유튜브 영상을 재생하며, 현재 재생 시간에 맞는 일본어 스크립트(한글 발음 및 번역 포함)를 화면에 하이라이팅하여 보여줍니다.

음성 인식 (STT) 채점: 사용자가 마이크 버튼을 누르고 일본어 대사를 읽으면, Web Speech API가 이를 텍스트로 변환하여 원본 대사와 비교 및 채점합니다.

구간 반복: 학습자가 특정 대사를 완벽하게 숙지할 수 있도록, 해당 대사의 시작과 끝 구간만 반복해서 재생하는 기능을 제공합니다.

🤖 AI Development Guide

본 프로젝트는 AI 에이전트(Claude)의 적극적인 지원을 받아 개발됩니다.
AI가 코드를 작성하거나 수정할 때는 루트 디렉토리에 위치한 claude.md 가이드라인을 최우선으로 준수합니다.