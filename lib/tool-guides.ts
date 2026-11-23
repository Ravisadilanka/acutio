/**
 * Long-form, genuinely useful guides shown on high-traffic tool pages.
 * Server-only (rendered into static HTML by ToolShell) — adds no client JS.
 *
 * Writing rules: original, accurate to how OUR tool works, practical tips,
 * no keyword stuffing, no invented statistics.
 */
export interface GuideSection {
  h: string;
  p?: string[];
  list?: string[];
  table?: { head: [string, string]; rows: [string, string][] };
}

export interface Guide {
  title: string;
  sections: GuideSection[];
}

export const toolGuides: Record<string, Guide> = {
  "compress-pdf": {
    title: "Guide: how to make a PDF smaller (without wrecking it)",
    sections: [
      {
        h: "Why is my PDF so large?",
        p: [
          "Almost all of a PDF's size comes from images. A ten-page report made of text and simple charts is usually tiny, but the same ten pages scanned on a phone or office scanner can be many megabytes, because every page is stored as a high-resolution photograph. Embedded fonts, large logos repeated on every page, and photos pasted straight from a camera add to it.",
          "That's why compression works best on scanned documents, photo-heavy brochures and PDFs exported from phone scanning apps — and why a short text-only PDF often can't shrink much further.",
        ],
      },
      {
        h: "Which compression level should I choose?",
        table: {
          head: ["Level", "Best for"],
          rows: [
            ["Low", "Documents you'll print or read closely, such as contracts and certificates. Keeps text sharp at about 150 dpi."],
            ["Recommended", "Emailing, WhatsApp and most online forms. Text stays clearly readable on screen."],
            ["Extreme", "Strict upload limits (for example job portals or government forms). Text remains readable, but fine print and photos lose detail."],
          ],
        },
        p: [
          "Start with Recommended. If the result is still above your limit, try Extreme, and tick \"Convert to grayscale\" for black-and-white documents — removing colour can cut the size considerably on scanned pages.",
        ],
      },
      {
        h: "How Acutio compresses your PDF",
        p: [
          "Each page is redrawn as an optimised image at a lower resolution and saved with efficient JPEG compression, then the pages are put back together into a new PDF with the same page size. Everything happens inside your browser, so your document is never uploaded anywhere.",
          "The trade-off: because the pages become images, text in the compressed file can no longer be selected, copied or searched. Keep your original if you still need to edit it or copy text from it, and send the compressed copy.",
        ],
      },
      {
        h: "Tips when you have a strict size limit",
        list: [
          "Check the limit first: email services commonly cap attachments at around 20–25 MB, while many upload forms allow only 1–5 MB or even a few hundred KB.",
          "Remove pages you don't need before compressing, using Remove PDF Pages — fewer pages is the quickest saving of all.",
          "Split a very large document into parts with Split PDF and compress each part.",
          "For scans, choose grayscale and Extreme together — usually the smallest readable result.",
          "If you control the original, scan at 150–200 dpi instead of 300–600 dpi; it looks the same on screen at a fraction of the size.",
          "Always open the compressed file and zoom in on the smallest text before you submit it.",
        ],
      },
      {
        h: "Example: getting a scanned application under 1 MB",
        p: [
          "Say you've scanned a six-page application on your phone and the PDF is 8 MB, but the portal accepts only 1 MB. First, open it in Remove PDF Pages and delete any blank or duplicate pages. Next, compress it here with Recommended and check the new size shown in the results. Still too big? Run it again with Extreme and \"Convert to grayscale\" ticked — for black-and-white forms this usually gets you there with every line still readable.",
          "If one page is a colour photo or ID card that must stay in colour, split that page out with Split PDF, compress the colour page and the text pages separately with the settings that suit each, then join them again with Merge PDF.",
        ],
      },
      {
        h: "When compression won't help",
        p: [
          "If a PDF is mostly text and vector graphics, it's already efficient. Turning those pages into images can even make the file larger — in that case Acutio tells you and suggests keeping your original. Password-protected PDFs must be unlocked in your PDF reader before they can be compressed.",
        ],
      },
    ],
  },

  "merge-pdf": {
    title: "Guide: combining PDF files the right way",
    sections: [
      {
        h: "Common reasons to merge PDFs",
        list: [
          "Job and university applications that ask for a single file containing your CV, certificates and ID.",
          "Combining scanned pages from a phone into one document.",
          "Putting invoices or receipts for a month into one file for accounts or tax records.",
          "Joining a cover letter, report and appendices before sending them to a client.",
        ],
      },
      {
        h: "Get the order right before you merge",
        p: [
          "The finished PDF follows the order of the list on the page, from top to bottom. Drag the files into place before clicking Merge — it's much easier than fixing pages afterwards. Each file shows its page count, and the totals at the top help you confirm nothing is missing.",
          "If you need to rearrange individual pages after merging (for example, move page 7 to the front or remove a blank scan), open the merged file in Organize PDF, which lets you drag page thumbnails, rotate them and delete them.",
        ],
      },
      {
        h: "What stays the same and what doesn't",
        p: [
          "Acutio copies every page exactly as it is, so text, images, fonts and vector graphics keep their original quality — nothing is re-compressed. The merge happens in your browser, so even confidential documents never leave your device.",
          "A few things belong to the original files rather than to individual pages and aren't carried over: bookmarks (the clickable outline in the sidebar of some PDFs) and some document-level settings. The pages themselves, including clickable links on them, are unaffected.",
        ],
      },
      {
        h: "Practical tips",
        list: [
          "Rename your files with numbers first (01-cv.pdf, 02-certificates.pdf…) so they are added in the right order.",
          "Rotate sideways scans with Rotate PDF before merging, so every page faces the same way.",
          "If the merged file is too large to email or upload, run it through Compress PDF afterwards.",
          "Password-protected PDFs can't be merged until you open them with the password in your PDF reader and save an unlocked copy.",
          "Want images in the same file? Convert photos with JPG to PDF first, then merge.",
        ],
      },
      {
        h: "Merging on a phone",
        p: [
          "Merge PDF works in mobile browsers too. On Android, tap the upload area and choose files from Downloads, Drive or your file manager. On iPhone, PDFs saved in the Files app can be selected the same way. Use the up/down handles to fix the order, merge, and the combined file is saved to your downloads — ready to attach to an email or WhatsApp message.",
          "Have paper documents? Scan them with your phone's camera or a scanning app as PDFs first; photos can be turned into a PDF with JPG to PDF and then merged with your other files.",
        ],
      },
      {
        h: "Is there a limit?",
        p: [
          "There's no fixed limit on files or pages. Because everything runs on your own computer or phone, the practical limit is your device's memory; very large merges (hundreds of megabytes) work best on a computer rather than a phone.",
          "Is it safe for confidential documents? Yes — unlike many online PDF services, Acutio never uploads your files. The pages are combined by your own browser, and closing the tab clears everything. That makes it suitable for contracts, bank statements, medical records and ID documents.",
        ],
      },
    ],
  },

  "compress-image": {
    title: "Guide: reduce image size without visible quality loss",
    sections: [
      {
        h: "Pick the right format first",
        table: {
          head: ["Format", "Use it for"],
          rows: [
            ["JPG", "Photos. Small files and supported everywhere, but no transparency."],
            ["PNG", "Screenshots, logos, text and graphics with sharp edges or transparent backgrounds. Lossless, so files are bigger for photos."],
            ["WEBP", "Websites and most modern apps. Usually noticeably smaller than JPG at the same visual quality, and supports transparency."],
          ],
        },
        p: [
          "Choosing \"Same\" keeps each image's original format. Converting a large photo saved as PNG to JPG or WEBP is often the single biggest saving you can make.",
        ],
      },
      {
        h: "Quality vs. target file size",
        p: [
          "In \"By quality\" mode, the slider controls how much detail is kept. Around 75–85% is a good default for photos: the difference is very hard to see, while the file is far smaller than the original. Drop to 60–70% for thumbnails or images that only appear small on screen.",
          "If a form says \"maximum 100 KB\" or \"under 1 MB\", switch to \"Target file size\" and enter the limit. Acutio automatically lowers the quality step by step — and reduces the dimensions if that isn't enough — until each image fits, so you don't have to guess.",
        ],
      },
      {
        h: "Resize: the biggest saving most people miss",
        p: [
          "Phone cameras take photos 4000 pixels wide or more, but most screens and websites display them at 1000–2000 pixels. Setting a maximum width/height of 1920 px (Full HD) or 1280 px can cut the file size dramatically before any quality setting is applied — and the image still looks sharp on a laptop or phone.",
        ],
        list: [
          "Websites and blogs: 1280–1920 px wide is plenty for full-width images.",
          "Email attachments: 1280 px keeps photos clear and quick to download.",
          "Profile pictures and thumbnails: 800 px or less.",
          "Printing: keep the original dimensions and use high quality instead.",
        ],
      },
      {
        h: "Your privacy: location data is removed",
        p: [
          "Photos from phones often contain hidden EXIF information such as the GPS location where they were taken, the date and the camera model. Acutio re-encodes every image, which strips this metadata — useful before you post photos publicly. And because compression runs in your browser, the images themselves are never uploaded.",
        ],
      },
      {
        h: "Recommended sizes for common uses",
        table: {
          head: ["Where it's going", "Suggested size"],
          rows: [
            ["Instagram post", "1080 × 1080 px (square) — JPG or WEBP around 80% quality"],
            ["Instagram / WhatsApp story", "1080 × 1920 px"],
            ["YouTube thumbnail", "1280 × 720 px"],
            ["Website full-width image", "1920 px wide, WEBP, aiming for well under 300 KB"],
            ["Blog or product photo", "1200–1600 px wide"],
            ["Online form or profile photo", "Follow the form's limit using Target file size mode"],
          ],
        },
        p: ["Need exact dimensions or a different shape? Use Resize Image or Crop Image first, then compress the result here."],
      },
      {
        h: "Good to know",
        list: [
          "If an image is already well optimised, Acutio keeps the original rather than giving you a bigger file.",
          "iPhone HEIC photos are converted automatically, so you can compress them straight away.",
          "WhatsApp and most social networks re-compress what you upload, so there's little point uploading huge originals — compress first to send faster.",
          "Avoid compressing the same JPG repeatedly; each round loses a little more detail. Keep your original and compress a copy.",
        ],
      },
    ],
  },

  "qr-code-generator": {
    title: "Guide: create a QR code that scans every time",
    sections: [
      {
        h: "Static vs. dynamic QR codes",
        p: [
          "Acutio creates static QR codes: your link, Wi-Fi details or text are stored inside the pattern itself. They never expire, need no account, and don't send people through a tracking redirect. Many \"free\" generators make dynamic codes instead, which point to the generator's own server — convenient for editing later, but the code stops working if that service closes or starts charging.",
          "The only downside of a static code is that you can't change where it points after printing. If you might need to, link to a page on your own website that you control, and update that page instead.",
        ],
      },
      {
        h: "Choosing the right type",
        list: [
          "URL — menus, posters, business cards, product packaging and payment pages.",
          "Wi-Fi — guests scan and join your network without typing the password. Enter the network name exactly as it appears, including capital letters.",
          "Contact (vCard) — saves your name, phone, email and company straight into the scanner's contacts.",
          "Email, Phone and SMS — open a pre-filled message or start a call in one tap.",
          "Text — plain notes, such as instructions on equipment or a serial number.",
        ],
      },
      {
        h: "Size, colour and error correction",
        table: {
          head: ["Setting", "Recommendation"],
          rows: [
            ["Printed size", "At least 2 × 2 cm for scanning up close; larger for posters or anything scanned from a distance. A rough rule: scanning distance ÷ 10 = minimum code width."],
            ["Colours", "Dark code on a light background with strong contrast. Avoid light-on-dark, pastel colours and busy background images."],
            ["Quiet zone", "Leave a clear margin around the code; don't let text or borders touch it."],
            ["Error correction", "Medium is a good default. Choose High if the code may get scratched, folded or partly covered."],
          ],
        },
        p: [
          "Shorter content makes a simpler pattern that scans faster, so use a short link where you can. For print, download the SVG version — it stays perfectly sharp at any size, from a sticker to a banner.",
        ],
      },
      {
        h: "Before you print",
        list: [
          "Scan the code with two different phones (for example one Android and one iPhone).",
          "Test it at the actual printed size, in the lighting where it will be used.",
          "For URLs, check the page loads on mobile data, not just your office Wi-Fi.",
          "Add a short call to action next to the code, such as \"Scan to see our menu\" — people are far more likely to scan when they know what they'll get.",
        ],
      },
      {
        h: "Common mistakes to avoid",
        list: [
          "Making the code too small on business cards or labels — if people have to bring the phone very close, many will give up.",
          "Low contrast, such as light grey on white or a colourful code on a photo background.",
          "Inverting the colours (light code on a dark background); some older scanner apps can't read it.",
          "Linking to a page that isn't mobile-friendly, or to a long URL full of tracking parameters that makes the pattern dense.",
          "Printing on shiny or curved surfaces where reflections hide part of the code — test on the real material.",
          "Typing the Wi-Fi password with a typo. Scan the code yourself and confirm your phone connects before you print it.",
        ],
      },
      {
        h: "Is it free for business use?",
        p: [
          "Yes. QR codes made with Acutio are free for personal and commercial use, with no watermark and no expiry. Your content is encoded in your browser and isn't stored by us.",
        ],
      },
    ],
  },

  "jpg-to-pdf": {
    title: "Guide: turn photos and scans into a clean PDF",
    sections: [
      {
        h: "When a PDF is better than sending photos",
        list: [
          "Applications and forms that ask for one PDF instead of several image files.",
          "Sending receipts, invoices or expense claims to an accountant or employer.",
          "Sharing scanned pages of a document so they stay in the right order.",
          "Archiving screenshots, whiteboard photos or lecture notes as a single file.",
          "Printing many photos at once without opening each one.",
        ],
      },
      {
        h: "How Acutio builds your PDF",
        p: [
          "Every image becomes one page, and each page is exactly the size of its image, so nothing is cropped, stretched or squashed. JPG photos are placed into the PDF as they are, without being re-compressed, so they keep their original quality; PNG images stay lossless, which keeps screenshots and text perfectly sharp.",
          "WEBP, GIF, BMP and TIFF images, and iPhone HEIC photos, are converted automatically before they are added. All of this happens in your browser — your photos are never uploaded, which matters when they show IDs, documents or family pictures.",
        ],
      },
      {
        h: "Get the order and orientation right",
        p: [
          "Pages follow the order of the image list. Drag images up or down to rearrange them before converting; it is much quicker than fixing the PDF afterwards. Naming photos with numbers (01, 02, 03…) before you add them also helps.",
          "If a photo is sideways or upside down, straighten it first with Rotate & Flip Image, and use Crop Image to cut away a table, hands or background around a document. Clean, tightly cropped pages look far more professional and are easier to read.",
        ],
      },
      {
        h: "Keep the PDF small enough to send",
        p: [
          "Because your images are included at full quality, a PDF made from a dozen phone photos can be large. If you need to email it or upload it to a form with a size limit, you have two options:",
        ],
        list: [
          "Before converting: shrink the photos with Compress Image, setting a maximum width of 1600–1920 px. Documents remain perfectly readable and the PDF becomes much smaller.",
          "After converting: run the finished PDF through Compress PDF and choose Recommended or Extreme.",
        ],
      },
      {
        h: "Printing your PDF",
        p: [
          "Since each page matches its photo's shape, pages may not be exactly A4 or Letter size. When printing, choose \"Fit to page\" (sometimes called \"Fit\" or \"Shrink to printable area\") in the print dialog so every page fills the paper neatly without being cut off.",
        ],
      },
      {
        h: "Tips for scanning documents with your phone",
        list: [
          "Lay the page flat on a dark, contrasting surface in good, even light — near a window is ideal.",
          "Hold the phone directly above the page, parallel to it, to avoid a slanted, trapezoid-shaped page.",
          "Turn off the flash to avoid glare on glossy paper.",
          "Check every photo is sharp before converting; a blurry page cannot be fixed later.",
          "Need to add more pages to an existing PDF? Convert the new photos, then combine both files with Merge PDF.",
        ],
      },
    ],
  },
};
