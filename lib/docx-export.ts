import saveAs from "file-saver"
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx"

export interface ExportOptions {
  title?: string
  author?: string
  includeTimestamp?: boolean
  timestampFormat?: "iso" | "locale" | "custom"
  customTimestampFormat?: string
}

export const exportToTxt = (content: string, filename: string) => {
  const timestamp = new Date().toISOString().split("T")[0]
  const txtContent = `${filename}\n${"=".repeat(filename.length)}\n\nExported from Qi - A quiet place to write\nDate: ${new Date().toLocaleDateString()}\nWords: ${
    content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
  }\n\n${"-".repeat(50)}\n\n${content}`
  const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8" })
  saveAs(blob, `${filename.toLowerCase().replace(/\s+/g, "-")}-${timestamp}.txt`)
}

export async function exportToDocx(content: string, filename = "document.docx", options: ExportOptions = {}) {
  const {
    title = "Document",
    author = "One Page Binder",
    includeTimestamp = true,
    timestampFormat = "locale",
  } = options

  // Split content into paragraphs
  const paragraphs = content.split("\n").filter((line) => line.trim() !== "")

  // Create document paragraphs
  const docParagraphs: Paragraph[] = []

  // Add title if provided
  if (title) {
    docParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: title,
            bold: true,
            size: 32,
          }),
        ],
        heading: HeadingLevel.TITLE,
        spacing: { after: 400 },
      }),
    )
  }

  // Add timestamp if requested
  if (includeTimestamp) {
    let timestampText = ""
    const now = new Date()

    switch (timestampFormat) {
      case "iso":
        timestampText = now.toISOString()
        break
      case "locale":
        timestampText = now.toLocaleString()
        break
      case "custom":
        timestampText = options.customTimestampFormat
          ? formatCustomTimestamp(now, options.customTimestampFormat)
          : now.toLocaleString()
        break
    }

    docParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: timestampText,
            italics: true,
            size: 20,
          }),
        ],
        spacing: { after: 400 },
      }),
    )
  }

  // Add content paragraphs
  paragraphs.forEach((paragraph) => {
    docParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: paragraph,
            size: 24,
          }),
        ],
        spacing: { after: 200 },
      }),
    )
  })

  // Create the document
  const doc = new Document({
    creator: author,
    title: title,
    description: "Document created with One Page Binder",
    sections: [
      {
        properties: {},
        children: docParagraphs,
      },
    ],
  })

  // Generate and save the document
  try {
    const blob = await Packer.toBlob(doc)
    saveAs(blob, filename)
    return true
  } catch (error) {
    console.error("Error exporting to DOCX:", error)
    throw new Error("Failed to export document")
  }
}

export const exportToPdf = (content: string, filename: string) => {
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              max-width: 8.5in;
              margin: 0 auto;
              padding: 1in;
              white-space: pre-wrap;
            }
            @media print {
              body { margin: 0; padding: 1in; }
            }
          </style>
        </head>
        <body>
          <h1>${filename}</h1>
          <div>${content.replace(/\n/g, "<br>")}</div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }
}

export const exportToHtml = (content: string, filename: string) => {
  const timestamp = new Date().toISOString().split("T")[0]
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${filename}</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          max-width: 8.5in;
          margin: 0 auto;
          padding: 1in;
          white-space: pre-wrap;
        }
        h1 {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
          margin-bottom: 30px;
        }
      </style>
    </head>
    <body>
      <h1>${filename}</h1>
      <div>${content.replace(/\n/g, "<br>")}</div>
    </body>
    </html>
  `
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
  saveAs(blob, `${filename.toLowerCase().replace(/\s+/g, "-")}-${timestamp}.html`)
}

export const printDocument = (content: string, filename: string) => {
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              max-width: 8.5in;
              margin: 0 auto;
              padding: 1in;
              white-space: pre-wrap;
            }
            h1 {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
              margin-bottom: 30px;
            }
          </style>
        </head>
        <body>
          <h1>${filename}</h1>
          <div>${content.replace(/\n/g, "<br>")}</div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }
}

function formatCustomTimestamp(date: Date, format: string): string {
  const replacements: Record<string, string> = {
    YYYY: date.getFullYear().toString(),
    MM: (date.getMonth() + 1).toString().padStart(2, "0"),
    DD: date.getDate().toString().padStart(2, "0"),
    HH: date.getHours().toString().padStart(2, "0"),
    mm: date.getMinutes().toString().padStart(2, "0"),
    ss: date.getSeconds().toString().padStart(2, "0"),
  }

  let result = format
  Object.entries(replacements).forEach(([key, value]) => {
    result = result.replace(new RegExp(key, "g"), value)
  })

  return result
}
