/**
 * Seed booklet products from Unipack Machine Booklet.
 * Run: npx tsx script/seed-booklet.ts
 * This deletes existing products and seeds the 6 booklet products.
 */
import { db } from "../server/db";
import { products, inquiries } from "@shared/schema";
import { sql } from "drizzle-orm";

const bookletProducts = [
  {
    name: "Family Pack PLC Model",
    slug: "family-pack-plc-model",
    category: "Food Packaging",
    description: "3 Servo Standard Model for biscuits, rusk, khari. Auto or manual feeder with square or round shape support. Right angle feeding for single, two, or three rows.",
    capacity: "1 line: 100–120 P/M, 2 line: 50–60 P/M, 3 line: 25–35 P/M",
    specs: { "Model": "3 Servo Standard Model", "Feeder Type": "Auto Feeder / Manual", "Packing Products": "Biscuits, Rusk, Khari etc.", "Sealing Type": "Centre Seals", "Weight Capacity": "UPS 1000 wt." },
    features: ["Auto feeder systems", "Square or round shape", "On edge toast (rusk) support", "Right angle feeding"],
    imageUrl: "/images/family-pack-plc.png",
  },
  {
    name: "One Edge Biscuits Packing Machine",
    slug: "one-edge-biscuits-packing-machine",
    category: "Food Packaging",
    description: "Double Feedar Serve Model horizontal pillow pack machine. 3 Servo Standard. Packs biscuits of square or round shape.",
    capacity: "150 to 170 P/M (1 line)",
    specs: { "Model": "Double Feedar Serve Model", "Control": "3 Servo Standard Model", "Induction": "3+4+2 Induction", "Packing Products": "Biscuits", "Sealing Type": "Centre Seals", "Weight Capacity": "UPS 1000 wt." },
    features: ["Square or round biscuits", "Horizontal pillow pack", "Auto feeder systems", "High-speed output"],
    imageUrl: "/images/one-edge-biscuit-packing.png",
  },
  {
    name: "Right Angle Machine PLC Model",
    slug: "right-angle-machine-plc-model",
    category: "Bakery Packaging",
    description: "4 Servo Standard Model for bread and cream biscuits. Attachable bread slicer. Extra changeover for additional products.",
    capacity: "50 to 60 Pouches/Min",
    specs: { "Model": "PLC Model", "Attached Functionality": "Attach Bread Slicer", "Control": "4 Servo Standard Model", "Packing Products": "Bread, Cream Biscuits", "Sealing Type": "Centre Seals", "Weight Capacity": "UPS 1000 wt." },
    features: ["Bread slicer attachment", "Extra changeover for products", "PLC controlled", "Heavy-duty design"],
    imageUrl: "/images/right-angle-machine-plc.png",
  },
  {
    name: "Hotel Pack Manual PLC Model",
    slug: "hotel-pack-manual-plc-model",
    category: "Food Packaging",
    description: "3 Servo Standard Model with No Product No Bag system. For biscuits, rusk, khari. Centre seal packaging.",
    capacity: "100 to 120 P/M",
    specs: { "Model": "3 Servo Standard Model", "Feature": "No Product No Bag", "Packing Products": "Biscuits, Rusk, Khari etc.", "Sealing Type": "Centre Seals", "Weight Capacity": "UPS 1000 wt." },
    features: ["No Product No Bag system", "Manual PLC control", "Versatile product range", "Efficient operation"],
    imageUrl: "/images/hotel-pack-manual-plc.png",
  },
  {
    name: "Bottom Seal Flow Wrap Machine",
    slug: "bottom-seal-flow-wrap-machine",
    category: "Food Packaging",
    description: "3 Servo Standard Model for kulfi, chocobar and frozen products. No Product No Bag feature. Centre seals.",
    capacity: "100 to 120 P/M",
    specs: { "Model": "3 Servo Standard Model", "Feature": "No Product No Bag", "Packing Products": "Kulfi, Chocobar", "Sealing Type": "Centre Seals", "Weight Capacity": "UPS 1000 wt." },
    features: ["Kulfi & chocobar packaging", "No Product No Bag", "Frozen product capable", "Flow wrap design"],
    imageUrl: "/images/bottom-seal-flow-wrap.png",
  },
];

async function run() {
  await db.execute(sql`DELETE FROM inquiries`);
  await db.execute(sql`DELETE FROM products`);
  for (const p of bookletProducts) {
    await db.insert(products).values(p);
  }
  console.log("Seeded", bookletProducts.length, "booklet products.");
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
