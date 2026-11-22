/**
 * Central tool registry.
 *
 * Every tool on the site is declared here once. Navigation, search,
 * category pages, the homepage, related-tool links and the sitemap are
 * all generated from this list, so adding a tool = add an entry here,
 * add its SEO copy in lib/tool-content.ts and create its page folder.
 *
 * Keep this file light: it is shipped to the browser for the search box.
 * Long SEO text lives in lib/tool-content.ts (server only).
 */
import type { LucideIcon } from "lucide-react";
import {
  FileText,
  ImageIcon,
  Calculator,
  RefreshCw,
  Mic,
  Combine,
  Scissors,
  PenLine,
  RotateCw,
  FileImage,
  Images,
  Minimize2,
  ListOrdered,
  Stamp,
  Trash2,
  LayoutGrid,
  ScanText,
  Maximize2,
  FileType,
  Crop,
  FlipHorizontal,
  Binary,
  Pipette,
  Cake,
  Scale,
  Percent,
  Landmark,
  TrendingUp,
  HandCoins,
  Tag,
  CalendarDays,
  GraduationCap,
  Flame,
  Receipt,
  Ruler,
  Clock,
  Globe,
  Palette,
  Type,
  CaseSensitive,
  AlignLeft,
  GitCompare,
  ListX,
  KeyRound,
  QrCode,
  Fingerprint,
  Dices,
  Disc3,
  Braces,
  Link,
  ShieldCheck,
  KeySquare,
  Regex,
  Volume2,
  Disc,
  MonitorPlay,
  Timer,
  Hourglass,
  NotebookPen,
  Keyboard,
  Wand2,
  Code,
  Watch,
  ShoppingCart,
  Sparkles,
  Banknote,
  Languages,
} from "lucide-react";

export type CategoryId =
  | "pdf"
  | "image"
  | "calculators"
  | "converters"
  | "text"
  | "generators"
  | "developer"
  | "audio"
  | "productivity";

export interface Category {
  id: CategoryId;
  name: string;
  href: string;
  short: string;
  description: string;
  icon: LucideIcon;
  /** Tailwind classes for the icon tile (work in light + dark). */
  tint: string;
  gradient: string;
}

export interface Tool {
  slug: string;
  name: string;
  href: string;
  category: CategoryId;
  description: string;
  icon: LucideIcon;
  /** Extra words people type in the search box. */
  tags?: string;
  popular?: boolean;
  isNew?: boolean;
}

