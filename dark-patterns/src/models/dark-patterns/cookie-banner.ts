import DarkPattern from "@/models/dark-patterns/dark-pattern";
import CookieBannerAnalyzersCollection from "@/models/page-analyzers/cookie-banner/collection";

class CookieBanner extends DarkPattern {
  analyzers = CookieBannerAnalyzersCollection;
  description =
    "A cookie banner gives the option over storage of cookies by a website.";
  goal =
    "Cookie banners usually include all kinds of deceptive design patterns such as visual interference and misdirection.";
  name = "Cookie Banner";
  type = "cookie-banner";
}

export default CookieBanner;
