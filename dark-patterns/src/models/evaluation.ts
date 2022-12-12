import Color from "@/models/color";

export default class ColorEvaluation {
  private element: HTMLElement;
  private fontSize: number;
  private fontWeight: string;
  private size: string;
  private foregroundColor: Color;
  private backgroundColor: Color;
  private contrast: number;
  private isVisisble: boolean;
  private isValidAA: boolean;
  private isValidAAA: boolean;

  constructor(
    element: HTMLElement,
    fontSize: number,
    fontWeight: string,
    size: string,
    foregroundColor: Color,
    backgroundColor: Color,
    contrast: number,
    isVisible: boolean,
    isValidAA: boolean,
    isValidAAA: boolean
  ) {
    this.element = element;
    this.fontSize = fontSize;
    this.fontWeight = fontWeight;
    this.size = size;
    this.foregroundColor = foregroundColor;
    this.backgroundColor = backgroundColor;
    this.contrast = contrast;
    this.isVisisble = isVisible;
    this.isValidAA = isValidAA;
    this.isValidAAA = isValidAAA;
  }

  getContrast() {
    return this.contrast;
  }

  getIsValidAA() {
    return this.isValidAA;
  }
}
