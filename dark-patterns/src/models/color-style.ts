import Color from "@/models/color";

export default class ColorStyle {
  private readonly color: Color;
  private readonly opacity: number;

  constructor(color: Color, opacity: number) {
    this.color = color;
    this.opacity = opacity;
  }

  get_color(): Color {
    return this.color;
  }

  get_opacity(): number {
    return this.opacity;
  }
}
