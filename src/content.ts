import privacyHtml from "../content/legal/privacy.html?raw";
import termsHtml from "../content/legal/terms.html?raw";

// 법률 문서는 기존 정적 HTML 본문을 문구 그대로 옮겨 둔 조각이다. 손대지 말 것.
export const legal = { privacy: privacyHtml, terms: termsHtml };
