# 배포 전 점검 체크리스트

## ✅ 코드 품질

- [x] Linter 오류 없음
- [x] Console.log 제거됨 (필요한 로그만 남김)
- [x] TODO/FIXME 없음

## ✅ SEO 최적화

- [x] Title: "홈페이지 제작 전문 업체 | 기획부터 최적화까지 결과 중심 | 누비오" (약 40자)
- [x] Description: 140자 완료 (운영 걱정 해결, 25년차 전문가, 무료 진단 강조)
- [x] Keywords: 9개 (100자 이하)
- [x] Canonical URL: `${SITE_URL}/landing`
- [x] Open Graph 설정 완료
- [x] Twitter Card 설정 완료
- [x] Robots: index, follow

## ✅ 주요 기능

- [x] Contact 폼 제출 (백그라운드 메일 발송)
- [x] 문의사항 파일 저장 (`/data/inquiries.json`)
- [x] 관리자 페이지 (`/admin/inquiries`) - 비밀번호 보호
- [x] 포트폴리오 모달 팝업
- [x] 앵커 링크 스무스 스크롤
- [x] 퀵 전환 버튼 (하단 고정)
- [x] 반응형 디자인

## ✅ 보안

- [x] 환경변수 `.gitignore`에 포함
- [x] 문의사항 데이터 파일 `.gitignore`에 포함
- [x] 관리자 인증 (세션 쿠키)
- [x] XSS 방지 (HTML 이스케이프)
- [x] CSRF 보호 (Next.js 기본)

## ✅ 환경변수 설정 필요

다음 환경변수들을 배포 환경에 설정해야 합니다:

### 필수 (Contact 폼)

- `SMTP_HOST` - SMTP 서버 주소
- `SMTP_PORT` - SMTP 포트 (465 또는 587)
- `SMTP_USER` - SMTP 사용자명
- `SMTP_PASS` - SMTP 비밀번호
- `MAIL_TO` - 수신 이메일 주소
- `MAIL_FROM` (선택) - 발신자 이메일

### 선택 (Resend 사용 시)

- `USE_RESEND=true` - Resend 우선 사용
- `RESEND_API_KEY` - Resend API 키

### 관리자 페이지

- `ADMIN_PASSWORD` - 관리자 비밀번호 (반드시 변경!)
- `SESSION_SECRET` - 세션 암호화 키 (랜덤 문자열 권장)

### 기타

- `NEXT_PUBLIC_SITE_URL` - 사이트 URL (기본값: https://nuvio-web.com)

## ✅ 성능

- [x] 이미지 최적화 (next/image 사용)
- [x] 백그라운드 메일 발송 (사용자 응답 블로킹 없음)
- [x] GSAP 애니메이션 최적화
- [x] 스크롤 트리거 최적화

## ✅ 접근성

- [x] 시맨틱 HTML 사용
- [x] Alt 텍스트 설정
- [x] 키보드 네비게이션 지원
- [x] ARIA 레이블 (필요한 경우)

## ✅ 파일 구조

- [x] `/data/inquiries.json` - Git에 커밋되지 않음
- [x] `.env*` 파일 - Git에 커밋되지 않음
- [x] 관리자 페이지 보안 설정 완료

## ⚠️ 배포 전 확인 사항

1. **환경변수 설정**
   - Vercel/배포 환경에 모든 필수 환경변수 설정
   - `ADMIN_PASSWORD` 반드시 강력한 비밀번호로 변경
   - `SESSION_SECRET` 랜덤 문자열로 생성

2. **데이터 디렉토리**
   - `/data` 디렉토리가 생성될 수 있도록 확인
   - 파일 쓰기 권한 확인

3. **메일 발송 테스트**
   - Contact 폼 제출 테스트
   - 메일 수신 확인
   - 백그라운드 발송 동작 확인

4. **관리자 페이지 테스트**
   - `/admin/inquiries` 접근 테스트
   - 로그인/로그아웃 테스트
   - 문의사항 조회/완료 처리/삭제 테스트

5. **모바일 반응형 테스트**
   - 다양한 화면 크기에서 테스트
   - 터치 인터랙션 확인

6. **성능 테스트**
   - 페이지 로딩 속도 확인
   - 애니메이션 부드러움 확인
   - 메모리 누수 확인

## 📝 배포 후 확인

1. Google Search Console 등록
2. Google Analytics 설정 확인
3. 메일 발송 모니터링
4. 에러 로그 모니터링
5. 사용자 피드백 수집
