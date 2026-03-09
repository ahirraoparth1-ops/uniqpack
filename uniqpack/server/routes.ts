import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertInquirySchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get(api.products.getBySlug.path, async (req, res) => {
    const slug = Array.isArray(req.params.slug)
      ? req.params.slug[0]
      : req.params.slug;
    const product = await storage.getProductBySlug(slug);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  });

  app.post(api.inquiries.create.path, async (req, res) => {
    try {
      const input = api.inquiries.create.input.parse(req.body);
      const inquiry = await storage.createInquiry(input);
      res.status(201).json(inquiry);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed Data (from Unipack Machine Booklet)
  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    const bookletProducts = [
      {
        name: "Family Pack PLC Model",
        slug: "family-pack-plc-model",
        category: "Food Packaging",
        description: "3 Servo Standard Model for biscuits, rusk, khari. Auto or manual feeder with square or round shape support. Right angle feeding for single, two, or three rows.",
        capacity: "1 line: 100–120 P/M, 2 line: 50–60 P/M, 3 line: 25–35 P/M",
        specs: {
          "Model": "3 Servo Standard Model",
          "Feeder Type": "Auto Feeder / Manual",
          "Packing Products": "Biscuits, Rusk, Khari etc.",
          "Sealing Type": "Centre Seals",
          "Weight Capacity": "UPS 1000 wt."
        },
        features: ["Auto feeder systems", "Square or round shape", "On edge toast (rusk) support", "Right angle feeding"],
        imageUrl: "/images/family-pack-plc.png"
      },
      {
        name: "One Edge Biscuits Packing Machine",
        slug: "one-edge-biscuits-packing-machine",
        category: "Food Packaging",
        description: "Double Feedar Serve Model horizontal pillow pack machine. 3 Servo Standard. Packs biscuits of square or round shape.",
        capacity: "150 to 170 P/M (1 line)",
        specs: {
          "Model": "Double Feedar Serve Model",
          "Control": "3 Servo Standard Model",
          "Induction": "3+4+2 Induction",
          "Packing Products": "Biscuits",
          "Sealing Type": "Centre Seals",
          "Weight Capacity": "UPS 1000 wt."
        },
        features: ["Square or round biscuits", "Horizontal pillow pack", "Auto feeder systems", "High-speed output"],
        imageUrl: "/images/one-edge-biscuit-packing.png"
      },
      {
        name: "Right Angle Machine PLC Model",
        slug: "right-angle-machine-plc-model",
        category: "Bakery Packaging",
        description: "4 Servo Standard Model for bread and cream biscuits. Attachable bread slicer. Extra changeover for additional products.",
        capacity: "50 to 60 Pouches/Min",
        specs: {
          "Model": "PLC Model",
          "Attached Functionality": "Attach Bread Slicer",
          "Control": "4 Servo Standard Model",
          "Packing Products": "Bread, Cream Biscuits",
          "Sealing Type": "Centre Seals",
          "Weight Capacity": "UPS 1000 wt."
        },
        features: ["Bread slicer attachment", "Extra changeover for products", "PLC controlled", "Heavy-duty design"],
        imageUrl: "/images/right-angle-machine-plc.png"
      },
      {
        name: "Hotel Pack Manual PLC Model",
        slug: "hotel-pack-manual-plc-model",
        category: "Food Packaging",
        description: "3 Servo Standard Model with No Product No Bag system. For biscuits, rusk, khari. Centre seal packaging.",
        capacity: "100 to 120 P/M",
        specs: {
          "Model": "3 Servo Standard Model",
          "Feature": "No Product No Bag",
          "Packing Products": "Biscuits, Rusk, Khari etc.",
          "Sealing Type": "Centre Seals",
          "Weight Capacity": "UPS 1000 wt."
        },
        features: ["No Product No Bag system", "Manual PLC control", "Versatile product range", "Efficient operation"],
        imageUrl: "/images/hotel-pack-manual-plc.png"
      },
      {
        name: "Bottom Seal Flow Wrap Machine",
        slug: "bottom-seal-flow-wrap-machine",
        category: "Food Packaging",
        description: "3 Servo Standard Model for kulfi, chocobar and frozen products. No Product No Bag feature. Centre seals.",
        capacity: "100 to 120 P/M",
        specs: {
          "Model": "3 Servo Standard Model",
          "Feature": "No Product No Bag",
          "Packing Products": "Kulfi, Chocobar",
          "Sealing Type": "Centre Seals",
          "Weight Capacity": "UPS 1000 wt."
        },
        features: ["Kulfi & chocobar packaging", "No Product No Bag", "Frozen product capable", "Flow wrap design"],
        imageUrl: "/images/bottom-seal-flow-wrap.png"
      }
    ];

    for (const p of bookletProducts) {
      await storage.createProduct(p);
    }
  }

  return httpServer;
}
