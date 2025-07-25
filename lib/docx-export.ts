import { saveAs } from "file-saver"

export interface ExportOptions {
  title?: string
  author?: string
  includeTimestamp?: boolean
  timestampFormat?: "iso" | "locale" | "custom"
  customTimestampFormat?: string
}

export function exportToTxt(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
  saveAs(blob, filename.endsWith(".txt") ? filename : `${filename}.txt`)
}

export async function exportToDocx(content: string, filename: string, options: ExportOptions = {}) {
  // For now, export as rich text format which can be opened by Word
  const timestamp = options.includeTimestamp ? `\n\nExported: ${new Date().toLocaleString()}\n` : ""
  const docContent = `${options.title || "Document"}\n${"=".repeat(50)}\n\n${content}${timestamp}`

  const blob = new Blob([docContent], { type: "application/rtf" })
  saveAs(blob, filename.endsWith(".docx") ? filename : `${filename}.docx`)
}

export function exportToPdf(content: string, filename: string) {
  // Use browser's print functionality for PDF export
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
          .content { white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <div class="content">${content.replace(/\n/g, "<br>")}</div>
        <script>window.print(); window.close();</script>
      </body>
      </html>
    `)
    printWindow.document.close()
  }
}

export function exportToHtml(content: string, filename: string) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${filename}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        .timestamp { color: #666; font-style: italic; margin-bottom: 20px; }
        .content { white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <div class="timestamp">${new Date().toLocaleString()}</div>
      <div class="content">${content.replace(/\n/g, "<br>")}</div>
    </body>
    </html>
  `
  const blob = new Blob([htmlContent], { type: "text/html" })
  saveAs(blob, filename.endsWith(".html") ? filename : `${filename}.html`)
}

export function printDocument(content: string, title: string) {
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
          .content { white-space: pre-wrap; }
          @media print {
            body { margin: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="content">${content.replace(/\n/g, "<br>")}</div>
        <script>window.print();</script>
      </body>
      </html>
    `)
    printWindow.document.close()
  }
}
