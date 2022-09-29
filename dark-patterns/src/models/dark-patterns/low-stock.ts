import DarkPattern from "@/models/dark-patterns/dark-pattern";
import LowStockAnalyzersCollection from "@/models/page-analyzers/low-stock/collection";

class LowStock extends DarkPattern {
  analyzers = LowStockAnalyzersCollection;
  description = "A low stock message";
  goal = "To trick you";
  name = "Low Stock";
  type = "low-stock";
}

export default LowStock;
