export type Product = { id: string; name: string; brand: string; category: string; price: number; priceIsPlaceholder: boolean; original?: number; image: string; images: string[]; badge?: string; specs: Record<string,string>; description: string; stock: number | null; identification: string; detailsNote: string; sources: {title:string;url:string}[] }

// Prices are editable demo values requested by MGE, not researched selling prices.
// null stock means availability has not been supplied.
export const products: Product[] = [
  {
    "id": "hp-elitebook-silver",
    "name": "HP EliteBook · Silver",
    "brand": "HP",
    "category": "Laptops",
    "price": 275000,
    "description": "Silver HP EliteBook with a pointing stick and black keyboard The pictured unit is listed separately so MGE can confirm its exact configuration.",
    "specs": {
      "Design": "Silver HP EliteBook with a pointing stick and black keyboard",
      "Model": "Confirm with MGE",
      "Processor": "Confirm with MGE",
      "Memory": "Confirm with MGE",
      "Storage": "Confirm with MGE",
      "Condition": "Confirm with MGE"
    },
    "identification": "needs-model",
    "detailsNote": "The exact model and configuration cannot be established from this image. Confirm the model number, processor, RAM, storage, display, and condition with MGE.",
    "image": "/products/hp-elitebook-silver.png",
    "images": [
      "/products/hp-elitebook-silver.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "sources": []
  },
  {
    "id": "oraimo-powernova-b31",
    "name": "oraimo PowerNova B31 · 30,000mAh",
    "brand": "oraimo",
    "category": "Charging",
    "price": 32000,
    "description": "A high-capacity power bank with USB-A and USB-C charging connections.",
    "specs": {
      "Model": "PowerNova B31",
      "Capacity": "30,000mAh / 111Wh",
      "Output": "15W maximum total",
      "Ports": "Two USB-A outputs; USB-C input/output; Micro-USB input"
    },
    "identification": "model-reference",
    "sources": [
      {
        "title": "oraimo PowerNova B31 specifications",
        "url": "https://www.oraimo.com/en/product/15w-type-c-fast-charging-powernova-b31"
      }
    ],
    "detailsNote": "Specifications reference the PowerNova B31 model. Confirm the supplied unit and included cable with MGE.",
    "image": "/products/oraimo-powernova-b31.png",
    "images": [
      "/products/oraimo-powernova-b31.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true
  },
  {
    "id": "bose-quietcomfort-ultra",
    "name": "Bose QuietComfort Ultra Headphones",
    "brand": "Bose",
    "category": "Audio",
    "price": 420000,
    "description": "Over-ear headphones pictured with a carrying case and cables. Confirm the generation before comparing battery or connectivity specifications.",
    "specs": {
      "Design": "Over-ear",
      "Color": "Black",
      "Generation": "Confirm with MGE",
      "Accessories": "Case and cables pictured"
    },
    "detailsNote": "The packaging identifies QuietComfort Ultra, but the generation is not established. Generation-specific battery and Bluetooth claims have been omitted.",
    "sources": [
      {
        "title": "Bose QuietComfort Ultra reference",
        "url": "https://www.bose.com/pressroom/bose-announces-new-quietcomfort-ultra-headphones-and-earbuds"
      }
    ],
    "image": "/products/bose-quietcomfort-ultra.png",
    "images": [
      "/products/bose-quietcomfort-ultra.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging"
  },
  {
    "id": "aimb-g2-pro-glasses",
    "name": "AIMB-G2 Pro AI Glasses",
    "brand": "Unbranded",
    "category": "Wearables",
    "price": 95000,
    "description": "Black smart glasses with a camera module. The packaging advertises image recognition and translation; confirm the companion app and supported languages.",
    "specs": {
      "Model": "AIMB-G2 Pro (packaging)",
      "Camera": "8MP (packaging claim)",
      "Video": "1080p at 30fps (packaging claim)",
      "Connection": "Wi-Fi (packaging)",
      "Lenses": "Three sets advertised"
    },
    "detailsNote": "Specifications are transcribed from the supplied packaging only. No manufacturer specification sheet was found to verify camera resolution, app functionality, translation support, or included lenses.",
    "image": "/products/aimb-g2-pro-glasses.png",
    "images": [
      "/products/aimb-g2-pro-glasses.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "sources": []
  },
  {
    "id": "baseus-usb-a-usb-c-2m",
    "name": "Baseus USB-A to USB-C Cable · 2 m",
    "brand": "Baseus",
    "category": "Charging",
    "price": 6500,
    "description": "A braided cable for charging USB-C devices from a USB-A charger or computer.",
    "specs": {
      "Connection": "USB-A to USB-C",
      "Length": "2 m (packaging)",
      "Finish": "Black braided cable"
    },
    "image": "/products/baseus-usb-a-usb-c-2m.png",
    "images": [
      "/products/baseus-usb-a-usb-c-2m.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "feudz-type-c-earphones",
    "name": "Feudz USB-C Wired Earphones",
    "brand": "Feudz",
    "category": "Audio",
    "price": 6500,
    "description": "White wired earphones with a USB-C connector for compatible devices.",
    "specs": {
      "Connection": "USB-C",
      "Style": "Wired earbuds",
      "Color": "White"
    },
    "image": "/products/feudz-type-c-earphones.png",
    "images": [
      "/products/feudz-type-c-earphones.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "live-85nc-headphones",
    "name": "LIVE 85NC Wireless Headphones",
    "brand": "JBL (packaging)",
    "category": "Audio",
    "price": 35000,
    "description": "Cream over-ear headphones shown in LIVE 85NC packaging. The two supplied images are grouped here for comparison.",
    "specs": {
      "Model": "LIVE 85NC (packaging)",
      "Design": "Over-ear",
      "Color": "Cream",
      "Connection": "Wireless / AUX (packaging)"
    },
    "identification": "needs-model",
    "detailsNote": "This model label could not be matched to an official JBL product page. Brand, model, and performance claims require confirmation; specifications from other JBL models have not been substituted.",
    "image": "/products/live-85nc-headphones.png",
    "images": [
      "/products/live-85nc-headphones.png",
      "/products/live-85nc-headphones-2.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "sources": []
  },
  {
    "id": "hp-deskjet-1115",
    "name": "HP DeskJet Ink Advantage 1115",
    "brand": "HP",
    "category": "Office",
    "price": 85000,
    "description": "A compact colour inkjet printer for everyday documents, connected to a computer over USB.",
    "specs": {
      "Function": "Print",
      "Technology": "Thermal inkjet",
      "Connection": "Hi-Speed USB 2.0",
      "Duplex": "Manual",
      "Wireless": "No Wi-Fi"
    },
    "identification": "model-reference",
    "sources": [
      {
        "title": "HP product specifications",
        "url": "https://support.hp.com/us-en/product/product-specs/hp/7174540"
      }
    ],
    "detailsNote": "HP specifications describe the identified model. Cartridge region, included accessories, condition, and warranty must be confirmed for the stocked unit.",
    "image": "/products/hp-deskjet-1115.png",
    "images": [
      "/products/hp-deskjet-1115.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true
  },
  {
    "id": "hp-convertible-black",
    "name": "HP Convertible Laptop · Black",
    "brand": "HP",
    "category": "Laptops",
    "price": 165000,
    "description": "Compact black laptop with a folding convertible hinge The pictured unit is listed separately so MGE can confirm its exact configuration.",
    "specs": {
      "Design": "Compact black laptop with a folding convertible hinge",
      "Model": "Confirm with MGE",
      "Processor": "Confirm with MGE",
      "Memory": "Confirm with MGE",
      "Storage": "Confirm with MGE",
      "Condition": "Confirm with MGE"
    },
    "identification": "needs-model",
    "detailsNote": "The exact model and configuration cannot be established from this image. Confirm the model number, processor, RAM, storage, display, and condition with MGE.",
    "image": "/products/hp-convertible-black.png",
    "images": [
      "/products/hp-convertible-black.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "sources": []
  },
  {
    "id": "xj08-handheld-fan",
    "name": "XJ08 Rechargeable Handheld Fan",
    "brand": "Unbranded",
    "category": "Accessories",
    "price": 12000,
    "description": "A compact handheld fan with a display, wrist strap, and charging cable pictured.",
    "specs": {
      "Model": "XJ08 (packaging)",
      "Color": "Cream",
      "Design": "Handheld",
      "Power": "Rechargeable; capacity to confirm"
    },
    "image": "/products/xj08-handheld-fan.png",
    "images": [
      "/products/xj08-handheld-fan.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "apple-magsafe-charger",
    "name": "Apple MagSafe Charger",
    "brand": "Apple",
    "category": "Charging",
    "price": 45000,
    "description": "A circular magnetic charging puck with a USB-C lead for compatible devices. The generation and power rating need confirmation.",
    "specs": {
      "Connection": "USB-C",
      "Design": "Magnetic charging puck",
      "Color": "White / silver",
      "Generation": "Confirm with MGE"
    },
    "sources": [
      {
        "title": "Apple MagSafe charging guide",
        "url": "https://support.apple.com/en-ie/105047"
      }
    ],
    "detailsNote": "MagSafe charging power depends on charger generation, power adapter, and phone. The supplied image does not establish the generation or cable length.",
    "image": "/products/apple-magsafe-charger.png",
    "images": [
      "/products/apple-magsafe-charger.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging"
  },
  {
    "id": "mj30-ring-light",
    "name": "MJ-30 RGB Ring Light · 12 inch",
    "brand": "Unbranded",
    "category": "Lighting",
    "price": 22000,
    "description": "A compact RGB ring-light kit pictured with a tripod and central phone holder.",
    "specs": {
      "Model": "MJ-30",
      "Diameter": "12 inch (packaging)",
      "Lighting": "RGB",
      "Accessories": "Tripod, phone holder, inline control pictured"
    },
    "image": "/products/mj30-ring-light.png",
    "images": [
      "/products/mj30-ring-light.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "beats-studio-pro-kim",
    "name": "Beats Studio Pro × Kim",
    "brand": "Beats",
    "category": "Audio",
    "price": 350000,
    "description": "The Beats × Kim edition of Studio Pro, shown in its sealed retail box. Confirm the colour with MGE.",
    "specs": {
      "Design": "Over-ear",
      "Listening": "ANC and Transparency modes",
      "Connection": "Bluetooth, USB-C audio, 3.5 mm",
      "Battery": "Up to 40 hours with ANC off; 24 hours with ANC on",
      "Color": "Confirm with MGE"
    },
    "identification": "model-reference",
    "sources": [
      {
        "title": "Beats Studio Pro specifications",
        "url": "https://www.beatsbydre.com/headphones/studio-pro-wireless?pp=1"
      }
    ],
    "detailsNote": "Technical details describe the Studio Pro model family. The supplied box identifies the Kim edition; colour, authenticity, and contents are not established by a sealed-box image.",
    "image": "/products/beats-studio-pro-kim.png",
    "images": [
      "/products/beats-studio-pro-kim.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true
  },
  {
    "id": "dualshock-3-black",
    "name": "Sony DUALSHOCK 3 Controller",
    "brand": "Sony",
    "category": "Gaming",
    "price": 15000,
    "description": "A black PlayStation 3 wireless controller with two analogue sticks, shown in DUALSHOCK 3 packaging.",
    "specs": {
      "Platform": "PlayStation 3",
      "Color": "Black",
      "Controls": "Dual analogue sticks",
      "Model": "DUALSHOCK 3 (packaging)"
    },
    "image": "/products/dualshock-3-black.png",
    "images": [
      "/products/dualshock-3-black.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "35w-charger-lightning-bundle",
    "name": "35W Charger & Lightning Cable Kit",
    "brand": "Unconfirmed",
    "category": "Charging",
    "price": 12500,
    "description": "A charging-adapter and USB-C to Lightning cable bundle. The 35W rating is a packaging claim awaiting confirmation.",
    "specs": {
      "Package": "Adapter and cable pictured",
      "Cable": "USB-C to Lightning",
      "Rating": "35W (packaging claim)",
      "Color": "White"
    },
    "identification": "needs-model",
    "detailsNote": "The box uses Apple-style branding and an iPhone name, but this bundle has not been matched to an official Apple SKU. Confirm manufacturer, connector compatibility, and actual output.",
    "image": "/products/35w-charger-lightning-bundle.png",
    "images": [
      "/products/35w-charger-lightning-bundle.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "sources": []
  },
  {
    "id": "hp-business-black-silver",
    "name": "HP Business Laptop · Black & Silver",
    "brand": "HP",
    "category": "Laptops",
    "price": 185000,
    "description": "Black-lid HP laptop with a silver keyboard deck and charger pictured The pictured unit is listed separately so MGE can confirm its exact configuration.",
    "specs": {
      "Design": "Black-lid HP laptop with a silver keyboard deck and charger pictured",
      "Model": "Confirm with MGE",
      "Processor": "Confirm with MGE",
      "Memory": "Confirm with MGE",
      "Storage": "Confirm with MGE",
      "Condition": "Confirm with MGE"
    },
    "identification": "needs-model",
    "detailsNote": "The exact model and configuration cannot be established from this image. Confirm the model number, processor, RAM, storage, display, and condition with MGE.",
    "image": "/products/hp-business-black-silver.png",
    "images": [
      "/products/hp-business-black-silver.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "sources": []
  },
  {
    "id": "f11-2-wireless-microphones",
    "name": "F11-2 Wireless Microphone Kit",
    "brand": "Unbranded",
    "category": "Audio",
    "price": 25000,
    "description": "A two-microphone recording kit with clip-on transmitters, wind covers, and a receiver pictured.",
    "specs": {
      "Model": "F11-2",
      "Microphones": "Two transmitters pictured",
      "Design": "Clip-on wireless kit",
      "Compatibility": "Confirm receiver connector and device support"
    },
    "image": "/products/f11-2-wireless-microphones.png",
    "images": [
      "/products/f11-2-wireless-microphones.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "shplus-usb-a-charger",
    "name": "SHPLUS USB-A Charger · 20W Label",
    "brand": "SHPLUS",
    "category": "Charging",
    "price": 4500,
    "description": "A compact white wall adapter with one USB-A output.",
    "specs": {
      "Port": "USB-A",
      "Color": "White",
      "Rating": "20W (packaging claim)",
      "Plug": "Two flat pins pictured"
    },
    "image": "/products/shplus-usb-a-charger.png",
    "images": [
      "/products/shplus-usb-a-charger.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "white-wired-earphones",
    "name": "White Wired Earphones",
    "brand": "Unbranded",
    "category": "Audio",
    "price": 3500,
    "description": "White wired earbuds in a compact clear storage case.",
    "specs": {
      "Style": "Wired earbuds",
      "Color": "White",
      "Case": "Clear storage case pictured",
      "Connector": "Confirm with MGE"
    },
    "image": "/products/white-wired-earphones.png",
    "images": [
      "/products/white-wired-earphones.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "textured-phone-case-black",
    "name": "Textured Phone Case · Black",
    "brand": "Unbranded",
    "category": "Accessories",
    "price": 5500,
    "description": "A black phone case with a textured back and camera opening.",
    "specs": {
      "Color": "Black",
      "Design": "Textured back",
      "Fit": "Confirm exact phone model before purchase"
    },
    "image": "/products/textured-phone-case-black.png",
    "images": [
      "/products/textured-phone-case-black.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "textured-phone-case-brown",
    "name": "Textured Phone Case · Brown",
    "brand": "Unbranded",
    "category": "Accessories",
    "price": 5500,
    "description": "A brown phone case with a textured lower panel and raised camera opening.",
    "specs": {
      "Color": "Brown",
      "Design": "Two-texture back",
      "Fit": "Confirm exact phone model before purchase"
    },
    "image": "/products/textured-phone-case-brown.png",
    "images": [
      "/products/textured-phone-case-brown.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "polymer-powerbank-33000",
    "name": "33,000mAh Power Bank · 22.5W Label",
    "brand": "Unconfirmed",
    "category": "Charging",
    "price": 28000,
    "description": "A black power bank with an integrated light and charging cable pictured. Capacity and output are taken from the box.",
    "specs": {
      "Capacity": "33,000mAh (packaging claim)",
      "Output": "22.5W (packaging claim)",
      "Color": "Black",
      "Accessories": "USB charging cable pictured"
    },
    "image": "/products/polymer-powerbank-33000.png",
    "images": [
      "/products/polymer-powerbank-33000.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "17-pro-max-usbc-earphones",
    "name": "17 Pro Max USB-C Earphones",
    "brand": "Unbranded",
    "category": "Audio",
    "price": 7500,
    "description": "White wired earphones with inline controls and a USB-C connector. “17 Pro Max” is the packaging label, not a verified phone compatibility guarantee.",
    "specs": {
      "Connection": "USB-C",
      "Color": "White",
      "Controls": "Inline control pictured",
      "Compatibility": "Confirm with MGE"
    },
    "image": "/products/17-pro-max-usbc-earphones.png",
    "images": [
      "/products/17-pro-max-usbc-earphones.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "p9-headphones-blue",
    "name": "P9 Wireless Headphones · Blue",
    "brand": "Unbranded",
    "category": "Audio",
    "price": 15000,
    "description": "Blue over-ear wireless headphones with a padded headband and ear cushions.",
    "specs": {
      "Model": "P9 (packaging)",
      "Color": "Blue",
      "Design": "Over-ear",
      "Connection": "Wireless (packaging)"
    },
    "image": "/products/p9-headphones-blue.png",
    "images": [
      "/products/p9-headphones-blue.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "shplus-lightning-cable",
    "name": "SHPLUS USB-C to Lightning Cable",
    "brand": "SHPLUS",
    "category": "Charging",
    "price": 6500,
    "description": "A mint-coloured braided charging cable for devices with a Lightning port.",
    "specs": {
      "Connection": "USB-C to Lightning",
      "Color": "Mint",
      "Finish": "Braided",
      "Rating": "60W printed on box; unverified"
    },
    "detailsNote": "The 60W and MFi markings are packaging claims, not independently verified certification or delivered charging power. Confirm compatibility and rating with MGE.",
    "image": "/products/shplus-lightning-cable.png",
    "images": [
      "/products/shplus-lightning-cable.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "sources": []
  },
  {
    "id": "zealot-p15",
    "name": "ZEALOT P15 Wireless Speaker",
    "brand": "ZEALOT",
    "category": "Audio",
    "price": 38000,
    "description": "A portable cylindrical speaker with a carrying loop and illuminated end rings pictured.",
    "specs": {
      "Model": "P15 (packaging)",
      "Design": "Portable cylindrical speaker",
      "Color": "Black",
      "Lighting": "Coloured end rings pictured"
    },
    "image": "/products/zealot-p15.png",
    "images": [
      "/products/zealot-p15.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "baseus-usbc-usbc-2m",
    "name": "Baseus USB-C to USB-C Cable · 2 m",
    "brand": "Baseus",
    "category": "Charging",
    "price": 8500,
    "description": "A black braided USB-C cable for compatible chargers and devices.",
    "specs": {
      "Connection": "USB-C to USB-C",
      "Length": "2 m (packaging)",
      "Finish": "Black braided cable",
      "Power": "Confirm cable rating"
    },
    "image": "/products/baseus-usbc-usbc-2m.png",
    "images": [
      "/products/baseus-usbc-usbc-2m.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "hp-silver-business-notebook",
    "name": "HP Business Notebook · Silver",
    "brand": "HP",
    "category": "Laptops",
    "price": 320000,
    "description": "Silver HP notebook with a black keyboard and modern HP lid logo The pictured unit is listed separately so MGE can confirm its exact configuration.",
    "specs": {
      "Design": "Silver HP notebook with a black keyboard and modern HP lid logo",
      "Model": "Confirm with MGE",
      "Processor": "Confirm with MGE",
      "Memory": "Confirm with MGE",
      "Storage": "Confirm with MGE",
      "Condition": "Confirm with MGE"
    },
    "identification": "needs-model",
    "detailsNote": "The exact model and configuration cannot be established from this image. Confirm the model number, processor, RAM, storage, display, and condition with MGE.",
    "image": "/products/hp-silver-business-notebook.png",
    "images": [
      "/products/hp-silver-business-notebook.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "sources": []
  },
  {
    "id": "hp-wm168-mouse",
    "name": "HP WM168 Wireless Mouse",
    "brand": "HP (packaging)",
    "category": "Accessories",
    "price": 9500,
    "description": "A black wireless mouse with an illuminated edge and USB receiver pictured.",
    "specs": {
      "Model": "WM168 (packaging)",
      "Connection": "USB wireless receiver pictured",
      "Color": "Black",
      "Lighting": "Multicolour edge lighting pictured"
    },
    "image": "/products/hp-wm168-mouse.png",
    "images": [
      "/products/hp-wm168-mouse.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "pro-led-600-panel",
    "name": "Pro LED 600 Video Light Kit",
    "brand": "Unbranded",
    "category": "Lighting",
    "price": 55000,
    "description": "A rectangular video-light panel with barn doors, power adapter, and mounting accessories pictured.",
    "specs": {
      "Model": "Pro LED 600 (packaging)",
      "Design": "LED panel with barn doors",
      "Temperature": "3200–6500K (packaging)",
      "Use": "Photo and video lighting"
    },
    "image": "/products/pro-led-600-panel.png",
    "images": [
      "/products/pro-led-600-panel.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "feudz-120w-adapter",
    "name": "Feudz USB-C Adapter · 120W Label",
    "brand": "Feudz",
    "category": "Charging",
    "price": 12000,
    "description": "A compact white USB-C adapter. The printed 120W rating needs confirmation before use with higher-power equipment.",
    "specs": {
      "Connection": "USB-C",
      "Rating": "120W (packaging claim)",
      "Color": "White",
      "Plug": "Two flat pins pictured"
    },
    "image": "/products/feudz-120w-adapter.png",
    "images": [
      "/products/feudz-120w-adapter.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "dell-convertible-silver",
    "name": "Dell Convertible Laptop · Silver",
    "brand": "Dell",
    "category": "Laptops",
    "price": 250000,
    "description": "Silver Dell convertible pictured in laptop, tent, and tablet positions The pictured unit is listed separately so MGE can confirm its exact configuration.",
    "specs": {
      "Design": "Silver Dell convertible pictured in laptop, tent, and tablet positions",
      "Model": "Confirm with MGE",
      "Processor": "Confirm with MGE",
      "Memory": "Confirm with MGE",
      "Storage": "Confirm with MGE",
      "Condition": "Confirm with MGE"
    },
    "identification": "needs-model",
    "detailsNote": "The exact model and configuration cannot be established from this image. Confirm the model number, processor, RAM, storage, display, and condition with MGE.",
    "image": "/products/dell-convertible-silver.png",
    "images": [
      "/products/dell-convertible-silver.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "sources": []
  },
  {
    "id": "rgb-ring-light-18",
    "name": "RGB Ring Light · 18 inch",
    "brand": "Unbranded",
    "category": "Lighting",
    "price": 38000,
    "description": "An RGB ring-light kit with a tripod and multiple phone holders pictured.",
    "specs": {
      "Diameter": "18 inch / 45 cm (packaging)",
      "Lighting": "RGB",
      "Mount": "Tripod pictured",
      "Accessories": "Phone holders and inline control pictured"
    },
    "image": "/products/rgb-ring-light-18.png",
    "images": [
      "/products/rgb-ring-light-18.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "k11-wireless-earbuds",
    "name": "K11 Wireless Earbuds",
    "brand": "JBL (packaging)",
    "category": "Audio",
    "price": 18000,
    "description": "Black earbuds with a compact charging case in K11-labelled packaging.",
    "specs": {
      "Model": "K11 (packaging)",
      "Color": "Black",
      "Design": "In-ear buds with charging case",
      "Connection": "Wireless (packaging)"
    },
    "identification": "needs-model",
    "detailsNote": "K11 could not be matched to an official JBL product page. Model, brand, battery, and noise-cancellation claims need confirmation.",
    "image": "/products/k11-wireless-earbuds.png",
    "images": [
      "/products/k11-wireless-earbuds.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "sources": []
  },
  {
    "id": "smart-glasses-black",
    "name": "Smart Glasses · Black",
    "brand": "Unbranded",
    "category": "Wearables",
    "price": 65000,
    "description": "Black-framed smart glasses pictured with a camera module. Confirm the exact model and supported phone app.",
    "specs": {
      "Frame": "Black",
      "Camera": "Camera module pictured",
      "Model": "Confirm with MGE",
      "App": "Confirm with MGE"
    },
    "identification": "needs-model",
    "image": "/products/smart-glasses-black.png",
    "images": [
      "/products/smart-glasses-black.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "dualshock-4-blue",
    "name": "Sony DUALSHOCK 4 Controller · Blue",
    "brand": "Sony",
    "category": "Gaming",
    "price": 28000,
    "description": "A blue PlayStation 4 controller with a touch pad, dual analogue sticks, and wireless play.",
    "specs": {
      "Platform": "PlayStation 4",
      "Color": "Blue",
      "Controls": "Touch pad and dual analogue sticks",
      "Audio": "3.5 mm headset jack",
      "Charging": "USB"
    },
    "identification": "model-reference",
    "sources": [
      {
        "title": "PlayStation DUALSHOCK 4 features",
        "url": "https://www.playstation.com/en-us/accessories/dualshock-4-wireless-controller/"
      }
    ],
    "detailsNote": "Features describe the DUALSHOCK 4 family. Confirm the controller revision and condition with MGE.",
    "image": "/products/dualshock-4-blue.png",
    "images": [
      "/products/dualshock-4-blue.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true
  },
  {
    "id": "phone-case-orange",
    "name": "Phone Case · Orange",
    "brand": "Unbranded",
    "category": "Accessories",
    "price": 4500,
    "description": "A bright orange phone case with a smooth back and shaped camera cutout.",
    "specs": {
      "Color": "Orange",
      "Design": "Smooth back",
      "Fit": "Confirm exact phone model before purchase"
    },
    "image": "/products/phone-case-orange.png",
    "images": [
      "/products/phone-case-orange.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "r1s-selfie-stick",
    "name": "R1S Bluetooth Selfie Stick",
    "brand": "Unbranded",
    "category": "Accessories",
    "price": 8500,
    "description": "An extendable phone holder pictured with a detachable remote and adjustable mount.",
    "specs": {
      "Model": "R1S (packaging)",
      "Mount": "Rotating phone clamp",
      "Remote": "Bluetooth remote pictured",
      "Design": "Extendable stick"
    },
    "image": "/products/r1s-selfie-stick.png",
    "images": [
      "/products/r1s-selfie-stick.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "zealot-s97",
    "name": "ZEALOT S97 Wireless Speaker",
    "brand": "ZEALOT",
    "category": "Audio",
    "price": 110000,
    "description": "A portable wireless speaker with a carry handle and illuminated ends.",
    "specs": {
      "Model": "S97",
      "Design": "Portable speaker with handle",
      "Color": "Black",
      "Output": "80W model reference"
    },
    "sources": [
      {
        "title": "ZEALOT S97 model reference",
        "url": "https://www.zealot-speaker.com/product/s97/"
      }
    ],
    "detailsNote": "The model reference lists 80W, but its battery-runtime and weight figures conflict internally. Those claims have been omitted; confirm the exact unit and ratings with MGE.",
    "image": "/products/zealot-s97.png",
    "images": [
      "/products/zealot-s97.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging"
  },
  {
    "id": "dell-business-silver",
    "name": "Dell Business Laptop · Silver",
    "brand": "Dell",
    "category": "Laptops",
    "price": 210000,
    "description": "Silver Dell business laptop with a black keyboard and charger pictured The pictured unit is listed separately so MGE can confirm its exact configuration.",
    "specs": {
      "Design": "Silver Dell business laptop with a black keyboard and charger pictured",
      "Model": "Confirm with MGE",
      "Processor": "Confirm with MGE",
      "Memory": "Confirm with MGE",
      "Storage": "Confirm with MGE",
      "Condition": "Confirm with MGE"
    },
    "identification": "needs-model",
    "detailsNote": "The exact model and configuration cannot be established from this image. Confirm the model number, processor, RAM, storage, display, and condition with MGE.",
    "image": "/products/dell-business-silver.png",
    "images": [
      "/products/dell-business-silver.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "sources": []
  },
  {
    "id": "mj36-ring-light",
    "name": "MJ-36 RGB Ring Light · 14 inch",
    "brand": "Unbranded",
    "category": "Lighting",
    "price": 28000,
    "description": "An RGB ring-light kit pictured with tripod, phone holder, and inline controls.",
    "specs": {
      "Model": "MJ-36",
      "Diameter": "14 inch (packaging)",
      "Lighting": "RGB",
      "Mount": "Tripod pictured"
    },
    "image": "/products/mj36-ring-light.png",
    "images": [
      "/products/mj36-ring-light.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "rgb-ring-light-22",
    "name": "RGB Ring Light · 22 inch",
    "brand": "Unbranded",
    "category": "Lighting",
    "price": 48000,
    "description": "A large RGB ring-light kit for phone-based recording setups.",
    "specs": {
      "Diameter": "22 inch / 56 cm (packaging)",
      "Lighting": "RGB",
      "Accessories": "Tripod and phone holders pictured"
    },
    "image": "/products/rgb-ring-light-22.png",
    "images": [
      "/products/rgb-ring-light-22.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "c12-tracking-selfie-stick",
    "name": "C12 Tracking Selfie Stick",
    "brand": "Unbranded",
    "category": "Accessories",
    "price": 18000,
    "description": "A folding phone tripod and extendable stick with tracking advertised on the box.",
    "specs": {
      "Model": "C12",
      "Height": "1.8 m (packaging)",
      "Mount": "Phone clamp",
      "Remote": "Detachable remote pictured",
      "Tracking": "AI tracking advertised; confirm functionality"
    },
    "image": "/products/c12-tracking-selfie-stick.png",
    "images": [
      "/products/c12-tracking-selfie-stick.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "jamax-maxpura-6",
    "name": "JAMAX MaxPura 6 Earbuds",
    "brand": "JAMAX",
    "category": "Audio",
    "price": 18000,
    "description": "Black in-ear wireless earbuds with charging case, spare tips, and a cable pictured.",
    "specs": {
      "Model": "MaxPura 6",
      "Color": "Black",
      "Design": "In-ear",
      "Accessories": "Charging case, tips, cable pictured"
    },
    "image": "/products/jamax-maxpura-6.png",
    "images": [
      "/products/jamax-maxpura-6.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "phone-case-diagonal-black",
    "name": "Phone Case · Black Diagonal",
    "brand": "Unbranded",
    "category": "Accessories",
    "price": 5500,
    "description": "A black phone case with a contrasting diagonal panel and square camera opening.",
    "specs": {
      "Color": "Black / grey",
      "Design": "Diagonal back panel",
      "Fit": "Confirm exact phone model before purchase"
    },
    "image": "/products/phone-case-diagonal-black.png",
    "images": [
      "/products/phone-case-diagonal-black.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "oraimo-powernova-q41",
    "name": "oraimo PowerNova Q41 · 40,000mAh",
    "brand": "oraimo",
    "category": "Charging",
    "price": 48000,
    "description": "A large-capacity power bank with a digital charge display and multiple USB outputs.",
    "specs": {
      "Model": "OPB-7401Q / PowerNova Q41",
      "Capacity": "40,000mAh / 148Wh",
      "Display": "Digital battery indicator",
      "Input": "Up to 35W combined USB-C input",
      "Output": "Up to 22.5W on USB-C1; total output listed as 30W"
    },
    "identification": "model-reference",
    "sources": [
      {
        "title": "oraimo PowerNova Q41 specifications",
        "url": "https://www.oraimo.com/en/product/35w-ultra-fast-charging-powernova-q41"
      }
    ],
    "detailsNote": "The supplied box reads G41, while its OPB-7401Q code matches oraimo PowerNova Q41. The advertised 35W refers to combined input, not a guaranteed 35W single-port output. Confirm the SKU with MGE.",
    "image": "/products/oraimo-powernova-q41.png",
    "images": [
      "/products/oraimo-powernova-q41.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true
  },
  {
    "id": "zealot-wireless-speaker",
    "name": "ZEALOT Wireless Speaker · Black",
    "brand": "ZEALOT",
    "category": "Audio",
    "price": 42000,
    "description": "A black cylindrical portable speaker with illuminated end rings. No model number is readable in the supplied image.",
    "specs": {
      "Design": "Portable cylindrical speaker",
      "Color": "Black",
      "Lighting": "Coloured end rings pictured",
      "Model": "Confirm with MGE"
    },
    "identification": "needs-model",
    "image": "/products/zealot-wireless-speaker.png",
    "images": [
      "/products/zealot-wireless-speaker.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "itel-budsair-pro",
    "name": "itel BudsAir Pro",
    "brand": "itel",
    "category": "Audio",
    "price": 22000,
    "description": "Compact black wireless earbuds with a pocket-sized charging case.",
    "specs": {
      "Model": "BudsAir Pro",
      "Color": "Black",
      "Design": "Wireless in-ear earbuds",
      "Case": "Charging case pictured"
    },
    "identification": "model-reference",
    "sources": [
      {
        "title": "itel BudsAir Pro product reference",
        "url": "https://www.itel-life.com/ng/audio/tws/budsair-pro"
      }
    ],
    "detailsNote": "Model identity is supported by itel’s product listing. Battery life and other performance claims are not supplied because the available specification text did not establish them.",
    "image": "/products/itel-budsair-pro.png",
    "images": [
      "/products/itel-budsair-pro.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true
  },
  {
    "id": "hp-slim-silver-notebook",
    "name": "HP Slim Notebook · Silver",
    "brand": "HP",
    "category": "Laptops",
    "price": 350000,
    "description": "Silver HP notebook with a slim display bezel and black keyboard The pictured unit is listed separately so MGE can confirm its exact configuration.",
    "specs": {
      "Design": "Silver HP notebook with a slim display bezel and black keyboard",
      "Model": "Confirm with MGE",
      "Processor": "Confirm with MGE",
      "Memory": "Confirm with MGE",
      "Storage": "Confirm with MGE",
      "Condition": "Confirm with MGE"
    },
    "identification": "needs-model",
    "detailsNote": "The exact model and configuration cannot be established from this image. Confirm the model number, processor, RAM, storage, display, and condition with MGE.",
    "image": "/products/hp-slim-silver-notebook.png",
    "images": [
      "/products/hp-slim-silver-notebook.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "sources": []
  },
  {
    "id": "white-wireless-earbuds-anc-label",
    "name": "White Wireless Earbuds · ANC Label",
    "brand": "Unconfirmed",
    "category": "Audio",
    "price": 18000,
    "description": "White open-fit wireless earbuds pictured with a charging case and an ANC-marked box.",
    "specs": {
      "Color": "White",
      "Design": "Open-fit wireless earbuds",
      "Case": "Charging case pictured",
      "Model": "Confirm with MGE"
    },
    "identification": "needs-model",
    "detailsNote": "The image does not establish an Apple model or generation. The Redington and ANC markings are unverified packaging claims; this listing is not identified as AirPods.",
    "image": "/products/white-wireless-earbuds-anc-label.png",
    "images": [
      "/products/white-wireless-earbuds-anc-label.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "sources": []
  },
  {
    "id": "textured-phone-case-grey",
    "name": "Textured Phone Case · Grey",
    "brand": "Unbranded",
    "category": "Accessories",
    "price": 5500,
    "description": "A grey phone case with a textured lower panel and camera opening.",
    "specs": {
      "Color": "Grey",
      "Design": "Textured back",
      "Fit": "Confirm exact phone model before purchase"
    },
    "image": "/products/textured-phone-case-grey.png",
    "images": [
      "/products/textured-phone-case-grey.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "playstation-3-250gb",
    "name": "Sony PlayStation 3 · 250GB Label",
    "brand": "Sony",
    "category": "Gaming",
    "price": 140000,
    "description": "A black PlayStation 3 console pictured with two controllers and cables. Confirm the console revision, actual storage, and bundle contents.",
    "specs": {
      "Platform": "PlayStation 3",
      "Storage": "250GB (packaging; verify installed drive)",
      "Color": "Black",
      "Bundle": "Two controllers and cables pictured",
      "Condition": "Confirm with MGE"
    },
    "image": "/products/playstation-3-250gb.png",
    "images": [
      "/products/playstation-3-250gb.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "jamax-white-earbuds",
    "name": "JAMAX Wireless Earbuds · White",
    "brand": "JAMAX",
    "category": "Audio",
    "price": 15000,
    "description": "White in-ear wireless earbuds with charging case and spare ear tips pictured.",
    "specs": {
      "Color": "White",
      "Design": "In-ear wireless earbuds",
      "Accessories": "Charging case and ear tips pictured",
      "Model": "Confirm with MGE"
    },
    "image": "/products/jamax-white-earbuds.png",
    "images": [
      "/products/jamax-white-earbuds.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "vl160bd-phone-light",
    "name": "VL-160BD Phone LED Light",
    "brand": "Unbranded",
    "category": "Lighting",
    "price": 12000,
    "description": "A small rectangular light pictured with a clip mount and USB charging cable.",
    "specs": {
      "Model": "VL-160BD (packaging)",
      "Design": "Rectangular LED light",
      "Mount": "Clip pictured",
      "Power": "USB charging cable pictured"
    },
    "image": "/products/vl160bd-phone-light.png",
    "images": [
      "/products/vl160bd-phone-light.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "q96-tv-stick",
    "name": "Q96 4K TV Stick",
    "brand": "Unbranded",
    "category": "Accessories",
    "price": 35000,
    "description": "An HDMI TV stick pictured with a remote control for a connected-screen setup.",
    "specs": {
      "Model": "Q96 (packaging)",
      "Video": "4K advertised; confirm supported formats",
      "Connection": "HDMI",
      "Accessories": "Remote pictured"
    },
    "detailsNote": "Android TV, memory capacity, and streaming-service logos on the packaging do not establish certification, subscriptions, or supported streaming resolution. Confirm hardware and app compatibility.",
    "image": "/products/q96-tv-stick.png",
    "images": [
      "/products/q96-tv-stick.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "sources": []
  },
  {
    "id": "l16-selfie-stick",
    "name": "L16 Selfie Stick & Tripod",
    "brand": "Unbranded",
    "category": "Accessories",
    "price": 10500,
    "description": "A folding selfie stick with a phone clamp, tripod feet, and detachable remote pictured.",
    "specs": {
      "Model": "L16",
      "Design": "Extendable stick / tripod",
      "Remote": "Detachable remote pictured",
      "Color": "Black"
    },
    "image": "/products/l16-selfie-stick.png",
    "images": [
      "/products/l16-selfie-stick.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "hp-convertible-silver",
    "name": "HP Convertible Laptop · Silver",
    "brand": "HP",
    "category": "Laptops",
    "price": 285000,
    "description": "Silver HP convertible pictured in laptop, stand, and tablet positions The pictured unit is listed separately so MGE can confirm its exact configuration.",
    "specs": {
      "Design": "Silver HP convertible pictured in laptop, stand, and tablet positions",
      "Model": "Confirm with MGE",
      "Processor": "Confirm with MGE",
      "Memory": "Confirm with MGE",
      "Storage": "Confirm with MGE",
      "Condition": "Confirm with MGE"
    },
    "identification": "needs-model",
    "detailsNote": "The exact model and configuration cannot be established from this image. Confirm the model number, processor, RAM, storage, display, and condition with MGE.",
    "image": "/products/hp-convertible-silver.png",
    "images": [
      "/products/hp-convertible-silver.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "sources": []
  },
  {
    "id": "playstation-4-slim-1tb",
    "name": "Sony PlayStation 4 Slim · 1TB",
    "brand": "Sony",
    "category": "Gaming",
    "price": 260000,
    "description": "A slim PlayStation 4 console with a controller and cables pictured. A 1TB configuration is shown on the packaging.",
    "specs": {
      "Platform": "PlayStation 4",
      "Storage": "1TB (packaging; verify installed drive)",
      "Video": "HDMI output",
      "Color": "Black",
      "Condition": "Confirm with MGE"
    },
    "identification": "model-reference",
    "sources": [
      {
        "title": "PlayStation 4 specifications",
        "url": "https://www.playstation.com/en-au/ps4/tech-specs/"
      }
    ],
    "detailsNote": "Model-family details are referenced from PlayStation. Confirm the CUH model code, installed storage, condition, and exact bundle contents with MGE.",
    "image": "/products/playstation-4-slim-1tb.png",
    "images": [
      "/products/playstation-4-slim-1tb.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true
  },
  {
    "id": "ay49-video-kit",
    "name": "AY-49 Video-Making Kit",
    "brand": "Unbranded",
    "category": "Lighting",
    "price": 20000,
    "description": "A phone recording kit pictured with a small light, microphone, phone holder, tripod, and remote.",
    "specs": {
      "Model": "AY-49",
      "Kit": "Microphone, LED light, tripod, phone holder pictured",
      "Remote": "Bluetooth remote pictured",
      "Compatibility": "Confirm phone connector and adapters"
    },
    "image": "/products/ay49-video-kit.png",
    "images": [
      "/products/ay49-video-kit.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "earhook-wireless-earbuds",
    "name": "Ear-hook Wireless Earbuds · Black",
    "brand": "JBL (packaging)",
    "category": "Audio",
    "price": 16000,
    "description": "Black wireless earbuds with wraparound ear hooks and a charging case, shown in two supplied images.",
    "specs": {
      "Design": "Ear-hook wireless earbuds",
      "Color": "Black",
      "Case": "Charging case pictured",
      "Model": "Confirm with MGE"
    },
    "identification": "needs-model",
    "detailsNote": "The box uses JBL branding but does not establish a verifiable JBL model. No JBL battery, waterproofing, or audio specifications have been assumed.",
    "image": "/products/earhook-wireless-earbuds.png",
    "images": [
      "/products/earhook-wireless-earbuds.png",
      "/products/earhook-wireless-earbuds-2.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "sources": []
  },
  {
    "id": "l016-tablet-stand",
    "name": "L016 Rotating Tablet Stand",
    "brand": "Unbranded",
    "category": "Office",
    "price": 15000,
    "description": "An adjustable desktop tablet stand with a ventilated support plate and rotating base pictured.",
    "specs": {
      "Model": "L016 (packaging)",
      "Material": "Carbon steel (packaging)",
      "Base": "360° rotation advertised",
      "Design": "Adjustable tablet support"
    },
    "image": "/products/l016-tablet-stand.png",
    "images": [
      "/products/l016-tablet-stand.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "hp-silver-classic-notebook",
    "name": "HP Classic Notebook · Silver",
    "brand": "HP",
    "category": "Laptops",
    "price": 220000,
    "description": "Silver HP laptop with a black keyboard and charger pictured The pictured unit is listed separately so MGE can confirm its exact configuration.",
    "specs": {
      "Design": "Silver HP laptop with a black keyboard and charger pictured",
      "Model": "Confirm with MGE",
      "Processor": "Confirm with MGE",
      "Memory": "Confirm with MGE",
      "Storage": "Confirm with MGE",
      "Condition": "Confirm with MGE"
    },
    "identification": "needs-model",
    "detailsNote": "The exact model and configuration cannot be established from this image. Confirm the model number, processor, RAM, storage, display, and condition with MGE.",
    "image": "/products/hp-silver-classic-notebook.png",
    "images": [
      "/products/hp-silver-classic-notebook.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "sources": []
  },
  {
    "id": "bose-black-headphones",
    "name": "Bose-branded Headphones · Black",
    "brand": "Bose (packaging)",
    "category": "Audio",
    "price": 95000,
    "description": "Black over-ear headphones shown with a carrying case. The exact Bose model is not visible.",
    "specs": {
      "Design": "Over-ear",
      "Color": "Black",
      "Accessories": "Case and cables pictured",
      "Model": "Confirm with MGE"
    },
    "identification": "needs-model",
    "detailsNote": "No exact model is readable. Battery, noise cancellation, Bluetooth version, and authenticity cannot be established from this image.",
    "image": "/products/bose-black-headphones.png",
    "images": [
      "/products/bose-black-headphones.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "sources": []
  },
  {
    "id": "dell-compact-silver",
    "name": "Dell Compact Laptop · Silver",
    "brand": "Dell",
    "category": "Laptops",
    "price": 190000,
    "description": "Compact silver Dell laptop with a black keyboard and charger pictured The pictured unit is listed separately so MGE can confirm its exact configuration.",
    "specs": {
      "Design": "Compact silver Dell laptop with a black keyboard and charger pictured",
      "Model": "Confirm with MGE",
      "Processor": "Confirm with MGE",
      "Memory": "Confirm with MGE",
      "Storage": "Confirm with MGE",
      "Condition": "Confirm with MGE"
    },
    "identification": "needs-model",
    "detailsNote": "The exact model and configuration cannot be established from this image. Confirm the model number, processor, RAM, storage, display, and condition with MGE.",
    "image": "/products/dell-compact-silver.png",
    "images": [
      "/products/dell-compact-silver.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "sources": []
  },
  {
    "id": "jc18h-selfie-stick",
    "name": "JC18H Selfie Stick with Dual Lights",
    "brand": "Unbranded",
    "category": "Accessories",
    "price": 18000,
    "description": "An extendable phone tripod pictured with two small fill lights and a detachable remote.",
    "specs": {
      "Model": "JC18H",
      "Lighting": "Two fill lights pictured",
      "Mount": "Phone clamp and tripod feet",
      "Remote": "Wireless remote pictured"
    },
    "image": "/products/jc18h-selfie-stick.png",
    "images": [
      "/products/jc18h-selfie-stick.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "braided-aux-cable",
    "name": "Braided 3.5 mm AUX Cable",
    "brand": "Unbranded",
    "category": "Audio",
    "price": 3500,
    "description": "A braided audio cable for connecting compatible devices with 3.5 mm audio ports.",
    "specs": {
      "Connection": "3.5 mm male to male",
      "Finish": "Black / white braided cable",
      "Length": "Confirm with MGE"
    },
    "image": "/products/braided-aux-cable.png",
    "images": [
      "/products/braided-aux-cable.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "aurora-t3-headphones",
    "name": "Aurora T3 Headphones · Cream",
    "brand": "Unbranded",
    "category": "Audio",
    "price": 28000,
    "description": "Cream over-ear headphones pictured with lighting accents, charging cable, and audio cable.",
    "specs": {
      "Model": "SY-T3 / Aurora T3 (packaging)",
      "Color": "Cream",
      "Design": "Over-ear",
      "Lighting": "Ear-cup lighting pictured"
    },
    "image": "/products/aurora-t3-headphones.png",
    "images": [
      "/products/aurora-t3-headphones.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "hp-compact-black",
    "name": "HP Compact Laptop · Black",
    "brand": "HP",
    "category": "Laptops",
    "price": 155000,
    "description": "Compact black HP laptop with multiple side ports The pictured unit is listed separately so MGE can confirm its exact configuration.",
    "specs": {
      "Design": "Compact black HP laptop with multiple side ports",
      "Model": "Confirm with MGE",
      "Processor": "Confirm with MGE",
      "Memory": "Confirm with MGE",
      "Storage": "Confirm with MGE",
      "Condition": "Confirm with MGE"
    },
    "identification": "needs-model",
    "detailsNote": "The exact model and configuration cannot be established from this image. Confirm the model number, processor, RAM, storage, display, and condition with MGE.",
    "image": "/products/hp-compact-black.png",
    "images": [
      "/products/hp-compact-black.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "sources": []
  },
  {
    "id": "mg-s20-led-earbuds",
    "name": "MG-S20 LED Wireless Earbuds",
    "brand": "Samsung (packaging)",
    "category": "Audio",
    "price": 12000,
    "description": "Black wireless earbuds with a numeric charging-case display, labelled MG-S20 on the box.",
    "specs": {
      "Model": "MG-S20 (packaging)",
      "Color": "Black",
      "Case": "Numeric display pictured",
      "Design": "In-ear wireless earbuds"
    },
    "identification": "needs-model",
    "detailsNote": "The MG-S20 label has not been matched to an official Samsung Galaxy Buds product. Brand, specifications, and Bluetooth claims require confirmation.",
    "image": "/products/mg-s20-led-earbuds.png",
    "images": [
      "/products/mg-s20-led-earbuds.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "sources": []
  },
  {
    "id": "dell-silver-notebook",
    "name": "Dell Notebook · Silver",
    "brand": "Dell",
    "category": "Laptops",
    "price": 230000,
    "description": "Silver Dell laptop with black keyboard and several side ports pictured The pictured unit is listed separately so MGE can confirm its exact configuration.",
    "specs": {
      "Design": "Silver Dell laptop with black keyboard and several side ports pictured",
      "Model": "Confirm with MGE",
      "Processor": "Confirm with MGE",
      "Memory": "Confirm with MGE",
      "Storage": "Confirm with MGE",
      "Condition": "Confirm with MGE"
    },
    "identification": "needs-model",
    "detailsNote": "The exact model and configuration cannot be established from this image. Confirm the model number, processor, RAM, storage, display, and condition with MGE.",
    "image": "/products/dell-silver-notebook.png",
    "images": [
      "/products/dell-silver-notebook.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "sources": []
  },
  {
    "id": "mj38-rgb-ring-light",
    "name": "MJ-38 RGB Ring Light",
    "brand": "Unbranded",
    "category": "Lighting",
    "price": 42000,
    "description": "An RGB ring-light kit pictured with three phone mounts and a tripod.",
    "specs": {
      "Model": "MJ-38",
      "Lighting": "RGB",
      "Mounts": "Three phone holders pictured",
      "Diameter": "Confirm with MGE"
    },
    "image": "/products/mj38-rgb-ring-light.png",
    "images": [
      "/products/mj38-rgb-ring-light.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "polymer-powerbank-55000",
    "name": "55,000mAh Power Bank · 22.5W Label",
    "brand": "Unconfirmed",
    "category": "Charging",
    "price": 45000,
    "description": "A black power bank with an orange carry strap, display, and charging cable pictured.",
    "specs": {
      "Capacity": "55,000mAh (packaging claim)",
      "Output": "22.5W (packaging claim)",
      "Display": "Numeric display pictured",
      "Color": "Black / orange"
    },
    "image": "/products/polymer-powerbank-55000.png",
    "images": [
      "/products/polymer-powerbank-55000.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "shplus-sh-e30-earphones",
    "name": "SHPLUS SH-E30 Lightning Earphones",
    "brand": "SHPLUS",
    "category": "Audio",
    "price": 6500,
    "description": "White wired earphones with inline controls and a Lightning-style connector pictured.",
    "specs": {
      "Model": "SH-E30",
      "Connector": "Lightning-style; confirm compatibility",
      "Color": "White",
      "Controls": "Inline control pictured"
    },
    "image": "/products/shplus-sh-e30-earphones.png",
    "images": [
      "/products/shplus-sh-e30-earphones.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  },
  {
    "id": "dell-business-grey",
    "name": "Dell Business Laptop · Grey",
    "brand": "Dell",
    "category": "Laptops",
    "price": 205000,
    "description": "Grey Dell laptop with black keyboard and silver-grey lid The pictured unit is listed separately so MGE can confirm its exact configuration.",
    "specs": {
      "Design": "Grey Dell laptop with black keyboard and silver-grey lid",
      "Model": "Confirm with MGE",
      "Processor": "Confirm with MGE",
      "Memory": "Confirm with MGE",
      "Storage": "Confirm with MGE",
      "Condition": "Confirm with MGE"
    },
    "identification": "needs-model",
    "detailsNote": "The exact model and configuration cannot be established from this image. Confirm the model number, processor, RAM, storage, display, and condition with MGE.",
    "image": "/products/dell-business-grey.png",
    "images": [
      "/products/dell-business-grey.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "sources": []
  },
  {
    "id": "zealot-s67",
    "name": "ZEALOT S67 Wireless Speaker",
    "brand": "ZEALOT",
    "category": "Audio",
    "price": 85000,
    "description": "A portable speaker with a carrying strap and illuminated ends, labelled S-67 on the packaging.",
    "specs": {
      "Model": "S-67 (packaging)",
      "Design": "Portable cylindrical speaker",
      "Color": "Black",
      "Lighting": "Coloured end rings pictured"
    },
    "sources": [
      {
        "title": "ZEALOT S67 model reference",
        "url": "https://www.zealot-speaker.com/product/s67/"
      }
    ],
    "detailsNote": "The model label matches S67, but the pictured design must be checked against the manufacturer model before adopting its wattage and battery specifications.",
    "image": "/products/zealot-s67.png",
    "images": [
      "/products/zealot-s67.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging"
  },
  {
    "id": "hp-v3000-mouse",
    "name": "HP V3000 Wireless Mouse",
    "brand": "HP (packaging)",
    "category": "Accessories",
    "price": 8500,
    "description": "A compact wireless mouse shown in black and silver, with a USB receiver.",
    "specs": {
      "Model": "V3000 (packaging)",
      "Connection": "2.4GHz USB receiver (packaging)",
      "Colors": "Black and silver pictured; confirm selected colour",
      "Sensor": "1200 DPI (packaging claim)"
    },
    "image": "/products/hp-v3000-mouse.png",
    "images": [
      "/products/hp-v3000-mouse.png"
    ],
    "stock": null,
    "priceIsPlaceholder": true,
    "identification": "packaging",
    "detailsNote": "Details are taken from the supplied image and packaging. Confirm the exact version, compatibility, and package contents with MGE.",
    "sources": []
  }
]

export const money = new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format
export const categories = ['Laptops','Audio','Charging','Wearables','Gaming','Lighting','Office','Accessories']
// Quantity limit for preview bags; not a claim about inventory.
export const purchaseLimit = (product: Product) => product.stock ?? 99
