# jackson-office 진행 기록
생성일: 2026-09-04
---

## 📌 자료실 동기화 절차 (사장님이 "드라이브와 동기화해"라고 하면)

**자료실 공유 폴더 ID**: `1m6THqz_7Y8VZ983gY2fWGQakm5Br18Ls`
(index.html 자료실 항목들의 원본 폴더)

1. `mcp__Google_Drive__search_files`로 `parentId = '1m6THqz_7Y8VZ983gY2fWGQakm5Br18Ls'` 조건으로 폴더 안 실제 파일 목록 조회
2. index.html의 `<div class="archive-list">` 안 현재 링크 목록과 대조
   - 드라이브에는 있는데 사이트에 없는 파일 → 추가
   - 사이트에는 있는데 드라이브에서 삭제된 파일 → 제거
   - 파일명/용량이 바뀐 경우 → 갱신
3. 변경사항 반영 후 커밋 → main 배포 (규칙 5: PR 없이 바로 main)
4. PROJECT_LOG.md에 동기화 결과 기록

**주의**: 파일 이름을 사이트에서만 바꾸는 것과 드라이브의 실제 파일을 교체하는 것은 다르다 (2026-09-04 office_utility_01.zip 사례 참고). 동기화 시 파일 ID 기준으로 대조할 것, 이름만 보고 판단하지 말 것.

## 2026-09-04 [조사 중 / 원인 미확정]
### 작업 내용
- 사장님이 잭슨사무실(jackson-office) 사이트 운영 상태 확인 요청
- 사이트 하단 "자료실" 링크(`office_utility_01.zip`) 클릭 시 접근 불가 문제 보고

### 현재 상태 (확인된 사실만)
- jackson-office 사이트(GitHub Pages) 자체는 정상 운영 중 (HTTP 200)
- 사이트에 걸린 다른 링크(hanbadadiary, JACKSONGUITAR, jarvis-web, cloud-steel-delta, wing)는 전부 정상
- 자료실 링크 `https://drive.google.com/file/d/1p6gi5Hztyp1Ad2qk-4LczufeKvjSGhCN/view` → 접속 시 구글이 "약관 위반(violation of our terms)"으로 접근 차단 중 (403)
- git 기록상 이 파일 ID는 원래 "Ratiborus KMS Tools 01.03.2023.zip"(윈도우 인증 크랙툴)로 등록됐던 것이고, 2026-09-03 23:59 커밋에서 **표시 이름만** "office_utility_01.zip"으로 변경됨 (링크/파일ID는 그대로)

### 미확인 / 사장님 확인 필요
- 사장님 말씀: "어제 자료 올려놓고 오늘 하나 올려서 이름만 링크를 거는 것"이라 어제까지는 정상이었다고 함
- Claude는 **git에 기록된 index.html 변경 이력만** 볼 수 있고, 구글드라이브 계정 내부(실제 파일 교체·버전 업로드 등)는 직접 볼 수 없음 — 이 부분이 이번 대화에서 인수인계 누락 지점이었음
- → 사장님이 구글드라이브에서 해당 파일(`1p6gi5Hztyp1Ad2qk-4LczufeKvjSGhCN`)을 직접 열어 실제 상태 확인 요청드린 상태 (미회신)

### 배운 것 / 반복하면 안 되는 실수
- **Claude는 구글드라이브 계정 내부 상태를 볼 수 없다** — git으로 추적되는 것은 "사이트에 걸린 링크 텍스트/ID"뿐, 실제 드라이브 파일 내용·교체 이력은 별개. 이 차이를 처음부터 사장님께 명확히 밝히고 시작할 것.
- 자료실 파일명을 "이름만" 바꾸는 것과 "실제 새 파일로 교체"하는 것은 다른 작업. 새 파일을 올렸다면 **새 파일 ID로 index.html의 href를 갱신**해야 함 — 이름 텍스트만 바꾸면 예전 파일을 계속 가리킴.
- 방(채팅창)이 바뀌면 이 기록(PROJECT_LOG.md)을 새 세션이 먼저 읽고 이어가야 함.

### 해결됨
- office_utility_01.zip(구글 정책 위반 차단)은 원래 문제였던 별개 건 — 사장님이 "신경쓰지 말라"고 확정, 그대로 둠
- 오늘 새로 올라온 파일은 `User-Manual_WING-series_2025-10-20.pdf` (18.9MB) — Google Drive `search_files`로 직접 검색해서 찾아 자료실에 추가, main 배포 완료
- 앞으로 사장님이 파일 링크를 직접 안 줘도, 이름/키워드만 말하면 드라이브에서 검색해서 연결 가능함을 확인

### 다음 세션에서 참고
- 위 "자료실 동기화 절차" 참고해서 "드라이브와 동기화해" 요청 시 그대로 수행

## 2026-09-04 (2) [완료] 사이트 비밀번호 보호 + 자료실 동기화
### 배경
- 자료실 폴더가 전체공개라, 개인정보 포함 파일(이력서)을 올리면 누구나 다운로드 가능한 문제 발견
- 해결책으로 사이트 자체에 로그인 보호를 걸기로 결정

### 작업 내용
- jackson-office를 **Vercel로 이전** + `middleware.js`로 Basic Auth 구현 (무료 요금제라 Vercel 정식 비밀번호 보호 기능은 못 씀)
- **새 주소**: https://yamugyclaude-jackson-office.vercel.app/ (아이디 `jackson` / 비번 `278727`)
- 기존 GitHub Pages 주소(`yamugyclaude.github.io/jackson-office`)는 사장님이 직접 Settings → Pages → Source "None"으로 껐음 (Claude의 GitHub 도구엔 Pages 설정 변경 기능이 없어서 대신 못 함) → 지금은 404, 완전히 죽음
- 사이트가 보호되므로 자료실에 **김희정2026이력서.xlsx** 추가 완료 (main 배포됨)

### 배운 것 / 주의
- **Claude의 GitHub MCP 도구는 파일 생성/수정/삭제, PR, 이슈만 가능하고 저장소 Settings(Pages on/off 등)는 건드릴 수 없음.** 이 부분을 요청받으면 미리 "안 됨"을 밝히고 사장님께 직접 안내할 것 — 해보고 나서 안 된다고 하면 신뢰 문제가 생김.
- Vercel 무료(hobby) 요금제는 정식 비밀번호 보호(Deployment Protection) 미지원 → middleware.js로 직접 구현해야 함.
- Vercel 프로젝트를 API로 새로 만들 때 git 연결이 API로는 잘 안 되는 경우가 있었음 — 이땐 사장님이 vercel.com/new에서 직접 Import하는 게 확실함.

### 현재 상태
- 사이트: https://yamugyclaude-jackson-office.vercel.app/ (비번 보호, 정상)
- 저장소: yamugyclaude/jackson-office main 브랜치, Vercel과 git 연결되어 push하면 자동 배포됨
- 자료실 폴더(`1m6THqz_7Y8VZ983gY2fWGQakm5Br18Ls`) 파일 3개 전부 사이트에 반영 완료 (office_utility_01.zip, WING 매뉴얼, 이력서)
