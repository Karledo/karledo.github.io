export class Vector2 {
  x: number = 0;
  y: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public magnitude() {
    return (this.x ** 2 + this.y ** 2) ** 0.5;
  }

  public squaredMagnitude() {
    return this.x ** 2 + this.y ** 2;
  }

  public sub(vector: Vector2) {
    return new Vector2(this.x - vector.x, this.y - vector.y);
  }

  public add(vector: Vector2) {
    return new Vector2(this.x + vector.x, this.y + vector.y);
  }

  public normalized() {
    const length = this.magnitude();
    if (length == 0) return new Vector2(0, 0);
    return new Vector2(this.x / length, this.y / length);
  }

  public scale(scalar: number) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }
}
