import saveAs from "file-saver"
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx"

interface ExportOptions {
  title?: string
  author?: string
  includeTimestamp?: boolean
  timestampFormat?: "iso" | "locale" | "custom"
  customTimestampFormat?: string
}

export const exportToTxt = (content: string, filename: string) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
  saveAs(blob, filename.endsWith(".txt") ? filename : `${filename}.txt`)
}

export const exportToDocx = async (content: string, filename: string, options: ExportOptions = {}) => {
  const {
    title = "Document",
    author = "One Page Binder",
    includeTimestamp = true,
    timestampFormat = "locale",
    customTimestampFormat = "YYYY-MM-DD HH:mm:ss",
  } = options

  const paragraphs: Paragraph[] = []

  // Add title if provided
  if (title) {
    paragraphs.push(
      new Paragraph({
        text: title,
        heading: HeadingLevel.TITLE,
      }),
    )
  }

  // Add timestamp if requested
  if (includeTimestamp) {
    let timestamp = ""
    const now = new Date()

    switch (timestampFormat) {
      case "iso":
        timestamp = now.toISOString()
        break
      case "locale":
        timestamp = now.toLocaleString()
        break
      case "custom":
        // Simple custom format implementation
        timestamp = customTimestampFormat
          .replace("YYYY", now.getFullYear().toString())
          .replace("MM", (now.getMonth() + 1).toString().padStart(2, "0"))
          .replace("DD", now.getDate().toString().padStart(2, "0"))
          .replace("HH", now.getHours().toString().padStart(2, "0"))
          .replace("mm", now.getMinutes().toString().padStart(2, "0"))
          .replace("ss", now.getSeconds().toString().padStart(2, "0"))
        break
      default:
        timestamp = now.toLocaleString()
    }

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Created: ${timestamp}`,
            italics: true,
            size: 20,
          }),
        ],
      }),
    )

    // Add spacing
    paragraphs.push(new Paragraph({ text: "" }))
  }

  // Split content into paragraphs and add them
  const contentParagraphs = content.split("\n").map(
    (line) =>
      new Paragraph({
        children: [
          new TextRun({
            text: line || " ", // Empty line if no text
            size: 24,
          }),
        ],
      }),
  )

  paragraphs.push(...contentParagraphs)

  const doc = new Document({
    creator: author,
    title: title,
    description: "Document created with One Page Binder",
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  })

  try {
    const buffer = await Packer.toBlob(doc)
    saveAs(buffer, filename.endsWith(".docx") ? filename : `${filename}.docx`)
  } catch (error) {
    console.error("Error creating DOCX:", error)
    throw new Error("Failed to create DOCX file")
  }
}

export const exportToPdf = (content: string, filename: string) => {
  // Create a new window for printing
  const printWindow = window.open("", "_blank")
  if (!printWindow) return

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${filename}</title>
      <style>
        @page {
          margin: 1in;
          size: A4;
        }
        body {
          font-family: 'Times New Roman', serif;
          font-size: 12pt;
          line-height: 1.6;
          color: #000;
          background: #fff;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 1px solid #ccc;
          padding-bottom: 10px;
        }
        .content {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .timestamp {
          font-style: italic;
          color: #666;
          font-size: 10pt;
          margin-bottom: 20px;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${filename}</h1>
        <div class="timestamp">Created: ${new Date().toLocaleString()}</div>
      </div>
      <div class="content">${content.replace(/\n/g, "<br>")}</div>
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        };
      </script>
    </body>
    </html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()
}

export const exportToHtml = (content: string, filename: string) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${filename}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 2px solid #eee;
          padding-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          color: #2c3e50;
        }
        .timestamp {
          font-style: italic;
          color: #7f8c8d;
          margin-top: 10px;
        }
        .content {
          white-space: pre-wrap;
          word-wrap: break-word;
          font-size: 16px;
          line-height: 1.8;
        }
        @media (max-width: 600px) {
          body {
            padding: 20px 15px;
          }
          .content {
            font-size: 14px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${filename}</h1>
        <div class="timestamp">Created: ${new Date().toLocaleString()}</div>
      </div>
      <div class="content">${content.replace(/\n/g, "<br>")}</div>
    </body>
    </html>
  `

  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
  saveAs(blob, filename.endsWith(".html") ? filename : `${filename}.html`)
}

export const printDocument = (content: string, title: string) => {
  exportToPdf(content, title)
}
