# Re:Space WEB - Execution Guide

## 목적
- 한국(KRW) 대상 단일상품 판매 + 견적문의 + 회원/비회원 결제 운영
- 스택: Vite(프론트), Express(백엔드), Supabase(Postgres/Auth), PortOne(Toss PG)

## 진행 원칙
- 우선순위를 정하고 단계별로 진행한다.
- 각 단계는 완료/검증 후 다음 단계로 이동한다.
- 필요 시 Collab(멀티 에이전트) 기능을 사용해 조사/설계/리뷰를 병행한다.

## 우선순위 로드맵
1) 데이터/인프라 기반 확정 (Supabase + 서버 환경)
2) 결제 플로우 구현 (PortOne + Toss)
3) 견적/주문/회원 프론트 연동
4) 운영 배포/모니터링/정책 문서

## 현재 진행 단계
- Phase 1 - Foundation: 완료
- Phase 2 - Payments: 진행 중 (Render 배포 + PortOne 웹훅 등록 대기)
 - Phase 3 - Frontend: 진행 중 (상품 카탈로그/주문조회)

## 단계별 체크리스트

### Phase 1 - Foundation (현재)
- [x] Supabase 프로젝트 생성
- [x] `supabase/schema.sql` 적용
- [x] 단일상품 1건 시드 데이터 등록
- [x] 서버 `.env` 구성 (SUPABASE, PortOne)
- [x] API 기본 엔드포인트 점검

### Phase 2 - Payments
- [x] PortOne 결제 준비/승인 API 구현
- [x] 결제 웹훅 검증 + 주문 상태 업데이트
- [x] 결제 실패/취소 처리
- [ ] 백엔드 배포(Render) 후 웹훅 URL 등록

### Phase 3 - Frontend
- [x] 상품 상세 → 주문 → 결제 진입
- [x] 장바구니 담기/수량 변경/결제 진입
- [x] 견적 문의 폼 연동
- [x] 회원/비회원 주문 조회
- [x] 상품 카탈로그 + 카테고리 필터
- [x] 어드민 로그인/권한 체크
- [x] 어드민 견적 관리/대시보드 실데이터

### Phase 4 - Ops
- [ ] 백엔드 배포 (Render/Railway/Vercel 중 선택)
- [ ] 도메인/SSL/SEO/분석 설정
- [ ] 약관/개인정보처리방침 페이지

## 결정 기록
- 트랙: B (완전 커스텀)
- 결제: PortOne + Toss (개인 → 법인 전환 예정)
- 회원: 비회원 결제 허용
