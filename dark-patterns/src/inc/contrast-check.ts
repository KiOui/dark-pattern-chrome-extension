import Color from "@/models/color";
import ColorStyle from "@/models/color-style";
import { isDisplayed } from "@/inc/services";
import ColorEvaluation from "@/models/evaluation";

const largeFontSize = 24;
const normalFontSize = 18.6667;
const highThreshold = 7;
const midThreshold = 4.5;
const lowThreshold = 3;

const elementsToExclude = [
  "SCRIPT",
  "NOSCRIPT",
  "HR",
  "BR",
  "TABLE",
  "TBODY",
  "THEAD",
  "TFOOT",
  "TR",
  "IFRAME",
  "OPTION",
  "UL",
  "OL",
  "DL",
  "STYLE",
  "LINK",
  "OBJECT",
  "META",
  "AREA",
  "IMG",
];

function RGBStringToObject(color: string): Color | null {
  const plainParameters = color
    .replace("rgb(", "")
    .replace("rgba(", "")
    .replace("(", "")
    .replace(")", "")
    .replace(/ /g, "");

  let separator = null;
  if (plainParameters.indexOf(",") > -1) {
    separator = ",";
  } else if (plainParameters.indexOf(":") > -1) {
    separator = ":";
  } else if (plainParameters.indexOf("/") > -1) {
    separator = "/";
  } else if (plainParameters.indexOf(".") > -1) {
    separator = ".";
  }

  if (separator !== null) {
    const rgbValues = plainParameters.split(separator);
    if (rgbValues.length >= 3 && rgbValues.length <= 4) {
      return new Color(
        parseInt(rgbValues[0]),
        parseInt(rgbValues[1]),
        parseInt(rgbValues[2]),
        rgbValues[3] === undefined ? 1 : parseFloat(rgbValues[3])
      );
    }
  }
  return null;
}

function flattenColors(fgColor: Color, bgColor: Color): Color {
  const alpha = fgColor.get_opacity();
  if (alpha === 1) {
    return fgColor;
  }
  const r = (1 - alpha) * bgColor.get_red() + alpha * fgColor.get_red();
  const g = (1 - alpha) * bgColor.get_green() + alpha * fgColor.get_green();
  const b = (1 - alpha) * bgColor.get_blue() + alpha * fgColor.get_blue();
  const o =
    fgColor.get_opacity() + bgColor.get_opacity() * (1 - fgColor.get_opacity());

  return new Color(r, g, b, o);
}

function getColorFromStack(stack: ColorStyle[]) {
  if (stack.length > 0) {
    let updated = new Color(
      stack[0].get_color().get_red(),
      stack[0].get_color().get_green(),
      stack[0].get_color().get_blue(),
      stack[0].get_color().get_opacity()
    );
    updated.set_opacity(updated.get_opacity() * stack[0].get_opacity());

    for (let i = 1; i < stack.length; i++) {
      updated = flattenColors(updated, stack[i].get_color());
      updated.set_opacity(stack[i].get_opacity());
    }

    return updated;
  } else {
    return null;
  }
}

function getOpacityFromStack(stack: ColorStyle[]): number {
  let opacity = 1;
  stack.forEach((element) => {
    opacity = opacity * element.get_opacity();
  });
  return opacity;
}

function getBodyBackgroundColor(): Color {
  const bodyBackgroundColor = window
    .getComputedStyle(document.body)
    .getPropertyValue("background-color");
  const RGBObject = RGBStringToObject(bodyBackgroundColor);
  if (RGBObject === null || RGBObject.get_opacity()) {
    return new Color(255, 255, 255, 1);
  }
  return RGBObject;
}

function getAncestorsStackInfo(element: HTMLElement) {
  const ancestors = [];

  for (
    let currentElement: HTMLElement | null = element;
    currentElement !== null && currentElement.tagName.toLowerCase() !== "body";
    currentElement = currentElement.parentElement
  ) {
    const bgColor = RGBStringToObject(
      window.getComputedStyle(element).getPropertyValue("background-color")
    );
    if (bgColor !== null) {
      const opacity = parseFloat(
        window.getComputedStyle(element).getPropertyValue("opacity")
      );
      const colorStyle = new ColorStyle(bgColor, opacity);
      const alpha =
        colorStyle.get_color().get_opacity() * colorStyle.get_opacity();
      if (alpha > 0 || opacity < 1) {
        ancestors.push(colorStyle);
      }
    }
  }
  const bgColor = getBodyBackgroundColor();
  if (bgColor !== null) {
    ancestors.push(new ColorStyle(bgColor, 1));
  }

  return ancestors;
}

