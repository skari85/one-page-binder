import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

export async function exportToDocx(content: string, filename: string): Promise<void> {
  // Split content into paragraphs
  const paragraphs = content.split('\n').filter(line => line.trim() !== '')
  
  // Create document sections
  const children: Paragraph[] = []
  
  // Add title
  children.push(
    new Paragraph({
      text: 'One Page Binder',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 400,
      },
    })
  )
  
  // Add content paragraphs
  paragraphs.forEach((paragraph, index) => {
    // Check if this looks like a timestamp
    const timestampMatch = paragraph.match(/^\[.*?\]\s*/)
    
    if (timestampMatch) {
      // This is a timestamp line, make it a heading
      const timestampText = timestampMatch[0]
      const contentText = paragraph.replace(timestampMatch[0], '').trim()
      
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: timestampText,
              bold: true,
              color: '666666',
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
        })
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
        })
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
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}