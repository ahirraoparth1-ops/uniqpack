/**
 * Seed products from admin/images/products_final.csv
 * Run from uniqpack root: npx tsx script/seed-products-csv.ts
 *
 * Prerequisites:
 * - admin/images/product_*.jpg|jpeg|png copied to client/public/images/
 * - DATABASE_URL set in .env
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { db } from "../server/db";
import { products } from "@shared/schema";
import { sql } from "drizzle-orm";

const CSV_PATH = path.resolve(process.cwd(), "admin", "images", "products_final.csv");
const IMAGES_DIR = path.resolve(process.cwd(), "client", "public", "images");

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractCapacity(title: string): string {
  const m = title.match(/\d+[\s]*[Tt]o[\s]*\d+|[\d,]+[\s]*(?:Piece|Pouch|Pouches?)\s*[\/]?\s*[Hh]our/);
  return m ? m[0] : "As per specification";
}

function inferCategory(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("biscuit")) return "Biscuit Packaging Machine";
  if (t.includes("rusk")) return "Rusk Packaging Machine";
  if (t.includes("napkin")) return "Napkin Packaging Machine";
  if (t.includes("bread")) return "Bread Packing Machine";
  if (t.includes("incense")) return "Incense Stick Packaging Machine";
  if (t.includes("soap")) return "Automatic Soap Packaging Machine";
  if (t.includes("automatically pouch")) return "PLC Model Automatically Pouch Packaging Machine";
  if (t.includes("vegetable")) return "Strapping Tensioner";
  // Food packaging family from UniqPack site
  if (
    t.includes("noodles") ||
    t.includes("cookies") ||
    t.includes("cream roll") ||
    t.includes("ice cream") ||
    t.includes("bun paw")
  ) {
    return "Food Packaging Machine";
  }
  return "Packaging Machine";
}

function parseCSV(content: string): { title: string; price: string; image_url: string; local_image: string }[] {
  const lines = content.replace(/\r\n/g, "\n").replace(/\r/g, "").trim().split("\n").filter(Boolean);
  if (lines.length < 2) return [];
  const rows: { title: string; price: string; image_url: string; local_image: string }[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Format: title,"price",image_url,local_image - parse by finding quoted price then splitting rest
    const quotedMatch = line.match(/"([^"]*)"/);
    if (!quotedMatch) continue;
    const price = quotedMatch[1];
    const before = line.substring(0, quotedMatch.index!);
    const after = line.substring(quotedMatch.index! + quotedMatch[0].length);
    const title = before.replace(/,\s*$/, "").trim();
    const afterParts = after.replace(/^,\s*/, "").split(",");
    const image_url = afterParts[0]?.trim() || "";
    const local_image = afterParts.slice(1).join(",").trim();
    if (title) {
      rows.push({ title, price, image_url, local_image });
    }
  }
  return rows;
}

