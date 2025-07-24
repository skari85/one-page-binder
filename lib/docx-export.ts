import saveAs from "file-saver"

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

export const exportToDocx = async (content: string, filename: string) => {
  try {
    const { Document, Packer, Paragraph, TextRun } = await import("docx")

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: content.split("\n").map(
            (line) =>
              new Paragraph({
                children: [new TextRun(line || " ")],
              }),
          ),
        },
      ],
    })

    const blob = await Packer.toBlob(doc)
    const timestamp = new Date().toISOString().split("T")[0]
    saveAs(blob, `${filename.toLowerCase().replace(/\s+/g, "-")}-${timestamp}.docx`)
  } catch (error) {
    console.error("DOCX export failed:", error)
    // Fallback to HTML export
    exportToHtml(content, filename)
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
