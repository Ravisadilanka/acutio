/**
 * Long-form SEO content per tool. Server-only — imported by page metadata
 * and the ToolShell, never by client components, so it adds nothing to JS.
 *
 * title: <title> tag (keep under ~60 chars, put the main keyword first)
 * description: meta description (~140–160 chars, include a call to action)
 */
export interface FAQ {
  q: string;
  a: string;
}

export interface ToolContent {
  title: string;
  description: string;
  keywords: string[];
  /** Optional H1 override (defaults to tool name). */
  h1?: string;
  intro: string;
  steps: string[];
  features: string[];
  faqs: FAQ[];
}

const browser =
  "Everything happens locally in your browser. Your files are never uploaded to our servers, and nothing is stored once you close the tab.";

export const toolContent: Record<string, ToolContent> = {
  // =========================== PDF ===========================
  "merge-pdf": {
    title: "Merge PDF Online Free – Combine PDF Files",
    description:
      "Merge PDF files online for free. Combine multiple PDFs into one document, drag to reorder, no sign-up and no uploads — 100% private in your browser.",
    keywords: ["merge pdf", "combine pdf", "join pdf", "pdf merger", "merge pdf online free"],
    intro:
      "Combine two or more PDF documents into a single file in seconds. Drag files to set the order, then download one clean PDF — no watermark, no account, no file-size paywall.",
    steps: ["Select or drop your PDF files.", "Drag the files into the order you want.", "Click Merge PDF.", "Download your combined PDF."],
    features: ["Unlimited files and pages", "Drag-and-drop ordering", "Keeps original quality", "No watermark or sign-up", "Works offline once loaded"],
    faqs: [
      { q: "How do I merge PDF files for free?", a: "Add your PDFs above, arrange them in the order you want and click Merge PDF. The combined file downloads immediately — completely free." },
      { q: "Is there a limit on the number of PDFs?", a: "No fixed limit. Very large documents are only limited by your device's memory because processing happens on your computer." },
      { q: "Will merging reduce the quality of my PDF?", a: "No. Pages are copied as-is, so text, images and vector graphics keep their original quality." },
    ],
  },
  "split-pdf": {
    title: "Split PDF Online Free – Extract PDF Pages",
    description:
      "Split a PDF into separate pages or custom page ranges for free. Extract only the pages you need — fast, private and no uploads.",
    keywords: ["split pdf", "extract pdf pages", "separate pdf pages", "pdf splitter", "split pdf online"],
    intro:
      "Break a large PDF into smaller files or pull out just the pages you need. Choose individual pages or ranges and download the result instantly.",
    steps: ["Upload a PDF.", "Choose to split every page or enter custom ranges.", "Click Split PDF.", "Download your new files."],
    features: ["Split by page ranges", "Extract single pages", "Original quality preserved", "No sign-up required", "Private, in-browser processing"],
    faqs: [
      { q: "How do I extract pages from a PDF?", a: "Upload the PDF, enter the page numbers or ranges you want (for example 1-3, 7) and download the extracted file." },
      { q: "Can I split a password-protected PDF?", a: "Encrypted PDFs must be unlocked first. Open it with the password in your PDF reader and save an unprotected copy." },
    ],
  },
  "compress-pdf": {
    title: "Compress PDF Online Free – Reduce PDF File Size",
    description:
      "Compress PDF files online for free. Reduce PDF size for email, WhatsApp and upload limits. Choose a compression level — private, no uploads, no sign-up.",
    keywords: ["compress pdf", "reduce pdf size", "pdf compressor", "shrink pdf", "compress pdf to 100kb", "make pdf smaller"],
    intro:
      "Make large PDFs small enough for email attachments, job portals and government forms. Pick a compression strength and see the new file size before you download.",
    steps: ["Upload your PDF.", "Choose Low, Recommended or Extreme compression.", "Click Compress PDF.", "Compare sizes and download."],
    features: ["Three compression levels", "Shows size saved", "Great for scanned PDFs", "No watermark", "Files never leave your device"],
    faqs: [
      { q: "How does the PDF compressor work?", a: "Each page is re-rendered as an optimized image at a lower resolution and JPEG quality, which dramatically shrinks scanned and image-heavy PDFs." },
      { q: "Will the text still be selectable?", a: "Compressed pages are stored as images, so text is no longer selectable. If you need searchable text, use Low compression or keep the original for editing." },
      { q: "How can I compress a PDF to under 1 MB or 100 KB?", a: "Use Extreme compression. If the file is still too large, split the document and compress each part." },
    ],
  },
  "sign-pdf": {
    title: "Sign PDF Online Free – Add Signature to PDF",
    description:
      "Sign PDF documents online for free. Draw, type or upload your signature, place it anywhere and download — your document never leaves your browser.",
    keywords: ["sign pdf", "add signature to pdf", "e-sign pdf", "electronic signature", "sign pdf online free"],
    intro:
      "Add your signature to contracts, forms and agreements without printing or scanning. Draw it with your mouse or finger, type it, or upload an image of your signature.",
    steps: ["Upload the PDF you need to sign.", "Draw, type or upload your signature.", "Drag and resize it on the page.", "Download the signed PDF."],
    features: ["Draw, type or upload a signature", "Place on any page", "Resize and reposition", "No account needed", "Document stays on your device"],
    faqs: [
      { q: "Is it safe to sign a PDF here?", a: "Yes. The PDF and your signature are processed entirely in your browser and never uploaded." },
      { q: "Is this a legally binding signature?", a: "A drawn electronic signature is accepted for many everyday documents, but requirements vary by country and document type. For regulated documents, check local rules." },
    ],
  },
  "jpg-to-pdf": {
    title: "JPG to PDF Converter Online Free – Images to PDF",
    description:
      "Convert JPG, PNG and WEBP images to PDF for free. Combine many photos into one PDF, set page size and margins — no uploads, no watermark.",
    keywords: ["jpg to pdf", "image to pdf", "photo to pdf", "convert jpg to pdf", "pictures to pdf"],
    intro:
      "Turn photos, scans and screenshots into a single, shareable PDF. Reorder images, choose page orientation and download instantly.",
    steps: ["Add your JPG, PNG or WEBP images.", "Drag to reorder them.", "Choose page size and orientation.", "Click Convert and download your PDF."],
    features: ["Multiple images into one PDF", "Supports JPG, PNG, WEBP", "Reorder by drag and drop", "No watermark", "Private, local conversion"],
    faqs: [
      { q: "How do I convert several images into one PDF?", a: "Add all your images, arrange them in order and click Convert. Each image becomes a page in one PDF file." },
      { q: "Does converting reduce image quality?", a: "Images are embedded at their original resolution, so quality is preserved." },
    ],
  },
  "png-to-pdf": {
    title: "PNG to PDF Converter Online Free",
    description:
      "Convert PNG images and screenshots to PDF online for free. Merge many PNGs into one PDF with no watermark — private and instant.",
    keywords: ["png to pdf", "convert png to pdf", "screenshot to pdf", "png to pdf converter"],
    h1: "PNG to PDF",
    intro:
      "Convert PNG screenshots, diagrams and graphics into a PDF document. Transparent areas are placed on a white page, ready to print or share.",
    steps: ["Add one or more PNG files.", "Reorder them as needed.", "Choose page settings.", "Convert and download the PDF."],
    features: ["Batch PNG conversion", "Keeps sharp edges and text", "Choose page size", "Free with no watermark", "Runs in your browser"],
    faqs: [
      { q: "Can I convert multiple PNG files into one PDF?", a: "Yes. Add as many PNGs as you like; each becomes one page of the PDF." },
      { q: "What happens to transparent backgrounds?", a: "Transparent areas appear white in the PDF, just like printing on paper." },
    ],
  },
  "pdf-to-jpg": {
    title: "PDF to JPG Converter Online Free – High Quality",
    description:
      "Convert PDF pages to JPG images for free. Export every page as a high-resolution image and download individually or all at once — no uploads.",
    keywords: ["pdf to jpg", "pdf to image", "convert pdf to jpg", "pdf to png", "pdf to picture"],
    intro:
      "Extract each page of a PDF as a crisp image you can post, share or insert into presentations.",
    steps: ["Upload a PDF.", "Wait a moment while pages render.", "Download individual pages or all images."],
    features: ["High-resolution output", "Converts every page", "Preview before download", "No sign-up", "Private conversion"],
    faqs: [
      { q: "How do I convert a PDF into images?", a: "Upload your PDF and each page is rendered into a JPG that you can download one by one or together." },
      { q: "Can I convert a PDF to PNG instead?", a: "Yes, choose PNG where the format option is shown for lossless output." },
    ],
  },
  "rotate-pdf": {
    title: "Rotate PDF Online Free – Rotate PDF Pages",
    description:
      "Rotate PDF pages online for free and save them permanently. Rotate all pages or individual pages 90° or 180° — private, no uploads.",
    keywords: ["rotate pdf", "rotate pdf pages", "turn pdf", "rotate pdf online", "pdf rotate and save"],
    intro: "Fix sideways or upside-down scans. Rotate every page or just the ones that need it, then save the corrected PDF.",
    steps: ["Upload a PDF.", "Rotate all pages or individual pages.", "Download the rotated PDF."],
    features: ["Rotate single or all pages", "Rotation saved permanently", "Page previews", "No watermark", "Browser-based"],
    faqs: [
      { q: "Will the rotation be saved permanently?", a: "Yes. The rotation is written into the downloaded PDF so it opens correctly everywhere." },
    ],
  },
  "organize-pdf": {
    title: "Organize PDF Pages Online Free – Reorder & Delete",
    description:
      "Rearrange, rotate and delete PDF pages online for free. Drag page thumbnails into a new order and download the organized PDF — no uploads.",
    keywords: ["organize pdf", "reorder pdf pages", "rearrange pdf pages", "sort pdf pages", "move pdf pages"],
    intro:
      "See every page as a thumbnail, drag pages into the right order, rotate scans and remove pages you don't need — all in one place.",
    steps: ["Upload a PDF.", "Drag thumbnails to reorder pages.", "Rotate or delete pages as needed.", "Save and download the new PDF."],
    features: ["Visual page thumbnails", "Drag-and-drop reorder", "Rotate and delete pages", "Original quality", "Private processing"],
    faqs: [
      { q: "How do I change the order of pages in a PDF?", a: "Upload the PDF, drag the page thumbnails into the order you want and click Save PDF." },
    ],
  },
  "remove-pdf-pages": {
    title: "Delete PDF Pages Online Free – Remove Pages from PDF",
    description:
      "Remove pages from a PDF online for free. Click the pages to delete and download a clean PDF in seconds — private, no sign-up.",
    keywords: ["delete pdf pages", "remove pages from pdf", "pdf page remover", "delete page from pdf"],
    h1: "Remove PDF Pages",
    intro: "Delete blank pages, cover sheets or anything you don't want to share. Click to select pages and download the trimmed PDF.",
    steps: ["Upload your PDF.", "Click the pages you want to remove.", "Click Save PDF and download."],
    features: ["Select pages visually", "Remove any number of pages", "No quality loss", "Free, no watermark", "Runs locally"],
    faqs: [
      { q: "Can I undo a deleted page?", a: "Yes, before saving just click the page again to restore it. Your original file is never modified." },
    ],
  },
  "add-page-numbers": {
    title: "Add Page Numbers to PDF Online Free",
    description:
      "Add page numbers to a PDF online for free. Choose position, format (1, Page 1, 1 of 10), font size and starting number — private, no uploads.",
    keywords: ["add page numbers to pdf", "number pdf pages", "pdf page numbering", "insert page numbers pdf"],
    intro: "Number the pages of reports, theses and legal documents. Pick where the numbers go and how they look.",
    steps: ["Upload your PDF.", "Choose position and number format.", "Set font size and starting number.", "Download the numbered PDF."],
    features: ["6 positions", "Formats: 1 · Page 1 · 1 of N", "Custom start number", "Skip the first page option", "Private processing"],
    faqs: [
      { q: "Can I skip numbering the cover page?", a: "Yes. Tick 'Skip first page' and numbering starts on page two." },
    ],
  },
  "watermark-pdf": {
    title: "Watermark PDF Online Free – Add Text Watermark",
    description:
      "Add a text watermark like CONFIDENTIAL or DRAFT to a PDF for free. Set opacity, size, colour and angle — no uploads, no sign-up.",
    keywords: ["watermark pdf", "add watermark to pdf", "pdf watermark", "confidential stamp pdf"],
    intro: "Protect and label documents with a visible text watermark across every page.",
    steps: ["Upload a PDF.", "Type your watermark text.", "Adjust size, opacity, colour and rotation.", "Download the watermarked PDF."],
    features: ["Custom text", "Opacity and rotation control", "Applied to every page", "Free with no limits", "Private processing"],
    faqs: [
      { q: "Can a watermark be removed?", a: "The watermark is drawn into the page content, which makes casual removal difficult, but no watermark is impossible to remove with editing software." },
    ],
  },
  "pdf-to-text": {
    title: "PDF to Text Converter Online Free – Extract Text",
    description:
      "Extract text from PDF files online for free. Copy all the text or download it as a .txt file — fast, private and no uploads.",
    keywords: ["pdf to text", "extract text from pdf", "pdf to txt", "copy text from pdf"],
    intro: "Pull all selectable text out of a PDF so you can edit, search or reuse it.",
    steps: ["Upload a PDF.", "Text is extracted page by page.", "Copy it or download as .txt."],
    features: ["Page-by-page extraction", "Copy with one click", "Download as TXT", "Works with large PDFs", "Runs in your browser"],
    faqs: [
      { q: "Why is no text extracted from my PDF?", a: "Scanned PDFs contain images of text rather than real text. Those need OCR, which this tool doesn't perform." },
    ],
  },

  // =========================== IMAGE ===========================
  "compress-image": {
    title: "Compress Image Online Free – Reduce Image Size (KB)",
    description:
      "Compress JPG, PNG, WEBP and HEIC images online for free. Reduce image size to KB without visible quality loss. Batch compression, no uploads.",
    keywords: ["compress image", "reduce image size", "image compressor", "compress jpg", "compress png", "reduce photo size in kb"],
    intro:
      "Shrink photos for websites, email, forms and social media. Adjust quality, optionally resize and convert to WEBP for the smallest files.",
    steps: ["Add one or more images.", "Choose quality, resize and output format.", "Click Compress Images.", "Download each image or all of them."],
    features: ["Batch compression", "JPG, PNG, WEBP, HEIC, AVIF input", "Optional resize", "Removes EXIF metadata", "No uploads — total privacy"],
    faqs: [
      { q: "How do I reduce image size in KB?", a: "Lower the quality slider and/or resize the image. WEBP output usually gives the smallest file for the same visual quality." },
      { q: "Does compressing remove location data?", a: "Yes. Images are re-encoded through a canvas, which strips EXIF metadata such as GPS location and camera info." },
    ],
  },
  "resize-image": {
    title: "Resize Image Online Free – Change Image Size in Pixels",
    description:
      "Resize images online for free. Change width and height in pixels or by percentage, keep aspect ratio and use social media presets — no uploads.",
    keywords: ["resize image", "image resizer", "change image size", "resize photo", "resize image to 1080x1080"],
    intro: "Resize photos to exact pixel dimensions for profile pictures, passports, websites and social posts.",
    steps: ["Choose an image.", "Enter width/height, a percentage or pick a preset.", "Choose an output format.", "Download the resized image."],
    features: ["Pixel or percentage resizing", "Lock aspect ratio", "Social media presets", "JPG, PNG, WEBP output", "Private processing"],
    faqs: [
      { q: "How do I resize an image without losing quality?", a: "Reducing size keeps images sharp. Enlarging beyond the original resolution always softens detail; PNG output avoids extra compression artifacts." },
    ],
  },
  "convert-image": {
    title: "Image Converter Online Free – JPG, PNG, WEBP",
    description:
      "Convert images between JPG, PNG and WEBP online for free. Batch convert photos instantly in your browser — no uploads, no sign-up.",
    keywords: ["image converter", "convert image", "png to jpg", "jpg to png", "webp to jpg", "image format converter"],
    intro: "Change the format of one or many images at once. Choose the output format and quality, then download.",
    steps: ["Add images.", "Choose JPG, PNG or WEBP.", "Click Convert.", "Download the converted files."],
    features: ["Batch conversion", "HEIC input support", "Quality control", "Background colour for JPG", "Private processing"],
    faqs: [
      { q: "Which format should I choose?", a: "JPG for photos, PNG for graphics and transparency, WEBP for the smallest high-quality files on the web." },
    ],
  },
  "png-to-jpg": {
    title: "PNG to JPG Converter Online Free",
    description: "Convert PNG to JPG online for free. Batch convert, choose quality and background colour — instant and private, no uploads.",
    keywords: ["png to jpg", "convert png to jpg", "png to jpeg"],
    intro: "Convert PNG images into smaller JPG files. Transparent areas are filled with the background colour of your choice.",
    steps: ["Add PNG images.", "Set quality and background colour.", "Convert and download."],
    features: ["Batch conversion", "Smaller file sizes", "Custom background", "No watermark", "Runs locally"],
    faqs: [{ q: "Why convert PNG to JPG?", a: "JPG files are much smaller for photos, making them easier to email and upload." }],
  },
  "jpg-to-png": {
    title: "JPG to PNG Converter Online Free",
    description: "Convert JPG to PNG online for free. Lossless PNG output, batch conversion, private — nothing is uploaded.",
    keywords: ["jpg to png", "convert jpg to png", "jpeg to png"],
    intro: "Convert JPG photos to lossless PNG files, ideal for editing and graphics work.",
    steps: ["Add JPG images.", "Click Convert.", "Download the PNG files."],
    features: ["Lossless output", "Batch conversion", "Fast", "Free", "Private"],
    faqs: [{ q: "Does converting JPG to PNG improve quality?", a: "No — it preserves the current quality and prevents further loss when you edit and re-save." }],
  },
  "webp-to-jpg": {
    title: "WEBP to JPG Converter Online Free",
    description: "Convert WEBP images to JPG online for free. Open WEBP files anywhere — batch conversion in your browser, no uploads.",
    keywords: ["webp to jpg", "convert webp to jpg", "webp to jpeg", "webp converter"],
    intro: "Convert WEBP images saved from websites into universally compatible JPG files.",
    steps: ["Add WEBP images.", "Choose quality.", "Convert and download."],
    features: ["Batch conversion", "Adjustable quality", "Works offline", "Free", "Private"],
    faqs: [{ q: "Why can't I open WEBP files?", a: "Some older apps don't support WEBP. Converting to JPG makes them work everywhere." }],
  },
  "crop-image": {
    title: "Crop Image Online Free – Crop Photos to Any Size",
    description: "Crop images online for free. Drag to crop freely or use 1:1, 4:3, 16:9 and other ratios. Download instantly — no uploads.",
    keywords: ["crop image", "crop photo", "image cropper", "crop picture online", "crop image to square"],
    intro: "Trim photos to focus on what matters, or crop to the exact ratio needed for social media and documents.",
    steps: ["Choose an image.", "Drag the crop box or pick a ratio.", "Download the cropped image."],
    features: ["Free-form and fixed ratios", "Live pixel dimensions", "JPG, PNG, WEBP output", "Touch friendly", "Private"],
    faqs: [{ q: "How do I crop an image to a square?", a: "Select the 1:1 ratio, position the box and download." }],
  },
  "heic-to-jpg": {
    title: "HEIC to JPG Converter Online Free – iPhone Photos",
    description: "Convert HEIC to JPG online for free. Turn iPhone photos into JPG in bulk — fast, private and nothing is uploaded.",
    keywords: ["heic to jpg", "heic converter", "convert heic to jpg", "iphone photo to jpg", "heif to jpg"],
    intro: "iPhones save photos as HEIC, which many Windows apps and websites can't open. Convert them to JPG in bulk.",
    steps: ["Add HEIC/HEIF photos.", "Choose quality.", "Convert and download the JPGs."],
    features: ["Bulk conversion", "High quality output", "Works on Windows, Mac, Android", "No app install", "Photos stay on your device"],
    faqs: [{ q: "Are my iPhone photos uploaded?", a: "No. Conversion happens inside your browser, so your photos never leave your device." }],
  },
  "rotate-image": {
    title: "Rotate Image Online Free – Rotate & Flip Photos",
    description: "Rotate images 90°, 180° or flip them horizontally and vertically online for free. Mirror selfies instantly — no uploads.",
    keywords: ["rotate image", "flip image", "mirror image", "rotate photo", "flip photo horizontally"],
    h1: "Rotate & Flip Image",
    intro: "Straighten sideways photos and mirror selfies or scans in one click.",
    steps: ["Choose an image.", "Rotate or flip it.", "Download the result."],
    features: ["Rotate 90° steps", "Flip horizontal / vertical", "Live preview", "Lossless PNG option", "Private"],
    faqs: [{ q: "How do I mirror a selfie?", a: "Click Flip Horizontal and download." }],
  },
  "image-to-base64": {
    title: "Image to Base64 Converter Online Free",
    description: "Convert images to Base64 data URIs online for free. Copy ready-to-use HTML img and CSS code — processed in your browser.",
    keywords: ["image to base64", "base64 image encoder", "data uri generator", "png to base64"],
    intro: "Embed small images directly in HTML, CSS or JSON by converting them to Base64.",
    steps: ["Choose an image.", "Copy the Base64, data URI, HTML or CSS snippet."],
    features: ["Data URI output", "HTML and CSS snippets", "One-click copy", "Any image format", "Private"],
    faqs: [{ q: "When should I use Base64 images?", a: "For small icons and inline images to save HTTP requests. Large images are better served as files." }],
  },
  "color-picker": {
    title: "Image Color Picker Online – Get HEX & RGB from Image",
    description: "Pick colours from any image online. Get HEX, RGB and HSL codes and an automatic colour palette — free, private, no uploads.",
    keywords: ["color picker from image", "image color picker", "hex color from image", "eyedropper online"],
    intro: "Upload a picture and click anywhere to get the exact colour code, plus the dominant palette of the image.",
    steps: ["Choose an image.", "Click a pixel to pick its colour.", "Copy HEX, RGB or HSL."],
    features: ["Click-to-pick eyedropper", "Dominant colour palette", "HEX, RGB, HSL", "One-click copy", "Private"],
    faqs: [{ q: "How do I find the HEX code of a colour in a photo?", a: "Upload the photo, click the colour and copy the HEX value." }],
  },

  // =========================== CALCULATORS ===========================
  "online-calculator": {
    title: "Online Calculator – Free Basic & Scientific Calculator",
    description: "Free online calculator with scientific functions: sin, cos, tan, log, powers, roots, percentages and memory. Works with your keyboard, with calculation history.",
    keywords: ["calculator", "online calculator", "scientific calculator", "free calculator", "calculator online"],
    intro: "A fast calculator for everyday sums and scientific maths. Type with your keyboard or tap the buttons, and see your history as you go.",
    steps: ["Tap buttons or type an expression.", "Press = or Enter.", "Switch to Scientific for trig, logs and powers."],
    features: ["Basic and scientific modes", "Keyboard support", "Calculation history", "Degrees and radians", "Correct order of operations"],
    faqs: [
      { q: "Does it follow the order of operations?", a: "Yes. Multiplication and division are done before addition and subtraction, and brackets are respected (BODMAS / PEMDAS)." },
      { q: "Can I use my keyboard?", a: "Yes. Type numbers and + − × ÷ ( ) ^ %, press Enter for the result, Backspace to delete and Escape to clear." },
    ],
  },
  "age-calculator": {
    title: "Age Calculator – Calculate Exact Age by Date of Birth",
    description: "Free age calculator. Find your exact age in years, months, days, weeks and hours, plus a countdown to your next birthday.",
    keywords: ["age calculator", "calculate age", "how old am i", "date of birth calculator", "age in days"],
    intro: "Enter a date of birth to see the exact age today — or on any date — along with total days lived and days until the next birthday.",
    steps: ["Enter the date of birth.", "Optionally change the 'age on' date.", "Read your exact age instantly."],
    features: ["Years, months and days", "Total weeks, days and hours", "Next birthday countdown", "Day of the week you were born", "Instant results"],
    faqs: [
      { q: "How is age calculated?", a: "We count complete years, then remaining complete months, then remaining days between the birth date and the selected date — the same way age is counted on official documents." },
    ],
  },
  "bmi-calculator": {
    title: "BMI Calculator – Body Mass Index (kg/cm or lb/ft)",
    description: "Free BMI calculator for adults. Calculate your body mass index in metric or imperial units and see your healthy weight range.",
    keywords: ["bmi calculator", "body mass index", "calculate bmi", "bmi chart", "healthy weight calculator"],
    intro: "Body Mass Index is a quick screening measure that compares weight to height. Enter your details to get your BMI and the healthy weight range for your height.",
    steps: ["Choose metric or imperial units.", "Enter height and weight.", "See your BMI and category."],
    features: ["Metric and imperial", "WHO categories", "Healthy weight range", "Visual scale", "Instant"],
    faqs: [
      { q: "What is a healthy BMI?", a: "For adults, the WHO classifies 18.5–24.9 as a healthy weight, 25–29.9 as overweight and 30+ as obese." },
      { q: "Is BMI accurate?", a: "BMI doesn't distinguish muscle from fat, so athletes may read high. It's a screening tool, not a diagnosis — consult a health professional for advice." },
    ],
  },
  "percentage-calculator": {
    title: "Percentage Calculator – Percent of, Change & Difference",
    description: "Free percentage calculator. Find X% of Y, what percent X is of Y, and percentage increase or decrease — with the formula shown.",
    keywords: ["percentage calculator", "percent calculator", "percentage increase calculator", "percentage change", "what percent of"],
    intro: "Solve every common percentage question in one place, with the working shown so you can learn the formula.",
    steps: ["Pick the type of calculation.", "Enter your numbers.", "Read the answer and formula."],
    features: ["X% of Y", "X is what % of Y", "Percentage change", "Formula shown", "Instant results"],
    faqs: [{ q: "How do I calculate percentage increase?", a: "Subtract the old value from the new value, divide by the old value and multiply by 100." }],
  },
  "loan-calculator": {
    title: "Loan & EMI Calculator – Monthly Payment & Interest",
    description: "Free loan EMI calculator. Calculate monthly payments, total interest and a full amortization schedule for home, car and personal loans.",
    keywords: ["loan calculator", "emi calculator", "mortgage calculator", "car loan calculator", "loan repayment calculator"],
    h1: "Loan & EMI Calculator",
    intro: "Plan any loan: enter the amount, interest rate and term to see your monthly instalment (EMI), total interest and repayment schedule.",
    steps: ["Enter loan amount.", "Enter annual interest rate.", "Enter term in years or months.", "Review EMI and schedule."],
    features: ["Monthly EMI", "Total interest and cost", "Yearly amortization table", "Works for any currency", "Instant"],
    faqs: [{ q: "What formula is used for EMI?", a: "EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P is the principal, r the monthly interest rate and n the number of months." }],
  },
  "compound-interest-calculator": {
    title: "Compound Interest Calculator – Savings & Investment Growth",
    description: "Free compound interest calculator with monthly contributions. See how your savings or investments grow over time.",
    keywords: ["compound interest calculator", "investment calculator", "savings calculator", "interest calculator"],
    intro: "See the power of compounding. Enter a starting amount, regular contributions, rate and time period.",
    steps: ["Enter initial amount and monthly contribution.", "Enter interest rate and years.", "Choose compounding frequency.", "See the growth table."],
    features: ["Monthly contributions", "Compounding frequency", "Year-by-year table", "Interest vs contributions", "Any currency"],
    faqs: [{ q: "What is compound interest?", a: "Interest earned on both your original money and on interest already added — so growth accelerates over time." }],
  },
  "tip-calculator": {
    title: "Tip Calculator – Split the Bill & Tip per Person",
    description: "Free tip calculator. Work out the tip and split the bill between any number of people, with rounding options.",
    keywords: ["tip calculator", "split bill calculator", "gratuity calculator", "restaurant tip"],
    intro: "Quickly calculate the tip and each person's share at restaurants, cafés and deliveries.",
    steps: ["Enter the bill amount.", "Choose a tip percentage.", "Enter the number of people."],
    features: ["Quick tip presets", "Bill splitting", "Round up per person", "Any currency", "Instant"],
    faqs: [{ q: "How much should I tip?", a: "Customs vary by country; 10–20% is common in many places for table service." }],
  },
  "discount-calculator": {
    title: "Discount Calculator – Sale Price & Percent Off",
    description: "Free discount calculator. Find the sale price and how much you save after a percentage discount, including double discounts.",
    keywords: ["discount calculator", "sale price calculator", "percent off calculator", "price after discount"],
    intro: "Find the final price after a discount, and how much you save — including stacked discounts like 20% + 10%.",
    steps: ["Enter the original price.", "Enter the discount %.", "Optionally add a second discount."],
    features: ["Sale price", "Amount saved", "Stacked discounts", "Effective discount", "Instant"],
    faqs: [{ q: "Is 20% + 10% the same as 30% off?", a: "No. Stacked discounts apply one after another, so 20% then 10% equals 28% off in total." }],
  },
  "date-calculator": {
    title: "Date Calculator – Days Between Dates & Add Days",
    description: "Free date calculator. Count days, weeks and months between two dates, or add and subtract days from a date. Includes business days.",
    keywords: ["days between dates", "date calculator", "date difference", "add days to date", "business days calculator"],
    h1: "Date Difference Calculator",
    intro: "Count the exact number of days between two dates — including working days — or find the date a number of days from now.",
    steps: ["Choose between 'difference' and 'add/subtract'.", "Pick your dates or number of days.", "Read the result instantly."],
    features: ["Days, weeks, months, years", "Business days (Mon–Fri)", "Add or subtract days", "Include end date option", "Instant"],
    faqs: [{ q: "Does the count include the end date?", a: "By default the end date is not included. Tick 'Include end date' to add it." }],
  },
  "gpa-calculator": {
    title: "GPA Calculator – Calculate Semester & Cumulative GPA",
    description: "Free GPA calculator on a 4.0 scale. Add courses, credits and grades to calculate your semester or cumulative GPA.",
    keywords: ["gpa calculator", "cgpa calculator", "grade point average", "college gpa calculator"],
    intro: "Add each course with its credit hours and letter grade to get a weighted GPA on the 4.0 scale.",
    steps: ["Add your courses.", "Enter credits and select grades.", "Optionally include previous GPA and credits."],
    features: ["4.0 scale", "Weighted by credits", "Cumulative GPA", "Unlimited courses", "Instant"],
    faqs: [{ q: "How is GPA calculated?", a: "Multiply each grade point by its credits, add them up and divide by total credits." }],
  },
  "calorie-calculator": {
    title: "Calorie Calculator – BMR & TDEE Daily Calories",
    description: "Free calorie calculator. Estimate your BMR and daily calorie needs (TDEE) to maintain, lose or gain weight using Mifflin-St Jeor.",
    keywords: ["calorie calculator", "tdee calculator", "bmr calculator", "daily calorie intake", "calories to lose weight"],
    intro: "Estimate how many calories you burn per day and how much to eat for your goal.",
    steps: ["Enter age, sex, height and weight.", "Choose your activity level.", "See calories for your goal."],
    features: ["Mifflin-St Jeor formula", "BMR and TDEE", "Lose / maintain / gain targets", "Metric and imperial", "Instant"],
    faqs: [{ q: "How accurate is this?", a: "It's an estimate for healthy adults. Individual needs vary; consult a professional for medical advice." }],
  },
  "vat-calculator": {
    title: "VAT Calculator – Add or Remove VAT / Sales Tax",
    description: "Free VAT and sales tax calculator. Add tax to a net price or remove it from a gross price at any rate, including GST.",
    keywords: ["vat calculator", "sales tax calculator", "gst calculator", "remove vat", "add vat"],
    h1: "VAT & Sales Tax Calculator",
    intro: "Work out prices with or without VAT, GST or sales tax for invoices, quotes and shopping.",
    steps: ["Enter a price.", "Enter the tax rate.", "Choose add or remove tax."],
    features: ["Add or remove tax", "Any rate", "Net, tax and gross shown", "Works for VAT, GST, sales tax", "Instant"],
    faqs: [{ q: "How do I remove VAT from a price?", a: "Divide the gross price by (1 + rate/100). For 20% VAT, divide by 1.2." }],
  },
  "ebay-fee-calculator": {
    title: "eBay Fee Calculator – Profit, ROI & Margin",
    description: "Free eBay fee and profit calculator. Calculate final value fees, payment fees, profit, ROI and margin — or the price you need for a target profit.",
    keywords: ["ebay fee calculator", "ebay profit calculator", "ebay fees", "ebay selling fees", "ebay roi calculator"],
    intro: "Know your real profit before you list. Enter your costs and selling price, or set a target profit and let the calculator find the price.",
    steps: ["Choose a calculation goal.", "Enter item cost, shipping and fees.", "Review profit, ROI and margin."],
    features: ["Final value & payment fees", "Profit, ROI and margin", "Target profit pricing", "Shipping costs", "Instant"],
    faqs: [{ q: "Are eBay fees the same for every category?", a: "No. Fee percentages vary by category and seller level, so adjust the fee rate to match your category." }],
  },

  // =========================== CONVERTERS ===========================
  "currency-converter": {
    title: "Currency Converter – Live Exchange Rates (USD, LKR, EUR, INR)",
    description: "Free currency converter with daily exchange rates for 160+ currencies. Convert USD to LKR, EUR, INR, GBP, AED and more instantly.",
    keywords: ["currency converter", "exchange rate", "usd to lkr", "dollar rate", "euro to lkr", "currency exchange calculator"],
    intro: "Convert between 160+ world currencies using daily reference exchange rates, and compare one amount against several currencies at once.",
    steps: ["Enter an amount.", "Choose the currencies to convert from and to.", "See the result and the rate."],
    features: ["160+ currencies", "Rates updated daily", "Compare many currencies at once", "Works offline with the last rates", "No sign-up"],
    faqs: [
      { q: "Where do the exchange rates come from?", a: "Rates are daily reference rates from ExchangeRate-API's open data. They're ideal for estimates; banks and money changers add their own margin." },
      { q: "Is my amount sent anywhere?", a: "No. Your browser downloads the rate table once, and all conversions are calculated on your device." },
    ],
  },
  "unit-converter": {
    title: "Unit Converter – Length, Weight, Temperature & More",
    description: "Free unit converter. Convert cm to inches, kg to lbs, Celsius to Fahrenheit, litres, speed, area, data and time instantly.",
    keywords: ["unit converter", "cm to inches", "kg to lbs", "celsius to fahrenheit", "measurement converter"],
    intro: "Convert between metric and imperial units across 9 categories, with all results updated as you type.",
    steps: ["Pick a category.", "Enter a value and choose the unit.", "See it converted to every other unit."],
    features: ["9 categories", "100+ units", "All conversions at once", "Copy any result", "Works offline"],
    faqs: [{ q: "How many centimetres are in an inch?", a: "Exactly 2.54 centimetres." }],
  },
  "time-zone-converter": {
    title: "Time Zone Converter – Convert Time Between Cities",
    description: "Free time zone converter. Convert a time between any cities and time zones worldwide, with automatic daylight saving time.",
    keywords: ["time zone converter", "time converter", "est to ist", "utc converter", "world clock"],
    intro: "Schedule meetings across countries. Pick a time in one zone and see it in others, with daylight saving handled automatically.",
    steps: ["Choose a date and time.", "Pick the source time zone.", "Add zones to compare."],
    features: ["400+ time zones", "Automatic DST", "Compare multiple zones", "Uses your device clock", "Instant"],
    faqs: [{ q: "Does it handle daylight saving time?", a: "Yes, it uses your browser's built-in time zone database." }],
  },
  "timestamp-converter": {
    title: "Unix Timestamp Converter – Epoch to Date & Back",
    description: "Free Unix timestamp converter. Convert epoch seconds or milliseconds to human-readable dates and dates back to timestamps.",
    keywords: ["unix timestamp converter", "epoch converter", "timestamp to date", "date to timestamp"],
    intro: "Convert Unix epoch time to readable dates in UTC and your local time, and vice versa.",
    steps: ["Paste a timestamp, or pick a date.", "Read the conversion in UTC, local and ISO formats."],
    features: ["Seconds and milliseconds", "UTC, local, ISO 8601", "Live current timestamp", "Relative time", "Copy buttons"],
    faqs: [{ q: "What is a Unix timestamp?", a: "The number of seconds since 00:00:00 UTC on 1 January 1970." }],
  },
  "number-base-converter": {
    title: "Number Base Converter – Binary, Hex, Decimal, Octal",
    description: "Free number base converter. Convert between binary, octal, decimal, hexadecimal and any base from 2 to 36 — supports huge numbers.",
    keywords: ["binary to decimal", "decimal to binary", "hex to decimal", "number base converter", "binary converter"],
    intro: "Type in any field and the number is converted to every other base instantly.",
    steps: ["Type a number into any base field.", "See the other bases update."],
    features: ["Binary, octal, decimal, hex", "Custom base 2–36", "Arbitrary precision", "Input validation", "Copy buttons"],
    faqs: [{ q: "How do I convert binary to decimal?", a: "Each binary digit is a power of two; add the powers where the digit is 1. Or type it here." }],
  },
  "color-converter": {
    title: "Color Converter – HEX to RGB, RGB to HSL",
    description: "Free colour converter. Convert HEX, RGB and HSL colour codes with a live picker and CSS-ready values.",
    keywords: ["hex to rgb", "rgb to hex", "color converter", "hsl to hex", "color code converter"],
    intro: "Convert colour codes for CSS, design tools and apps, with a live preview and shades.",
    steps: ["Pick a colour or type a code.", "Copy HEX, RGB or HSL."],
    features: ["HEX, RGB, HSL", "Visual picker", "Tints and shades", "Contrast check", "Copy CSS"],
    faqs: [{ q: "How do I convert HEX to RGB?", a: "Split the HEX into three pairs and convert each from base 16 to decimal — or paste it here." }],
  },

  // =========================== TEXT ===========================
  "fancy-text-generator": {
    title: "Fancy Text Generator – Cool Fonts for Instagram & TikTok (Copy & Paste)",
    description: "Free fancy text generator. Turn your text into 𝐛𝐨𝐥𝐝, 𝓈𝒸𝓇𝒾𝓅𝓉, 𝔤𝔬𝔱𝔥𝔦𝔠, ⓑⓤⓑⓑⓛⓔ and more stylish fonts to copy and paste into Instagram, TikTok, WhatsApp and bios.",
    keywords: ["fancy text generator", "font generator", "instagram fonts", "cool fonts", "stylish text", "copy and paste fonts"],
    intro: "Type once and get dozens of stylish fonts you can copy and paste anywhere — Instagram bios, TikTok, WhatsApp, Discord and gaming names.",
    steps: ["Type your text.", "Scroll through the styles.", "Tap Copy and paste it anywhere."],
    features: ["25+ font styles", "One-tap copy", "Works in Instagram, TikTok, WhatsApp", "Decorations and frames", "No app needed"],
    faqs: [
      { q: "How do fancy fonts work?", a: "They use special Unicode characters that look like styled letters, so they work anywhere you can paste text — no font installation needed." },
      { q: "Why do some styles show boxes?", a: "Older devices may not support every Unicode symbol. Bold, italic and script styles work almost everywhere." },
    ],
  },
  "singlish-to-sinhala": {
    title: "Singlish to Sinhala Converter – Type Sinhala Unicode Online",
    description: "Free Singlish to Sinhala converter. Type Sinhala Unicode using English letters (mama → මම, kohomada → කොහොමද) and copy it to Facebook, WhatsApp or Word.",
    keywords: ["singlish to sinhala", "sinhala typing", "sinhala unicode converter", "english to sinhala typing", "type sinhala online", "sinhala keyboard"],
    h1: "Singlish to Sinhala Converter",
    intro: "Type Sinhala the easy way: write words phonetically in English letters and they turn into Sinhala Unicode instantly. Copy the result into Facebook, WhatsApp, Word or anywhere else.",
    steps: ["Type Sinhala words using English letters (e.g. kohomada).", "See the Sinhala Unicode appear live.", "Copy the Sinhala text and paste it anywhere."],
    features: ["Live phonetic conversion", "Full vowel sign (pili) support", "Cheat sheet of all letters", "Real Unicode — works everywhere", "Nothing is sent online"],
    faqs: [
      { q: "How do I type ං (binduwa) and ශ්‍රී?", a: "Type x for ං (e.g. laxkaa → ලංකා), and shrii for ශ්‍රී. The cheat sheet under the converter lists every letter." },
      { q: "What's the difference between t and th?", a: "t gives ට and th gives ත. Similarly d gives ද and D gives ඩ (e.g. gedara → ගෙදර, paaDam → පාඩම්). Other capitals give related sounds: T → ඨ, N → ණ, L → ළ, B → ඹ." },
      { q: "Is this Unicode or FM font text?", a: "It's standard Sinhala Unicode, which works in every modern app and website without installing fonts." },
    ],
  },
  "word-counter": {
    title: "Word Counter – Count Words & Characters Online",
    description: "Free word counter. Count words, characters (with and without spaces), sentences, paragraphs and reading time as you type.",
    keywords: ["word counter", "character counter", "word count", "count characters", "letter counter"],
    intro: "Paste or type text to get live word and character counts — perfect for essays, social posts, SEO titles and meta descriptions.",
    steps: ["Type or paste your text.", "Counts update instantly."],
    features: ["Words, characters, sentences", "Reading and speaking time", "Top keywords", "Social media limits", "Text stays on your device"],
    faqs: [{ q: "Is my text saved?", a: "No. Your text is processed in your browser and never sent anywhere." }],
  },
  "case-converter": {
    title: "Case Converter – Uppercase, Lowercase, Title Case",
    description: "Free case converter. Change text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case and more.",
    keywords: ["case converter", "uppercase to lowercase", "title case converter", "lowercase converter", "capitalize text"],
    intro: "Fix accidental caps lock or format text for headlines and code in one click.",
    steps: ["Paste your text.", "Click a case style.", "Copy the result."],
    features: ["10 case styles", "Code cases (camel, snake, kebab)", "One-click copy", "Instant", "Private"],
    faqs: [{ q: "What is Title Case?", a: "Each major word starts with a capital letter, like a book title." }],
  },
  "diff-checker": {
    title: "Diff Checker – Compare Text Online",
    description: "Free online diff checker. Compare two texts side by side and highlight added, removed and changed lines — private, in your browser.",
    keywords: ["diff checker", "compare text", "text compare", "find difference between two texts"],
    intro: "Paste two versions of a document or code to see exactly what changed.",
    steps: ["Paste the original text.", "Paste the changed text.", "Review highlighted differences."],
    features: ["Line-by-line diff", "Added / removed highlighting", "Ignore whitespace option", "Change summary", "Private"],
    faqs: [{ q: "Is my text uploaded?", a: "No, the comparison runs entirely in your browser." }],
  },
  "remove-duplicate-lines": {
    title: "Remove Duplicate Lines Online – Dedupe & Sort Lists",
    description: "Remove duplicate lines from text for free. Also sort, trim, remove empty lines and ignore case — clean any list in seconds.",
    keywords: ["remove duplicate lines", "dedupe list", "remove duplicates", "sort lines", "unique lines"],
    intro: "Clean up email lists, keywords, CSV columns and logs.",
    steps: ["Paste your list.", "Choose options.", "Copy the cleaned list."],
    features: ["Remove duplicates", "Sort A–Z / Z–A", "Trim whitespace", "Remove empty lines", "Case-insensitive mode"],
    faqs: [{ q: "Does it keep the original order?", a: "Yes, unless you choose to sort. The first occurrence of each line is kept." }],
  },
  "lorem-ipsum-generator": {
    title: "Lorem Ipsum Generator – Placeholder Text",
    description: "Free Lorem Ipsum generator. Create placeholder paragraphs, sentences or words for designs and mockups, with optional HTML tags.",
    keywords: ["lorem ipsum generator", "placeholder text", "dummy text generator", "lorem ipsum"],
    intro: "Generate classic Lorem Ipsum filler text for websites, layouts and prototypes.",
    steps: ["Choose paragraphs, sentences or words.", "Set the amount.", "Copy the text."],
    features: ["Paragraphs, sentences, words", "Start with 'Lorem ipsum'", "HTML <p> tags option", "One-click copy", "Instant"],
    faqs: [{ q: "What does Lorem Ipsum mean?", a: "It's scrambled Latin from Cicero's 'de Finibus', used since the 1500s as filler text." }],
  },
  "typing-speed-test": {
    title: "Typing Speed Test – Check Your WPM & Accuracy",
    description: "Free typing speed test. Measure your words per minute (WPM) and accuracy in 30, 60 or 120 seconds and improve your keyboard skills.",
    keywords: ["typing speed test", "wpm test", "typing test", "words per minute test", "typing practice"],
    intro: "Find out how fast you type. Start typing the paragraph and see your WPM and accuracy in real time.",
    steps: ["Choose a duration.", "Start typing the text shown.", "See your WPM and accuracy."],
    features: ["Real-time WPM", "Accuracy tracking", "Multiple durations", "Random paragraphs", "No sign-up"],
    faqs: [{ q: "What is a good typing speed?", a: "Average is about 40 WPM. 60+ WPM is above average and 80+ is excellent." }],
  },

  // =========================== GENERATORS ===========================
  "password-generator": {
    title: "Password Generator – Strong Random Passwords",
    description: "Free strong password generator. Create secure random passwords and passphrases with custom length and symbols — generated on your device.",
    keywords: ["password generator", "strong password generator", "random password", "secure password", "passphrase generator"],
    intro: "Generate uncrackable passwords using your browser's cryptographically secure random generator. Nothing is sent or stored.",
    steps: ["Choose length and character types.", "Copy the generated password."],
    features: ["Crypto-secure randomness", "Length 4–128", "Passphrase mode", "Strength meter", "Never transmitted"],
    faqs: [
      { q: "Are generated passwords stored?", a: "No. Passwords are created in your browser using crypto.getRandomValues and are never sent or saved." },
      { q: "How long should a password be?", a: "At least 14–16 characters for important accounts. Use a password manager to store them." },
    ],
  },
  "qr-code-generator": {
    title: "QR Code Generator Free – URL, Wi-Fi, Text (No Expiry)",
    description: "Free QR code generator with no sign-up and no expiry. Create QR codes for links, Wi-Fi, text, email, phone and vCards. Download PNG or SVG.",
    keywords: ["qr code generator", "free qr code generator", "wifi qr code", "qr code maker", "qr code for link"],
    intro: "Create static QR codes that never expire and aren't tracked. Customise colours and download in high resolution.",
    steps: ["Choose a QR type.", "Enter the content.", "Customise colours and size.", "Download PNG or SVG."],
    features: ["URL, Wi-Fi, text, email, phone, vCard", "Never expires", "No tracking or redirects", "PNG & SVG", "Custom colours"],
    faqs: [
      { q: "Do these QR codes expire?", a: "No. They are static — the content is encoded directly in the code, with no redirect service in between." },
      { q: "Can I use them commercially?", a: "Yes, free for any use." },
    ],
  },
  "spin-the-wheel": {
    title: "Spin the Wheel – Random Name Picker Wheel",
    description: "Free spin the wheel random picker. Add names or options, spin and pick a winner for giveaways, classrooms, games and decisions.",
    keywords: ["spin the wheel", "wheel of names", "random name picker", "wheel spinner", "decision wheel"],
    intro: "Add entries, spin the wheel and let chance decide. Great for raffles, classroom picks and team decisions.",
    steps: ["Enter one option per line.", "Click Spin.", "Remove the winner or spin again."],
    features: ["Unlimited entries", "Fair random results", "Remove winner option", "Shuffle", "Your list is saved on your device"],
    faqs: [{ q: "Is the wheel truly random?", a: "Yes. The result is chosen with the browser's cryptographic random number generator before the animation runs." }],
  },
  "random-number-generator": {
    title: "Random Number Generator – Pick Random Numbers",
    description: "Free random number generator. Generate one or many random numbers in any range, with or without repeats, plus dice and coin flips.",
    keywords: ["random number generator", "rng", "random number picker", "pick a number", "lottery number generator"],
    intro: "Generate fair random numbers for draws, games, sampling and decisions.",
    steps: ["Set minimum and maximum.", "Choose how many numbers.", "Click Generate."],
    features: ["Any range", "No-repeat option", "Sort results", "Crypto-secure", "Coin flip & dice"],
    faqs: [{ q: "Is it truly random?", a: "It uses crypto.getRandomValues, a cryptographically secure source of randomness." }],
  },
  "uuid-generator": {
    title: "UUID Generator – Random v4 UUID / GUID",
    description: "Free UUID v4 generator. Generate one or thousands of random UUIDs/GUIDs, uppercase or without hyphens, and copy them instantly.",
    keywords: ["uuid generator", "guid generator", "uuid v4", "random uuid"],
    intro: "Generate RFC 4122 version 4 UUIDs for databases, APIs and testing.",
    steps: ["Choose how many UUIDs.", "Select format options.", "Copy or download."],
    features: ["Bulk generation", "Uppercase option", "No-hyphen option", "Crypto-secure", "Download as .txt"],
    faqs: [{ q: "Can two UUIDs collide?", a: "Practically never — there are 2¹²² possible v4 UUIDs." }],
  },

  // =========================== DEVELOPER ===========================
  "json-formatter": {
    title: "JSON Formatter & Validator Online – Beautify JSON",
    description: "Free JSON formatter and validator. Beautify, minify and validate JSON with clear error messages — your data never leaves your browser.",
    keywords: ["json formatter", "json validator", "json beautifier", "format json", "json pretty print"],
    intro: "Paste JSON to pretty-print it, find syntax errors with line numbers, or minify it for production.",
    steps: ["Paste your JSON.", "Click Format, Minify or Validate.", "Copy or download the result."],
    features: ["Beautify with 2/4 spaces or tabs", "Minify", "Error line & column", "Sort keys", "Private — no server"],
    faqs: [{ q: "Is my JSON sent to a server?", a: "No. Formatting uses your browser's built-in JSON parser." }],
  },
  "base64-encoder": {
    title: "Base64 Encode & Decode Online",
    description: "Free Base64 encoder and decoder. Convert text to Base64 and back with full UTF-8 and URL-safe support — runs in your browser.",
    keywords: ["base64 encode", "base64 decode", "base64 converter", "base64 to text"],
    h1: "Base64 Encode / Decode",
    intro: "Encode text to Base64 or decode Base64 strings, including emoji and non-Latin characters.",
    steps: ["Choose Encode or Decode.", "Paste your text.", "Copy the result."],
    features: ["UTF-8 safe", "URL-safe variant", "Live conversion", "Swap input/output", "Private"],
    faqs: [{ q: "Is Base64 encryption?", a: "No. Base64 is an encoding, not encryption — anyone can decode it." }],
  },
  "url-encoder": {
    title: "URL Encode & Decode Online",
    description: "Free URL encoder and decoder. Percent-encode text for URLs and query strings, or decode encoded URLs — instant and private.",
    keywords: ["url encode", "url decode", "percent encoding", "urlencode online"],
    h1: "URL Encode / Decode",
    intro: "Safely encode special characters for use in URLs, or decode %20-style strings back to readable text.",
    steps: ["Choose Encode or Decode.", "Paste text.", "Copy the result."],
    features: ["Component and full-URL modes", "Live conversion", "Query string parser", "Copy button", "Private"],
    faqs: [{ q: "What is the difference between encodeURI and encodeURIComponent?", a: "encodeURIComponent also encodes characters like / ? & = and is used for query parameter values." }],
  },
  "hash-generator": {
    title: "Hash Generator – MD5, SHA-1, SHA-256, SHA-512",
    description: "Free hash generator. Create MD5, SHA-1, SHA-256 and SHA-512 hashes of text or files to verify checksums — computed locally.",
    keywords: ["hash generator", "md5 generator", "sha256 generator", "checksum calculator", "file hash"],
    intro: "Generate cryptographic hashes for text or files and verify downloads against published checksums.",
    steps: ["Type text or choose a file.", "Copy the hash you need.", "Optionally paste a checksum to compare."],
    features: ["MD5, SHA-1, SHA-256, SHA-384, SHA-512", "Text or file input", "Checksum compare", "Uppercase option", "Private"],
    faqs: [{ q: "Is MD5 secure?", a: "MD5 and SHA-1 are fine for checksums but not for passwords or security. Use SHA-256 or stronger." }],
  },
  "jwt-decoder": {
    title: "JWT Decoder – Decode JSON Web Tokens Online",
    description: "Free JWT decoder. Decode JSON Web Token header and payload, check expiry times — decoded locally, your token is never sent.",
    keywords: ["jwt decoder", "decode jwt", "jwt parser", "json web token decoder"],
    intro: "Inspect the header and claims of a JWT, with human-readable issued/expiry times.",
    steps: ["Paste your JWT.", "View header, payload and expiry."],
    features: ["Header & payload", "Expiry status", "Readable timestamps", "Never transmitted", "Copy JSON"],
    faqs: [{ q: "Does it verify the signature?", a: "No. Signature verification needs the secret or public key; this tool only decodes." }],
  },
  "regex-tester": {
    title: "Regex Tester Online – Test Regular Expressions",
    description: "Free regex tester. Test JavaScript regular expressions with live match highlighting, capture groups and replace preview.",
    keywords: ["regex tester", "regular expression tester", "regex online", "test regex"],
    intro: "Write a pattern, paste test text and see matches highlighted instantly with all capture groups.",
    steps: ["Enter a regex pattern and flags.", "Paste test text.", "Inspect matches and groups."],
    features: ["Live highlighting", "Capture groups", "Replace preview", "Flags g, i, m, s, u", "Common pattern library"],
    faqs: [{ q: "Which regex flavour is used?", a: "JavaScript (ECMAScript) regular expressions." }],
  },

  // =========================== AUDIO ===========================
  "speech-to-text": {
    title: "Speech to Text Online Free – Voice Typing in 60+ Languages",
    description: "Free speech to text converter. Dictate and transcribe voice to text in English, Sinhala, Tamil, Hindi, Spanish and 60+ languages. No sign-up.",
    keywords: ["speech to text", "voice to text", "voice typing", "dictation online", "sinhala speech to text", "tamil voice typing"],
    intro: "Speak and watch your words appear. Great for notes, emails, essays and accessibility — then copy or download the text.",
    steps: ["Choose your language.", "Click Start and allow microphone access.", "Speak clearly.", "Copy or download the transcript."],
    features: ["60+ languages", "Live transcription", "Copy & download", "Punctuation by voice", "No account needed"],
    faqs: [
      { q: "Which browser works best?", a: "Google Chrome and Microsoft Edge offer the best speech recognition support." },
      { q: "Is my voice recorded?", a: "We don't record or store anything. Note that the browser's built-in speech service (e.g. Chrome) may process audio on its provider's servers to recognise speech." },
    ],
  },
  "text-to-speech": {
    title: "Text to Speech Online Free – Natural Voices",
    description: "Free text to speech reader. Convert text to natural-sounding speech in many languages and voices, adjust speed and pitch — no sign-up.",
    keywords: ["text to speech", "tts online", "read aloud", "text to voice", "free text to speech"],
    intro: "Listen to articles, proofread your writing or help with accessibility. Choose a voice, set speed and press play.",
    steps: ["Paste your text.", "Choose a voice and speed.", "Press Play."],
    features: ["Many voices and languages", "Speed and pitch control", "Pause and resume", "Word highlighting", "No sign-up"],
    faqs: [{ q: "Why do voices differ between devices?", a: "Voices come from your operating system and browser, so Windows, macOS, Android and iOS each offer different ones." }],
  },
  "voice-recorder": {
    title: "Online Voice Recorder – Record Audio Free",
    description: "Free online voice recorder. Record audio from your microphone, play it back and download — recordings stay on your device.",
    keywords: ["voice recorder", "online voice recorder", "audio recorder", "record audio online", "mic recorder"],
    intro: "Record voice memos, podcasts or interviews straight from your browser. Nothing is uploaded.",
    steps: ["Click Record and allow microphone access.", "Pause or stop when done.", "Play back and download."],
    features: ["One-click recording", "Live waveform", "Pause and resume", "Download recording", "Never uploaded"],
    faqs: [{ q: "Where are my recordings saved?", a: "Only in your browser's memory until you download them. Closing the tab discards them." }],
  },
  "screen-recorder": {
    title: "Online Screen Recorder – Record Screen Free, No Install",
    description: "Free online screen recorder. Record your screen, a window or a browser tab with audio — no download, no watermark, no time limit.",
    keywords: ["screen recorder", "online screen recorder", "record screen", "screen capture", "screen recorder no watermark"],
    intro: "Capture tutorials, bug reports and presentations directly in your browser, with optional microphone audio.",
    steps: ["Click Start Recording.", "Choose a screen, window or tab.", "Stop and download the video."],
    features: ["No install or extension", "Optional microphone", "No watermark", "No time limit", "Video stays on your device"],
    faqs: [{ q: "Does it work on phones?", a: "Screen recording in the browser is supported on desktop Chrome, Edge, Firefox and Safari. Mobile browsers usually don't allow it." }],
  },

  // =========================== PRODUCTIVITY ===========================
  "pomodoro-timer": {
    title: "Pomodoro Timer Online – Focus Timer 25/5",
    description: "Free Pomodoro timer. Work in focused 25-minute sessions with short and long breaks, sound alerts and custom durations.",
    keywords: ["pomodoro timer", "focus timer", "study timer", "tomato timer", "25 minute timer"],
    intro: "Beat procrastination with the Pomodoro Technique: focus for 25 minutes, take a 5-minute break, repeat.",
    steps: ["Press Start to begin a focus session.", "Take a break when the alarm rings.", "Repeat; take a long break every 4 sessions."],
    features: ["Custom durations", "Auto-switch sessions", "Sound alert", "Timer in tab title", "Session counter"],
    faqs: [{ q: "What is the Pomodoro Technique?", a: "A time-management method using 25-minute focus intervals separated by short breaks." }],
  },
  stopwatch: {
    title: "Online Stopwatch – Free Stopwatch with Laps",
    description: "Free online stopwatch with lap times and millisecond accuracy. Full-screen friendly, keyboard shortcuts, works offline.",
    keywords: ["stopwatch", "online stopwatch", "stopwatch with laps", "timer"],
    h1: "Online Stopwatch",
    intro: "A precise stopwatch for workouts, cooking, studying and experiments.",
    steps: ["Press Start (or Space).", "Record laps with L.", "Reset with R."],
    features: ["Millisecond precision", "Lap and split times", "Keyboard shortcuts", "Keeps running in background", "Big readable display"],
    faqs: [{ q: "Does it keep running if I switch tabs?", a: "Yes, it measures real elapsed time so it stays accurate." }],
  },
  "countdown-timer": {
    title: "Countdown Timer Online – Set a Timer with Alarm",
    description: "Free online countdown timer with alarm. Set minutes and seconds or use presets like 1, 5, 10 and 30 minutes.",
    keywords: ["countdown timer", "online timer", "timer with alarm", "5 minute timer", "10 minute timer"],
    intro: "Set a timer for cooking, exercise, exams or presentations and get an alarm when time's up.",
    steps: ["Enter time or choose a preset.", "Press Start.", "Hear the alarm when it ends."],
    features: ["Quick presets", "Alarm sound", "Pause and resume", "Time in tab title", "Works offline"],
    faqs: [{ q: "Will the alarm sound if the tab is in the background?", a: "Yes, as long as the tab stays open and your device isn't muted." }],
  },
  "online-notepad": {
    title: "Online Notepad – Free Private Notes in Your Browser",
    description: "Free online notepad that autosaves to your own browser. No sign-up, no cloud — download notes as .txt anytime.",
    keywords: ["online notepad", "notepad online", "online notes", "text editor online"],
    intro: "A distraction-free notepad that saves automatically in your browser's local storage — we never see your notes.",
    steps: ["Start typing.", "Notes autosave on this device.", "Download as .txt when needed."],
    features: ["Autosave locally", "Multiple notes", "Word count", "Download .txt", "Never leaves your device"],
    faqs: [{ q: "Where are my notes stored?", a: "Only in your browser's local storage on this device. Clearing browser data deletes them, so download anything important." }],
  },
};

export const getContent = (slug: string): ToolContent => {
  const c = toolContent[slug];
  if (!c) throw new Error(`Missing content for tool: ${slug}`);
  return c;
};

/** Generic FAQs appended to every tool for E-E-A-T and long-tail coverage. */
export const commonFaqs = (name: string): FAQ[] => [
  { q: `Is ${name} free?`, a: `Yes. ${name} is 100% free with no sign-up, no watermark and no usage limits.` },
  { q: "Is it private and secure?", a: browser },
];
