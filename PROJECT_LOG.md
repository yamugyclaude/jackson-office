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
