export default class Color {
  private readonly red: number;
  private readonly green: number;
  private readonly blue: number;
  private opacity: number;

  constructor(red: number, green: number, blue: number, opacity: number) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.opacity = opacity;
  }

  get_red(): number {
    return this.red;
  }

  get_green(): number {
    return this.green;
  }

  get_blue(): number {
    return this.blue;
  }

  get_opacity(): number {
    return this.opacity;
  }

  set_opacity(opacity: number) {
    this.opacity = opacity;
  }
}