async function run() {
  const csvContent = readFileSync(CSV_PATH, "utf-8");
  const rows = parseCSV(csvContent);
  const insertProducts: {
    name: string;
    slug: string;
    category: string;
    description: string;
    capacity: string;
    specs: Record<string, string>;
    features: string[] | null;
    imageUrl: string;
  }[] = [];

  for (const row of rows) {
    if (!row.title) continue;
    if (row.title === "Uniq Pack") continue; // skip logo-only card

    // Base values derived from CSV and title
    let capacity = extractCapacity(row.title);
    let specs: Record<string, string> = row.price ? { Price: row.price } : {};
    let features: string[] | null = null;

    // Enrich machines with full specs & features
    // using data from the UniqPack product pages.
    switch (row.title) {
      case "Biscuit Packaging Machine":
        // 3000 Piece/Hour Biscuit Packaging Machine
        capacity = "3000 Piece/Hour";
        specs = {
          "Production Capacity": "3000 Piece/Hour",
          "Automation Grade": "Automatic",
          "Driven Type": "Electric",
          "Packaging Type": "Centar",
          Voltage: "240 V",
          Material: "SS",
          Weight: "800 Kg",
          Phase: "3 Phase",
          Price: row.price,
        };
        features = [
          "High-Speed Output: Efficiently packages up to 3000 biscuits per hour, ideal for growing bakeries and mid-sized production.",
          "Consistent Packaging Quality: Ensures uniform sealing and attractive presentation for each biscuit pack.",
          "Easy Operation & Maintenance: User-friendly controls and simple maintenance for minimal downtime.",
        ];
        break;

      case "3000 To 6000 Piece/Hour Automatic Family Pack Biscuit Packaging Machines":
        capacity = "4000 Piece/Hour";
        specs = {
          "Production Capacity": "4000 Piece/Hour",
          "Automation Grade": "Automatic",
          Voltage: "220 V",
          Material: "SS",
          Weight: "900 Kg",
          "Packaging Type": "Center Seal",
          "Driven Type": "Electric",
          Phase: "3 Phase",
          Price: row.price,
        };
        features = [
          "High-Speed Automation: Automatically aligns, counts, and packs biscuits in family-sized packs.",
          "Adjustable Pack Size: Flexible settings to accommodate various pack weights and biscuit dimensions.",
          "Multipack Capability: Efficiently handles multiple biscuits per pack, stacked or tray-loaded.",
          "PLC Control System: Advanced controller with touch screen interface for easy operation.",
          "Servo-Driven Motors: Precise movement and synchronization for consistent packaging quality.",
        ];
        break;

      case "6000 To 9000 Piece/Hour One Edge Biscuit Packaging Machine":
        capacity = "6000 to 9000 P/H";
        specs = {
          "Production Capacity": "6000 to 9000 P/H",
          "Driven Type": "Electric",
          "Automatic Grade": "Automatic",
          Voltage: "220 V",
          Phase: "3 Phase / Singal phase",
          "Packaging Type": "Center Seal",
          Weight: "1500 to 1800 kg apx",
          Material: "SS",
          Price: row.price,
        };
        features = [
          "High-Speed Output: Efficiently packages up to 9000 biscuits per hour, ideal for medium to large-scale production.",
          "One Edge Sealing: Specializes in one edge sealing for secure and attractive biscuit packaging.",
          "Consistent Packaging Quality: Provides uniform sealing and neat presentation to maintain product freshness.",
          "User-Friendly Operation: Easy to operate with simple controls and low maintenance requirements.",
        ];
        break;

      case "5000 Piece/Hour Automatic Family Pack Biscuit Wrapping Machine":
        capacity = "5000 Piece/Hour";
        specs = {
          "Production Capacity": "5000 Piece/Hour",
          "Packaging Type": "Center Seal",
          "Automation Grade": "Automatic",
          Voltage: "230 V",
          Material: "MS",
          "Sealing Type": "Center Seal",
          Weight: "1600 kg",
          Phase: "3 Phase",
          "Driven Type": "Electric",
          Price: row.price,
        };
        features = [
          "High-Speed Efficiency: Packages up to 5000 biscuits per hour, ideal for large-scale production.",
          "Fully Automatic Operation: Automated feeding, wrapping, and sealing for maximum productivity.",
          "Family Pack Design: Tailored for larger family-sized biscuit packs to enhance convenience and shelf appeal.",
          "Consistent Wrap Quality: Ensures neat, secure, and attractive packaging to preserve freshness.",
        ];
        break;

      case "1500 Piece/Hour Cream Biscuit Packaging Machine":
        capacity = "1500 Piece/Hour";
        specs = {
          "Production Capacity": "1500 Piece/Hour",
          "Driven Type": "Electric",
          "Automatic Grade": "Automatic",
          Voltage: "220V",
          Material: "Stainless Steel",
          Phase: "Single Phase",
          Weight: "700kg",
          "Packaging Type": "Centar",
          Price: row.price,
        };
        features = [
          "Reliable Production Rate: Packages up to 1500 cream biscuits per hour, suitable for small to medium-sized manufacturers.",
          "Specialized Handling: Designed to carefully handle delicate cream biscuits to prevent damage during packaging.",
          "Consistent Sealing Quality: Provides uniform, airtight sealing to maintain freshness and product integrity.",
          "User-Friendly Interface: Easy to operate with straightforward controls and minimal setup time.",
        ];
        break;

      // === Rusk Packaging Machines (from UniqPack rusk packaging page) ===
      case "4000 To 6000 Piece/Hour Automatic Rusk Packaging Machine":
        capacity = "4000 Piece/Hour";
        specs = {
          "Production Capacity": "4000 Piece/Hour",
          "Automatic Grade": "Automatic",
          Application: "Biscuit & Bakery product packaging machinery",
          Voltage: "240V",
          "Packaging Type": "Center sealing",
          "Machine Body": "Panel cover SS material / frame MS angle channel panel",
          Price: row.price,
        };
        features = [
          "Ultra-High Speed: Efficiently packages up to 4000 rusk pieces per hour, maximizing productivity for large-scale operations.",
          "Fully Automatic Functionality: Integrated feeding, wrapping, and sealing with minimal manual intervention.",
          "Precise and Clean Packaging: Delivers uniform, airtight packs to maintain freshness and extend shelf life.",
        ];
        break;

      case "2000 Piece/Hour Semi Automatic Rusk Packaging Machine":
        capacity = "2000 Piece/Hour";
        specs = {
          "Production Capacity": "2000 Piece/Hour",
          "Automatic Grade": "Semi-Automatic",
          Application: "Bakery",
          Voltage: "220V",
          Material: "SS",
          "Packaging Type": "Single",
          Price: row.price,
        };
        features = [
          "Moderate Output Capacity: Packs up to 2000 rusk pieces per hour, ideal for small to medium-sized production setups.",
          "Semi-Automatic Operation: Combines manual feeding with automated wrapping and sealing for cost-effective performance.",
          "Compact and Efficient Design: Space-saving machine with easy operation and maintenance.",
        ];
        break;

      case "4000 To 6000 Piece/Hour Family Pack Rusk Packaging Machine":
        capacity = "3000 Piece/Hour";
        specs = {
          "Sealing type": "Center seal",
          Speed: "80-120 pack/min",
          "Pack size range": "200-400 mm",
          "Production Capacity": "3000 Piece/Hour",
          "Packaging Type": "Single",
          "Machine type": "Horizontal flow",
          "Machine Body Material": "Mild Steel",
          "Film material": "Laminated film",
          "Usage/Application": "Bakery",
          Voltage: "240V",
          "Automation Grade": "Automatic",
          Weight: "1500kg",
          Price: row.price,
        };
        features = [
          "Automatic Feeding & Packing: Efficiently aligns, stacks, and packs rusks in family-size portions.",
          "Adjustable Pack Sizes: Flexible settings for different weights and quantities.",
          "High-Speed Performance: Ensures consistent, high-output packaging for bulk production.",
          "PLC Control with Touchscreen: Easy-to-use programmable system for accurate operation and monitoring.",
          "Multipack Capability: Supports pillow packs, tray packs, and brick-style packaging.",
        ];
        break;

      // === Automatic Soap Packaging Machine ===
      case "4000 To 6000 Pouch/Hour Automatic Soap Packaging Machine":
        // Use the more precise capacity from the product table
        capacity = "500 pouch/hour";
        specs = {
          Capacity: "500 pouch/hour",
          "Machine Type": "Automatic",
          Type: "Horizontal",
          Material: "Mild Steel",
          Application: "Industrial",
          "Driven Type": "Electric",
          Usage: "For Soap Packaging",
          Voltage: "220V",
          Price: row.price,
        };
        features = [
          "High-Speed Output: Efficiently packages up to 500 pouches per hour, ideal for medium to high-volume production.",
          "Fully Automatic Operation: Minimizes manual labor with automated feeding, wrapping, and sealing.",
          "Consistent Packaging Quality: Ensures uniform pouch size and sealing for a professional finish.",
        ];
        break;

      // === Food Packaging Machines (from UniqPack food packaging page) ===
      case "5000 To 6000 Piece/Hour Automatic Noodles Packaging Machine":
        capacity = "6000 Piece/Hour";
        specs = {
          Capacity: "180 Piece/Min",
          "Production Capacity": "6000 Piece/Hour",
          "Packaging Type": "Center Seal",
          Voltage: "220V",
          "Driven Type": "Electric",
          Weight: "1000 KG",
          "Automation Grade": "Semi-Automatic",
          Price: row.price,
        };
        features = [
          "Fully Automatic Operation: Seamlessly performs feeding, weighing, filling, and sealing processes.",
          "Supports Various Noodle Types: Suitable for instant, dry, or semi-dry noodles in brick, cup, or loose formats.",
          "High-Speed Packaging: Delivers consistent output with minimal human intervention.",
          "PLC Control with Touch Screen: Easy-to-use interface for real-time monitoring and settings adjustments.",
          "Adjustable Pack Size & Weight: Flexible to change pack dimensions and noodle quantities.",
        ];
        break;

      case "4000 To 6000Piece/Hour 4 Servo Cookies Packaging Machine":
        capacity = "4000 Piece/Hour";
        specs = {
          "Production Capacity": "4000 Piece/Hour",
          "Packaging Type": "Center Seal",
          "Automation Grade": "Automatic",
          Voltage: "220 V",
          Weight: "1000 KG",
          "Driven Type": "Electric",
          Price: row.price,
        };
        features = [
          "High-Speed Performance: Capable of packaging up to 4000 cookies per hour, ideal for high-volume production.",
          "4-Servo Motor System: Four independent servo motors for precise control, synchronization, and smooth operation.",
          "Accurate & Gentle Handling: Maintains consistent sealing and positioning while protecting delicate cookies from breakage.",
        ];
        break;

      case "4000 pouch per hour Automatic Cream Roll Packaging Machine":
        capacity = ">4000 pouch per hour";
        specs = {
          "Capacity (pouch per hour)": ">4000 pouch per hour",
          "Automation Grade": "Automatic",
          Voltage: "220 V",
          "Driven Type": "Electric",
          "Voltage(V)": "220 V",
          Weight: "1000 KG",
          "Packaging Type": "Center Seal",
          Price: row.price,
        };
        features = [
          "High-Efficiency Output: Packs up to 4000 cream roll pouches per hour, ideal for high-demand production lines.",
          "Fully Automatic Operation: Performs feeding, wrapping, and sealing with minimal human intervention.",
          "Delicate Product Handling: Designed to handle soft cream rolls carefully, preserving shape and quality during packaging.",
        ];
        break;

      case "5000 Piece/Hour Ice Cream Packaging Machine":
        capacity = "5000 Piece/Hour";
        specs = {
          Capacity: "5000 Piece/Hour",
          "Packaging Type": "Center Seal",
          "Automation Grade": "Automatic",
          Voltage: "220 voltage",
          "Driven Type": "Electric",
          Weight: "1000 KG",
          Price: row.price,
        };
        features = [
          "Automatic Operation: Streamlines the process of filling, sealing, and packaging ice cream products.",
          "Versatile Packaging Formats: Supports cups, cones, tubs, bars, and family packs.",
          "Precise Temperature Control: Maintains optimal conditions to prevent melting during packaging.",
          "PLC Control System with Touch Screen: User-friendly interface for real-time monitoring and easy setup.",
          "High-Speed Output: Ensures efficient, continuous packaging with consistent performance.",
        ];
        break;

      case "8000 Piece/Hour PLC Model Bun Paw  Packaging Machine":
        capacity = "8000 Piece/Hour";
        specs = {
          "Automation Level": "Manual",
          "Filling System": "Centre Filling",
          "Packing Range": "Weight does not matter",
          "Product Application": "Solid Items",
          "Packing Speed (PPM)": "60-100 PPM",
          "Material of Construction": "SS 304",
          "Pouch Style": "3-Side Seal Pouch",
          "Power Supply": "Three Phase",
          "Control System": "PLC Control",
          Price: row.price,
        };
        features = [
          "Ultra-High Speed Output: Efficiently packages up to 8000 bun paw pieces per hour, perfect for large-scale production.",
          "Advanced PLC Control: Programmable Logic Controller enables precise, automated control and smooth operation.",
          "Consistent and Hygienic Packaging: Ensures uniform pack quality with food-grade materials and minimal manual contact.",
        ];
        break;

      // === Bread Packing Machines (from UniqPack bread packing page) ===
      case "1000 Piece/Hour PLC Model Bread Packing Machine":
        capacity = "1000 Piece/Hour";
        specs = {
          "Production Capacity": "1000 Piece/Hour",
          "Surface Finish": "Polished",
          "Packaging Type": "Single",
          "Automation Grade": "Automatic",
          Voltage: "220 V",
          Brand: "Uniq Pack",
          Price: row.price,
        };
        features = [
          "High Capacity: Packs up to 1000 bread pieces per hour, ideal for commercial-scale bakeries.",
          "PLC Control System: Programmable Logic Controller provides precise, reliable, and automated operation.",
          "Accurate and Hygienic Packaging: Ensures consistent pack quality while maintaining food-grade hygiene standards.",
        ];
        break;
    }

    const slug = slugify(row.title);
    const category = inferCategory(row.title);
    let imageUrl: string;
    const localPath = path.join(IMAGES_DIR, row.local_image);
    if (row.local_image && existsSync(localPath)) {
      imageUrl = `/images/${row.local_image}`;
    } else {
      imageUrl = row.image_url || "/images/hero-machine-1.png";
    }
    insertProducts.push({
      name: row.title,
      slug,
      category,
      description: row.price ? `${row.title} - ${row.price}` : row.title,
      capacity,
      specs,
      features,
      imageUrl,
    });
  }

  await db.execute(sql`DELETE FROM inquiries`);
  await db.execute(sql`DELETE FROM products`);
  for (const p of insertProducts) {
    await db.insert(products).values(p);
  }
  console.log("Seeded", insertProducts.length, "products from products_final.csv");
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
