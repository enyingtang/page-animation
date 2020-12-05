import config from './config';

class Piece {
  constructor(x, y, size, velocity, acceleration) {
    this.active = false;
    this.frame = 0;
    this.color = config.colors[Math.ceil((Math.random() * 100)) % config.colors.length];
    this.prevPosition = [x, y];
    this.position = [x, y];
    this.sourceX = x;
    this.sourceY = y;
    this.size = size;
    this.velocity = velocity;
    this.acceleration = acceleration;
  }

  calcAcceleration() {
    this.acceleration[1] = config.acc / 20;
  }

  calcVelocity() {
    this.velocity[0] += this.acceleration[0];
    this.velocity[1] += this.acceleration[1];
  }

  calcPosition() {
    this.position[0] += this.velocity[0];
    this.position[1] += this.velocity[1];
    this.prevPosition = this.position;
  }

  checkWallColisions(spaceWidth, spaceHeight) {
    if (this.position[1] >= spaceHeight - this.size) {
      this.position[1] = spaceHeight - this.size;
      this.velocity[1] *= -config.bounce;
      if (this.velocity[1] > -0.1 && this.velocity[1] < 0.1) {
        this.velocity[1] = 0;
        this.velocity[0] *= config.surfaceResistance;
        if (Math.abs(this.velocity[0]) <= 0.1) {
          this.velocity[0] = 0;
        }
      }
    } else if (this.position[1] <= this.size) {
      this.position[1] = this.size;
      this.velocity[1] *= -config.bounce;
    }
    if (this.position[0] <= 0 + this.size) {
      this.position[0] = 0 + this.size;
      this.velocity[0] *= -config.bounce;
    } else if (this.position[0] >= spaceWidth - this.size) {
      this.position[0] = spaceWidth - this.size;
      this.velocity[0] *= -config.bounce;
    }
  }

  updatePosition(spaceWidth, spaceHeight) {
    this.calcAcceleration();
    this.checkWallColisions(spaceWidth, spaceHeight);
    this.calcVelocity();
    this.calcPosition();
  }
}

export default Piece;
