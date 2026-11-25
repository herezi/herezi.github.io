// 공통 CSS 진입점. 여기서는 CSS를 해시된 파일로 뽑아내는 용도로만 쓰고, 이 JS는 페이지에 싣지 않는다.
// 페이지별 JS가 필요하면(지금은 /notices/만) 별도 진입점을 vite.config.ts input에 추가한다.
import "./styles.css";
