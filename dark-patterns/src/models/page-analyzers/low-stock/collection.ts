import PageAnalyzer from "@/models/page-analyzers/page-analyzer";
import WoocommerceLowStockAnalyzer from "@/models/page-analyzers/low-stock/woocommerce-low-stock.analyzer";

const LowStockAnalyzersCollection: PageAnalyzer[] = [
  new WoocommerceLowStockAnalyzer(),
];

export default LowStockAnalyzersCollection;