function getForegroundColor(element: HTMLElement, stack: ColorStyle[]) {
  const bgColor = RGBStringToObject(
    window.getComputedStyle(element).getPropertyValue("color")
  );
  if (bgColor !== null) {
    const opacity = parseFloat(
      window.getComputedStyle(element).getPropertyValue("opacity")
    );
    return getColorFromStack([new ColorStyle(bgColor, opacity)].concat(stack));
  } else {
    return null;
  }
}

function linearisedColorComponent(colorSegment: number) {
  if (colorSegment <= 0.03928) {
    return colorSegment / 12.92;
  } else {
    return Math.pow((colorSegment + 0.055) / 1.055, 2.4);
  }
}

function getLuminosity(color: Color) {
  const fLinearisedRed = linearisedColorComponent(color.get_red() / 255);
  const fLinearisedGreen = linearisedColorComponent(color.get_green() / 255);
  const fLinearisedBlue = linearisedColorComponent(color.get_blue() / 255);

  return (
    0.2126 * fLinearisedRed +
    0.7152 * fLinearisedGreen +
    0.0722 * fLinearisedBlue
  );
}

function getContrastRatio(foreground: Color, background: Color) {
  const foregroundLuminosity = getLuminosity(foreground);
  const backgroundLuminosity = getLuminosity(background);
  let higherValue;
  let lowerValue;

  if (foregroundLuminosity > backgroundLuminosity) {
    higherValue = foregroundLuminosity;
    lowerValue = backgroundLuminosity;
  } else {
    higherValue = backgroundLuminosity;
    lowerValue = foregroundLuminosity;
  }
  const contrastDiff = (higherValue + 0.05) / (lowerValue + 0.05);

  return Math.round(contrastDiff * 100) / 100; // round to two decimals
}

function inElementsToExclude(element: HTMLElement): boolean {
  for (let i = 0; i < elementsToExclude.length; i++) {
    if (elementsToExclude[i] === element.tagName) {
      return true;
    }
  }
  return false;
}

function contrastCheck(element: HTMLElement): ColorEvaluation | null {
  if (inElementsToExclude(element)) {
    return null;
  }
  const computedStyle = window.getComputedStyle(element);
  const ancestorsStack = getAncestorsStackInfo(element);
  const backgroundColor = getColorFromStack(ancestorsStack);
  const hasOpacity = getOpacityFromStack(ancestorsStack) > 0;
  const isVisible = hasOpacity && isDisplayed(element);
  const fontSize = parseInt(
    computedStyle.getPropertyValue("font-size").replace("px", "")
  );
  const fontWeight = computedStyle.getPropertyValue("font-weight");
  const isBold =
    (!isNaN(parseInt(fontWeight)) && parseInt(fontWeight) >= 700) ||
    fontWeight === "bold" ||
    fontWeight === "bolder";
  const size =
    fontSize >= largeFontSize || (fontSize >= normalFontSize && isBold)
      ? "large"
      : "small";

  const foregroundColor = getForegroundColor(element, ancestorsStack);

  if (foregroundColor !== null && backgroundColor !== null) {
    const contrast = getContrastRatio(foregroundColor, backgroundColor);

    let colorEvaluation;

    if (size === "small") {
      colorEvaluation = new ColorEvaluation(
        element,
        fontSize,
        fontWeight,
        size,
        foregroundColor,
        backgroundColor,
        contrast,
        isVisible,
        contrast >= midThreshold,
        contrast >= highThreshold
      );
    } else {
      colorEvaluation = new ColorEvaluation(
        element,
        fontSize,
        fontWeight,
        size,
        foregroundColor,
        backgroundColor,
        contrast,
        isVisible,
        contrast >= lowThreshold,
        contrast >= midThreshold
      );
    }

    return colorEvaluation;
  } else {
    return null;
  }
}

export default contrastCheck;