export const categories: Category[] = [
  {
    id: "pdf",
    name: "PDF Tools",
    href: "/pdf-tools/",
    short: "Merge, split, compress & sign",
    description:
      "Free online PDF tools to merge, split, compress, rotate, sign, watermark, number and convert PDF files. Everything runs in your browser — your documents are never uploaded.",
    icon: FileText,
    tint: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    gradient: "from-rose-500 to-orange-500",
  },
  {
    id: "image",
    name: "Image Tools",
    href: "/image-tools/",
    short: "Compress, resize, crop & convert",
    description:
      "Free image tools to compress, resize, crop, rotate and convert JPG, PNG, WEBP and HEIC images — processed privately in your browser.",
    icon: ImageIcon,
    tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    gradient: "from-amber-500 to-yellow-500",
  },
  {
    id: "calculators",
    name: "Calculators",
    href: "/calculators/",
    short: "Health, money & everyday math",
    description:
      "Free online calculators for age, BMI, percentage, loans, interest, tips, discounts, GPA, calories, VAT and online selling fees.",
    icon: Calculator,
    tint: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: "converters",
    name: "Converters",
    href: "/converters/",
    short: "Units, time, colors & numbers",
    description:
      "Free converters for units of measurement, time zones, Unix timestamps, number bases and color codes.",
    icon: RefreshCw,
    tint: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    gradient: "from-sky-500 to-cyan-500",
  },
  {
    id: "text",
    name: "Text Tools",
    href: "/text-tools/",
    short: "Count, compare & transform text",
    description:
      "Free text tools: word counter, case converter, diff checker, duplicate line remover, lorem ipsum generator and a typing speed test.",
    icon: Type,
    tint: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    id: "generators",
    name: "Generators",
    href: "/generators/",
    short: "Passwords, QR codes & randomizers",
    description:
      "Free generators for strong passwords, QR codes, UUIDs, random numbers and a spin-the-wheel random picker.",
    icon: Wand2,
    tint: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400",
    gradient: "from-fuchsia-500 to-pink-500",
  },
  {
    id: "developer",
    name: "Developer Tools",
    href: "/developer-tools/",
    short: "JSON, Base64, hashes & regex",
    description:
      "Free developer utilities: JSON formatter, Base64 and URL encoders, hash generator, JWT decoder and regex tester.",
    icon: Code,
    tint: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    id: "audio",
    name: "Audio & Video",
    href: "/audio-tools/",
    short: "Speech, voice & screen recording",
    description:
      "Free audio and video tools: speech to text, text to speech, voice recorder and screen recorder — recorded locally on your device.",
    icon: Mic,
    tint: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    id: "productivity",
    name: "Productivity",
    href: "/productivity-tools/",
    short: "Timers, stopwatch & notepad",
    description:
      "Free productivity tools: Pomodoro timer, stopwatch, countdown timer and a private online notepad that saves to your own browser.",
    icon: Timer,
    tint: "bg-lime-500/10 text-lime-700 dark:text-lime-400",
    gradient: "from-lime-500 to-green-500",
  },
];

const t = (
  category: CategoryId,
  slug: string,
  name: string,
  description: string,
  icon: LucideIcon,
  extra: Partial<Tool> = {},
): Tool => {
  const cat = categories.find((c) => c.id === category)!;
  return {
    slug,
    name,
    category,
    description,
    icon,
    href: `${cat.href}${slug}/`,
    ...extra,
  };
};

