# 페어 핵심 요약 템플릿

글 커미션, 특히 오마카세 신청용으로 만든 한 장짜리 페어 요약 사이트입니다.

## 기능

- 브라우저에서 바로 내용 수정
- 수정 내용 자동 저장
- JSON 백업 / 불러오기
- PNG 이미지 저장
- 모바일 / PC 반응형
- GitHub Pages에서 바로 사용 가능

## GitHub Pages에 올리는 방법

1. 새 GitHub 저장소를 만듭니다.
2. 이 폴더 안의 `index.html`, `style.css`, `script.js`를 저장소 최상단에 업로드합니다.
3. GitHub 저장소의 `Settings` → `Pages`로 이동합니다.
4. `Build and deployment`에서 `Deploy from a branch`를 선택합니다.
5. Branch를 `main`, 폴더를 `/ (root)`로 설정하고 저장합니다.
6. 잠시 뒤 표시되는 GitHub Pages 주소로 접속하면 사이트를 사용할 수 있습니다.

## 색상 변경

`style.css` 맨 위 `:root` 안의 색상값만 바꾸면 전체 테마를 쉽게 변경할 수 있습니다.

- `--accent`: 포인트 색
- `--accent-soft`: 연한 포인트 배경
- `--sheet`: 결과 이미지 배경
- `--bg`: 편집 화면 배경

## 참고

PNG 저장 기능은 `html2canvas` CDN을 사용하므로 인터넷 연결이 필요합니다.
