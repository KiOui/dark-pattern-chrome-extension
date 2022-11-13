import DarkPattern from "@/models/dark-patterns/dark-pattern";
import CookieBannerAnalyzersCollection from "@/models/page-analyzers/cookie-banner/collection";

class CookieBanner extends DarkPattern {
  analyzers = CookieBannerAnalyzersCollection;
  description = "A cookie banner";
  goal = "To trick you";
  name = "Cookie Banner";
  type = "cookie-banner";
}

export default CookieBanner;
