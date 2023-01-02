import DarkPattern from "@/models/dark-patterns/dark-pattern";
import LowStockAnalyzersCollection from "@/models/page-analyzers/low-stock/collection";

class LowStock extends DarkPattern {
  analyzers = LowStockAnalyzersCollection;
  description = "A low stock message, usually present on a product page.";
  goal =
    "Low stock messages can cause a sense of urgency by displaying how many of a product is left in stock. A low stock message might be fake.";
  name = "Low Stock";
  type = "low-stock";
}

export default LowStock;
