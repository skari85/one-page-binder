import saveAs from "file-saver"
import { Document, Packer, Paragraph, TextRun } from "docx"
import jsPDF from "jspdf"

export const exportToTxt = (content: string, filename = "document.txt") => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
  saveAs(blob, filename)
}

export const exportToDocx = async (content: string, filename = "document.docx") => {
  try {
    const paragraphs = content.split("\n").map(
      (line) =>
        new Paragraph({
          children: [new TextRun(line || " ")],
        }),
    )

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, filename)
  } catch (error) {
    console.error("Error exporting to DOCX:", error)
    // Fallback to text export
    exportToTxt(content, filename.replace(".docx", ".txt"))
  }
}

export const exportToPdf = (content: string, filename = "document.pdf") => {
  try {
    const pdf = new jsPDF()
    const lines = content.split("\n")
    let yPosition = 20

    lines.forEach((line) => {
      if (yPosition > 280) {
        pdf.addPage()
        yPosition = 20
      }
      pdf.text(line, 20, yPosition)
      yPosition += 10
    })

    pdf.save(filename)
  } catch (error) {
    console.error("Error exporting to PDF:", error)
    // Fallback to text export
    exportToTxt(content, filename.replace(".pdf", ".txt"))
  }
}

export const exportToHtml = (content: string, filename = "document.html") => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        pre { white-space: pre-wrap; word-wrap: break-word; }
    </style>
</head>
<body>
    <pre>${content}</pre>
</body>
</html>`

  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
  saveAs(blob, filename)
}
