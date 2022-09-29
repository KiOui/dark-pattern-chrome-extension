import PageAnalyzer from "../page-analyzer";

class WooCommerceLowStockAnalyzer extends PageAnalyzer {
  type = "woocommerce-low-stock";

  analyzePageContent(pageContent: HTMLElement): HTMLElement[] {
    const foundElements =
      pageContent.querySelectorAll<HTMLElement>(".in-stock");
    if (foundElements === null) {
      return [];
    } else {
      return Array.from(foundElements);
    }
  }
}

export default WooCommerceLowStockAnalyzer;
