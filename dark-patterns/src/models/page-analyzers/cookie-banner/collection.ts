import PageAnalyzer from "../page-analyzer";
import CookieBannerAnalyzer from "@/models/page-analyzers/cookie-banner/cookie-banner.analyzer";

const CookieBannerAnalyzersCollection: PageAnalyzer[] = [
  new CookieBannerAnalyzer(),
];

export default CookieBannerAnalyzersCollection;
