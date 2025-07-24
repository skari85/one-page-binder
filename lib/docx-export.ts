import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx"
import saveAs from "file-saver"

export function exportToTxt(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
  saveAs(blob, `${filename}.txt`)
}

export function exportToHtml(content: string, filename: string): void {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${filename}</title>
    <style>
        body { 
            font-family: Georgia, serif; 
            line-height: 1.6; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            color: #333; 
        }
        h1 { 
            text-align: center; 
            color: #2c3e50; 
            margin-bottom: 30px; 
        }
        p { 
            margin-bottom: 16px; 
        }
        .timestamp { 
            color: #666; 
            font-weight: bold; 
            font-size: 0.9em; 
        }
    </style>
</head>
<body>
    <h1>${filename}</h1>
    ${content
      .split("\n")
      .map((line) => {
        if (line.trim() === "") return ""
        const timestampMatch = line.match(/^(\[.*?\])\s*(.*)/)
        if (timestampMatch) {
          return `<p><span class="timestamp">${timestampMatch[1]}</span> ${timestampMatch[2]}</p>`
        }
        return `<p>${line}</p>`
      })
      .join("\n")}
</body>
</html>`

  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
  saveAs(blob, `${filename}.html`)
}

export function exportToPdf(content: string, filename: string): void {
  // Create a temporary HTML page for printing
  const printWindow = window.open("", "_blank")
  if (!printWindow) return

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${filename}</title>
    <style>
        @media print {
            body { margin: 0; }
            @page { margin: 1in; }
        }
        body { 
            font-family: Georgia, serif; 
            line-height: 1.6; 
            color: #333; 
            font-size: 12pt;
        }
        h1 { 
            text-align: center; 
            color: #2c3e50; 
            margin-bottom: 30px; 
            page-break-after: avoid;
        }
        p { 
            margin-bottom: 12pt; 
            page-break-inside: avoid;
        }
        .timestamp { 
            color: #666; 
            font-weight: bold; 
            font-size: 0.9em; 
        }
    </style>
</head>
<body>
    <h1>${filename}</h1>
    ${content
      .split("\n")
      .map((line) => {
        if (line.trim() === "") return ""
        const timestampMatch = line.match(/^(\[.*?\])\s*(.*)/)
        if (timestampMatch) {
          return `<p><span class="timestamp">${timestampMatch[1]}</span> ${timestampMatch[2]}</p>`
        }
        return `<p>${line}</p>`
      })
      .join("\n")}
</body>
</html>`

  printWindow.document.write(htmlContent)
  printWindow.document.close()

  // Wait for content to load, then trigger print dialog
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 250)
}

export function printDocument(content: string, filename: string): void {
  exportToPdf(content, filename)
}

export async function exportToDocx(content: string, filename: string): Promise<void> {
  // Split content into paragraphs
  const paragraphs = content.split("\n").filter((line) => line.trim() !== "")

  // Create document sections
  const children: Paragraph[] = []

  // Add title
  children.push(
    new Paragraph({
      text: "One Page Binder",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 400,
      },
    }),
  )

  // Add content paragraphs
  paragraphs.forEach((paragraph) => {
    // Check if this looks like a timestamp
    const timestampMatch = paragraph.match(/^\[.*?\]\s*/)

    if (timestampMatch) {
      // This is a timestamp line, make it a heading
      const timestampText = timestampMatch[0]
      const contentText = paragraph.replace(timestampMatch[0], "").trim()

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: timestampText,
              bold: true,
              color: "666666",
              size: 20,
            }),
            new TextRun({
              text: contentText,
              size: 24,
            }),
          ],
          spacing: {
            before: 200,
            after: 200,
          },
        }),
      )
    } else {
      // Regular paragraph
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: paragraph,
              size: 24,
            }),
          ],
          spacing: {
            before: 120,
            after: 120,
          },
        }),
      )
    }
  })

  // Create the document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children,
      },
    ],
  })

  // Generate the document
  const buffer = await Packer.toBuffer(doc)

  // Create and trigger download
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.style.display = "none"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
