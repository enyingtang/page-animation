/* eslint-disable no-param-reassign */
/* eslint-disable no-mixed-operators */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-plusplus */
/* eslint-disable comma-dangle */

import html2canvas from 'html2canvas';
import Animation from './animation';

const isMobile = window.pageParams && window.pageParams.mobile;

function appendStyle(code) {
  const style = document.createElement('style');
  const head = document.head || document.getElementsByTagName('head')[0];

  style.type = 'text/css';
  if (style.styleSheet) {
      style.styleSheet.cssText = code;
  } else {
      style.innerHTML = code;
  }
  head.appendChild(style);
}

function createCanvas() {
  const bg = document.createElement('div');
  const canvas = document.createElement('canvas');

  appendStyle(`
    .gitee-ad-dimmer {
      left: 0;
      top: 0;
      position: fixed;
      width: 100%;
      height: 100%;
      padding: 1rem;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      background: #f6f6f6;
    }
    .gitee-ad-card {
      position: relative;
      padding: 1.5em;
      width: 100%;
      max-width: 480px;
      background: #fff;
      border: 1px solid #DCE3E8;
      border-radius: 0.3em;
      box-sizing: border-box;
    }
    .gitee-ad-card p {
      margin: 1em 0;
    }
    .gitee-ad-card__title {
      font-size: 1.6em;
      font-weight: bold;
    }
    .gitee-ad-card__label {
      top: 1em;
      right: 1em;
      position: absolute;
      padding: 0.15em 0.4em;
      background: #f4f4f4;
      border-radius: 0.3em;
    }
    a.gitee-ad-card__button {
      color: #fff;
      display: inline-block;
      padding: 0.5em 1em;
      border-radius: 0.3em;
      text-decoration: none;
      background-color: #fa7022;
      background-image: linear-gradient(-135deg, #fa7022 0%, #f89d3a 100%);
    }
    .gitee-ad-card__button:hover {
      background-image: linear-gradient(134deg, #ff8909 0%, #fc5b00 100%);
    }
  `)
  bg.innerHTML = `
  <div class="gitee-ad-card">
    <div class="gitee-ad-card__label">推广</div>
    <div class="gitee-ad-card__title">
      码云企业版<br>
      企业级软件协作开发管理平台
    </div>
    <p>有序规划和管理软件研发全生命周期</p>
    <a class="gitee-ad-card__button" href="https://gitee.com/enterprises/new?from=gitee.com">
      免费开通企业版
    </a>
  </div>
  `
  bg.className = 'gitee-ad-dimmer';
  canvas.style.pointerEvents = 'none';
  canvas.style.position = 'fixed';
  canvas.style.left = 0;
  canvas.style.top = 0;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = 10001;
  if (isMobile) {
    canvas.width = window.innerWidth;
  } else {
    canvas.width = Math.max(1040, window.innerWidth);
  }
  canvas.height = window.innerHeight;
  document.body.appendChild(bg);
  document.body.appendChild(canvas);
  document.body.style.overflow = 'hidden';
  bg.addEventListener('click', () => {
    bg.parentNode.removeChild(bg);
    canvas.parentNode.removeChild(canvas);
    document.body.style.overflow = 'auto';
  });
  return canvas;
}

function playAnimation() {
  document.body.style.overflow = 'hidden';
  html2canvas(document.body, { useCORS: true }).then((bodyCanvas) => {
    const image = new Image();

    image.onload = () => {
      new Animation(image, createCanvas(), window.innerWidth / bodyCanvas.width).render();
    }
    image.src = bodyCanvas.toDataURL('image/png');
  });
}

function waitProjectReadmeLoaded() {
  // 等待仓库的 README 内容加载完成
  if (document.querySelector('.readme-box')) {
    playAnimation();
    return;
  }
  setTimeout(waitProjectReadmeLoaded, 1000);
}

window.addEventListener('load', () => {
  const image = new Image();
  const { hostname } = window.location;

  if (hostname === 'localhost' || hostname.endsWith('.gitee.io')) {
    image.onload = () => { new Animation(image, createCanvas()).render(); };
    image.src = 'image.png';
    return;
  }
  if (hostname === 'gitee.com' && window.location.pathname !== '/gitee-frontend/page-animation') {
    return;
  }
  if (isMobile) {
    waitProjectReadmeLoaded();
  } else {
    playAnimation();
  }
});