export const tools: Tool[] = [
  // ---------------- PDF ----------------
  t("pdf", "merge-pdf", "Merge PDF", "Combine multiple PDFs into one file in any order.", Combine, { popular: true, tags: "join combine pdf" }),
  t("pdf", "split-pdf", "Split PDF", "Extract pages or split a PDF into separate files.", Scissors, { popular: true, tags: "extract pages separate" }),
  t("pdf", "compress-pdf", "Compress PDF", "Reduce PDF file size for email and uploads.", Minimize2, { popular: true, isNew: true, tags: "reduce shrink size smaller" }),
  t("pdf", "sign-pdf", "Sign PDF", "Draw, type or upload a signature and sign a PDF.", PenLine, { popular: true, tags: "signature esign e-sign" }),
  t("pdf", "jpg-to-pdf", "JPG to PDF", "Convert JPG, PNG and WEBP images into a PDF.", Images, { popular: true, tags: "image to pdf photo" }),
  t("pdf", "pdf-to-jpg", "PDF to JPG", "Turn every PDF page into a high-quality image.", FileImage, { tags: "pdf to image png" }),
  t("pdf", "png-to-pdf", "PNG to PDF", "Convert PNG images and screenshots into a PDF.", Images, { tags: "image to pdf screenshot" }),
  t("pdf", "rotate-pdf", "Rotate PDF", "Rotate PDF pages and save them permanently.", RotateCw, { tags: "turn flip orientation" }),
  t("pdf", "organize-pdf", "Organize PDF", "Reorder, rotate and delete PDF pages visually.", LayoutGrid, { isNew: true, tags: "reorder sort rearrange pages" }),
  t("pdf", "remove-pdf-pages", "Remove PDF Pages", "Delete unwanted pages from a PDF document.", Trash2, { isNew: true, tags: "delete pages" }),
  t("pdf", "add-page-numbers", "Add Page Numbers", "Insert page numbers into a PDF with custom position.", ListOrdered, { isNew: true, tags: "number pages pagination" }),
  t("pdf", "watermark-pdf", "Watermark PDF", "Stamp text such as CONFIDENTIAL over PDF pages.", Stamp, { isNew: true, tags: "stamp confidential draft" }),
  t("pdf", "pdf-to-text", "PDF to Text", "Extract all text from a PDF to copy or download.", ScanText, { isNew: true, tags: "extract text txt copy" }),

  // ---------------- IMAGE ----------------
  t("image", "compress-image", "Compress Image", "Shrink JPG, PNG, WEBP and HEIC file size.", Minimize2, { popular: true, tags: "reduce size optimize kb" }),
  t("image", "resize-image", "Resize Image", "Change image dimensions in pixels or percent.", Maximize2, { popular: true, isNew: true, tags: "scale dimensions pixels" }),
  t("image", "convert-image", "Image Converter", "Convert images between JPG, PNG and WEBP.", FileType, { isNew: true, tags: "jpg png webp format change" }),
  t("image", "crop-image", "Crop Image", "Crop photos freely or to a fixed aspect ratio.", Crop, { isNew: true, tags: "cut trim aspect ratio" }),
  t("image", "heic-to-jpg", "HEIC to JPG", "Convert iPhone HEIC photos to JPG.", FileImage, { isNew: true, tags: "iphone heif apple photo" }),
  t("image", "png-to-jpg", "PNG to JPG", "Convert PNG images to JPG with a background colour.", FileType, { tags: "convert" }),
  t("image", "jpg-to-png", "JPG to PNG", "Convert JPG photos to lossless PNG.", FileType, { tags: "convert" }),
  t("image", "webp-to-jpg", "WEBP to JPG", "Convert WEBP images to widely supported JPG.", FileType, { tags: "convert" }),
  t("image", "rotate-image", "Rotate & Flip Image", "Rotate 90° or mirror images horizontally/vertically.", FlipHorizontal, { isNew: true, tags: "mirror flip turn" }),
  t("image", "image-to-base64", "Image to Base64", "Encode an image as a Base64 data URI.", Binary, { isNew: true, tags: "data uri encode" }),
  t("image", "color-picker", "Image Color Picker", "Pick HEX and RGB colours from any image.", Pipette, { isNew: true, tags: "eyedropper hex palette" }),

  // ---------------- CALCULATORS ----------------
  t("calculators", "online-calculator", "Online Calculator", "Basic and scientific calculator with history.", Calculator, { popular: true, isNew: true, tags: "scientific calculator math sin cos log" }),
  t("calculators", "age-calculator", "Age Calculator", "Find your exact age in years, months and days.", Cake, { popular: true, isNew: true, tags: "birthday date of birth" }),
  t("calculators", "bmi-calculator", "BMI Calculator", "Calculate Body Mass Index in metric or imperial.", Scale, { popular: true, isNew: true, tags: "body mass weight health" }),
  t("calculators", "percentage-calculator", "Percentage Calculator", "Percent of a number, change and differences.", Percent, { popular: true, isNew: true, tags: "percent increase decrease" }),
  t("calculators", "loan-calculator", "Loan & EMI Calculator", "Monthly payment, total interest and schedule.", Landmark, { isNew: true, tags: "emi mortgage car loan repayment" }),
  t("calculators", "compound-interest-calculator", "Compound Interest Calculator", "See how savings grow with compounding.", TrendingUp, { isNew: true, tags: "investment savings growth" }),
  t("calculators", "tip-calculator", "Tip Calculator", "Split the bill and work out the tip per person.", HandCoins, { isNew: true, tags: "split bill restaurant gratuity" }),
  t("calculators", "discount-calculator", "Discount Calculator", "Sale price and savings after a percentage off.", Tag, { isNew: true, tags: "sale off price" }),
  t("calculators", "date-calculator", "Date Difference Calculator", "Days between two dates, or add/subtract days.", CalendarDays, { isNew: true, tags: "days between dates count" }),
  t("calculators", "gpa-calculator", "GPA Calculator", "Calculate your grade point average by credits.", GraduationCap, { isNew: true, tags: "grade cgpa university" }),
  t("calculators", "calorie-calculator", "Calorie Calculator", "Daily calories (BMR & TDEE) for your goal.", Flame, { isNew: true, tags: "bmr tdee diet" }),
  t("calculators", "vat-calculator", "VAT & Sales Tax Calculator", "Add or remove VAT / sales tax from a price.", Receipt, { isNew: true, tags: "gst tax" }),
  t("calculators", "ebay-fee-calculator", "eBay Fee Calculator", "eBay fees, profit, ROI and margin for sellers.", ShoppingCart, { tags: "ebay profit seller" }),

  // ---------------- CONVERTERS ----------------
  t("converters", "currency-converter", "Currency Converter", "Live exchange rates for 160+ currencies.", Banknote, { popular: true, isNew: true, tags: "exchange rate usd lkr eur inr money" }),
  t("converters", "unit-converter", "Unit Converter", "Length, weight, temperature, volume, speed and more.", Ruler, { popular: true, isNew: true, tags: "cm inches kg lbs celsius fahrenheit" }),
  t("converters", "time-zone-converter", "Time Zone Converter", "Convert a time between cities and time zones.", Globe, { isNew: true, tags: "world clock utc gmt" }),
  t("converters", "timestamp-converter", "Unix Timestamp Converter", "Convert epoch timestamps to dates and back.", Clock, { isNew: true, tags: "epoch unix time" }),
  t("converters", "number-base-converter", "Number Base Converter", "Binary, octal, decimal and hexadecimal.", Binary, { isNew: true, tags: "binary hex decimal octal" }),
  t("converters", "color-converter", "Color Converter", "Convert HEX, RGB and HSL colour codes.", Palette, { isNew: true, tags: "hex rgb hsl" }),

  // ---------------- TEXT ----------------
  t("text", "fancy-text-generator", "Fancy Text Generator", "Cool fonts for Instagram, TikTok and bios.", Sparkles, { popular: true, isNew: true, tags: "font generator instagram bio stylish text" }),
  t("text", "singlish-to-sinhala", "Singlish to Sinhala", "Type Sinhala Unicode using English letters.", Languages, { popular: true, isNew: true, tags: "sinhala unicode typing converter sri lanka" }),
  t("text", "word-counter", "Word Counter", "Count words, characters, sentences and reading time.", AlignLeft, { popular: true, isNew: true, tags: "character count letters" }),
  t("text", "case-converter", "Case Converter", "UPPERCASE, lowercase, Title Case, camelCase and more.", CaseSensitive, { isNew: true, tags: "uppercase lowercase title" }),
  t("text", "diff-checker", "Diff Checker", "Compare two texts and highlight the differences.", GitCompare, { isNew: true, tags: "compare text difference" }),
  t("text", "remove-duplicate-lines", "Remove Duplicate Lines", "Clean lists: dedupe, sort and trim lines.", ListX, { isNew: true, tags: "dedupe unique sort list" }),
  t("text", "lorem-ipsum-generator", "Lorem Ipsum Generator", "Placeholder paragraphs, sentences or words.", Type, { isNew: true, tags: "dummy placeholder text" }),
  { slug: "typing-speed-test", name: "Typing Speed Test", href: "/calculators/typing-speed-test/", category: "text", description: "Test your typing speed in WPM and accuracy.", icon: Keyboard, popular: true, tags: "wpm typing test" },

  // ---------------- GENERATORS ----------------
  t("generators", "password-generator", "Password Generator", "Create strong, random passwords instantly.", KeyRound, { popular: true, isNew: true, tags: "secure random strong" }),
  t("generators", "qr-code-generator", "QR Code Generator", "QR codes for links, Wi-Fi, text and contacts.", QrCode, { popular: true, isNew: true, tags: "qr wifi url" }),
  t("generators", "spin-the-wheel", "Spin the Wheel", "Random name picker wheel for giveaways and games.", Disc3, { popular: true, isNew: true, tags: "random picker name wheel decide" }),
  t("generators", "random-number-generator", "Random Number Generator", "Random numbers in any range, with no repeats.", Dices, { isNew: true, tags: "rng dice lottery" }),
  t("generators", "uuid-generator", "UUID Generator", "Generate random v4 UUIDs / GUIDs in bulk.", Fingerprint, { isNew: true, tags: "guid unique id" }),

  // ---------------- DEVELOPER ----------------
  t("developer", "json-formatter", "JSON Formatter", "Format, validate and minify JSON.", Braces, { popular: true, isNew: true, tags: "beautify validator pretty" }),
  t("developer", "base64-encoder", "Base64 Encode / Decode", "Encode or decode Base64 text (UTF-8 safe).", Binary, { isNew: true, tags: "decode encode" }),
  t("developer", "url-encoder", "URL Encode / Decode", "Percent-encode or decode URLs and query strings.", Link, { isNew: true, tags: "percent encoding uri" }),
  t("developer", "hash-generator", "Hash Generator", "MD5, SHA-1, SHA-256 and SHA-512 hashes.", ShieldCheck, { isNew: true, tags: "md5 sha256 checksum" }),
  t("developer", "jwt-decoder", "JWT Decoder", "Decode JSON Web Token header and payload.", KeySquare, { isNew: true, tags: "json web token" }),
  t("developer", "regex-tester", "Regex Tester", "Test regular expressions with live highlighting.", Regex, { isNew: true, tags: "regular expression match" }),

  // ---------------- AUDIO / VIDEO ----------------
  t("audio", "speech-to-text", "Speech to Text", "Dictate and transcribe speech in 60+ languages.", Mic, { popular: true, tags: "voice typing dictation transcribe" }),
  t("audio", "text-to-speech", "Text to Speech", "Read text aloud with natural voices.", Volume2, { popular: true, isNew: true, tags: "tts read aloud voice" }),
  t("audio", "voice-recorder", "Voice Recorder", "Record audio from your microphone and download it.", Disc, { isNew: true, tags: "audio record mic" }),
  t("audio", "screen-recorder", "Screen Recorder", "Record your screen, a window or tab — no install.", MonitorPlay, { isNew: true, tags: "capture screencast video" }),

  // ---------------- PRODUCTIVITY ----------------
  t("productivity", "pomodoro-timer", "Pomodoro Timer", "Focus timer with work and break sessions.", Timer, { isNew: true, tags: "focus study tomato" }),
  t("productivity", "stopwatch", "Online Stopwatch", "Accurate stopwatch with laps.", Watch, { isNew: true, tags: "lap timer" }),
  t("productivity", "countdown-timer", "Countdown Timer", "Set a timer with an alarm sound.", Hourglass, { isNew: true, tags: "alarm timer minutes" }),
  t("productivity", "online-notepad", "Online Notepad", "Private notes saved in your own browser.", NotebookPen, { isNew: true, tags: "notes text editor" }),
];

export const getTool = (slug: string): Tool => {
  const tool = tools.find((x) => x.slug === slug);
  if (!tool) throw new Error(`Unknown tool: ${slug}`);
  return tool;
};

export const getCategory = (id: CategoryId): Category =>
  categories.find((c) => c.id === id)!;

export const toolsIn = (id: CategoryId): Tool[] =>
  tools.filter((x) => x.category === id);

export const popularTools = (): Tool[] => tools.filter((x) => x.popular);

/** Same-category tools first, then popular tools elsewhere. */
export const relatedTools = (slug: string, count = 6): Tool[] => {
  const tool = getTool(slug);
  const same = tools.filter((x) => x.category === tool.category && x.slug !== slug);
  const others = popularTools().filter((x) => x.category !== tool.category);
  return [...same, ...others].slice(0, count);
};

export const SITE_URL = "https://acutio.com";
export const SITE_NAME = "Acutio";
