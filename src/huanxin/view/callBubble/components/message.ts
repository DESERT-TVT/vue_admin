interface MessageStyle {
  position?: string;
  top?: string;
  left?: string;
  transform?: string;
  backgroundColor?: string;
  color?: string;
  padding?: string;
  borderRadius?: string;
  boxShadow?: string;
  zIndex?: number;
  fontWeight?: string;
  transition?: string;
  opacity?: string;
}

let currentMessageDiv: HTMLDivElement | null = null;

export function messageBtn(text: string, style: Partial<CSSStyleDeclaration> = {}): void {
  // 如果已有提示，先移除它
  if (currentMessageDiv) {
    document.body.removeChild(currentMessageDiv);
    currentMessageDiv = null;
  }

  const div = document.createElement('div');
  div.innerText = text;
  div.style.position = 'fixed';
  div.style.top = '50%';
  div.style.left = '50%';
  div.style.transform = 'translate(-50%, -50%)';
  div.style.backgroundColor = '#faad14';
  div.style.color = '#fff';
  div.style.padding = '4px 8px';
  div.style.borderRadius = '65px';
  div.style.background = 'rgba(0,0,0,0.15)';
  div.style.zIndex = '9999';
  div.style.fontWeight = 'bold';
  div.style.transition = 'opacity 0.5s ease';
  div.style.opacity = '1';

  // 应用额外样式覆盖
  Object.assign(div.style, style);

  document.body.appendChild(div);
  currentMessageDiv = div;

  setTimeout(() => {
    if (currentMessageDiv) {
      currentMessageDiv.style.opacity = '0';
      setTimeout(() => {
        if (currentMessageDiv) {
          document.body.removeChild(currentMessageDiv);
          currentMessageDiv = null;
        }
      }, 500);
    }
  }, 2000);
}

