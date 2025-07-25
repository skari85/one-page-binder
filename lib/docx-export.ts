import saveAs from "file-saver"
import { Document, Packer, Paragraph, TextRun } from "docx"

export const exportToTxt = (content: string, filename: string) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
  saveAs(blob, filename)
}

export const exportToDocx = async (content: string, filename: string) => {
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
  saveAs(blob, filename)
}

export const exportToPdf = (content: string, filename: string) => {
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <pre style="white-space: pre-wrap; word-wrap: break-word;">${content}</pre>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }
}

export const exportToHtml = (content: string, filename: string) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${filename}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        .content { white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <div class="content">${content.replace(/\n/g, "<br>")}</div>
    </body>
    </html>
  `
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
  saveAs(blob, filename)
}
