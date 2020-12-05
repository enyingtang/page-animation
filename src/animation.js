/* eslint-disable no-param-reassign */

import Piece from './piece';
import config from './config';

function shuffle(array) {
  let len = array.length;

  while (len) {
    const i = Math.floor(Math.random() * len--);
    const t = array[len];

    array[len] = array[i];
    array[i] = t;
  }
  return array;
}

class Animation {
  constructor(image, canvas, scale = 1) {
    this.scale = scale;
    this.image = image;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx.fillStyle = '#FFF';
    this.frame = 0;
    this.createPieces();
  }

  createPieces() {
    const pieces = [];
    const size = config.pieceSize;
    const xPieces = Math.ceil(this.canvas.width / size);
    const yPieces = Math.ceil(this.canvas.height / size);
    const random = () => ((((Math.random() * 100) % 50) - 25) / 10);

    // 生成碎片
    for (let x = 0; x < xPieces; ++x) {
      for (let y = 0; y < yPieces; ++y) {
        pieces.push(new Piece(x * size, y * size, size, [random(), random()], [0, config.acc]));
      }
    }
    // 打乱碎片的顺序
    this.sortedPieces = shuffle(pieces.slice());
    // 按渲染顺序存放
    this.pieces = pieces.reverse();
  }

  render() {
    const duration = 300;
    const { ctx, canvas } = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (this.pieces.length < 1) {
      return;
    }
    this.sortedPieces.forEach((el, i) => {
      // 随着动画播放的时间增长，分批激活碎片
      if (this.frame < duration) {
        if (i < this.sortedPieces.length * this.frame / duration) {
          el.active = true;
        }
      } else {
        el.active = true;
      }
      // 在一段时间后，让碎片开始往下掉落
      if (el.frame > 30) {
        el.updatePosition(canvas.width, canvas.height);
      }
    });
    this.pieces = this.pieces.filter((el) => {
      if (el.frame > 180) {
        return false;
      }
      // 贴上碎片背景图
      ctx.drawImage(
        this.image, el.sourceX / this.scale, el.sourceY / this.scale,
        el.size / this.scale, el.size / this.scale,
        el.position[0], el.position[1], el.size, el.size
      );
      // 如果碎片已经激活
      if (el.active) {
        let alpha = 0;

        if (el.frame > 60) {
          alpha = 1.0;
        } else if (el.frame > 30) {
          alpha = (el.frame - 30) / 30;
        }
        el.frame++;
        ctx.strokeStyle = '#eee';
        ctx.strokeRect(el.position[0], el.position[1], el.size, el.size);
        // 让碎片的背景图渐变为纯色
        ctx.fillStyle = `rgba(${el.color[0]}, ${el.color[1]}, ${el.color[2]}, ${alpha})`;
        ctx.fillRect(el.position[0], el.position[1], el.size, el.size);
      }
      return true;
    });
    this.frame++;
    requestAnimationFrame(() => this.render());
  }
}

export default Animation;
