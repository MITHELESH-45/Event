import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function generateCertificate(userName: string, eventName: string, date: string) {
    try {
        const existingPdfBytes = await fetch('/certificate-template.png').then(res => res.arrayBuffer())

        // Create a new PDF document
        const pdfDoc = await PDFDocument.create()
        const page = pdfDoc.addPage([800, 600]) // Landscape

        // Embed the template image
        const templateImage = await pdfDoc.embedPng(existingPdfBytes)
        const { width, height } = templateImage.scale(1)

        // Draw the image to fit the page
        page.drawImage(templateImage, {
            x: 0,
            y: 0,
            width: 800,
            height: 600,
        })

        // Embed font
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
        const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)

        // Draw Participant Name (Centered)
        const fontSizeName = 40
        const textName = userName
        const textWidthName = font.widthOfTextAtSize(textName, fontSizeName)
        page.drawText(textName, {
            x: 400 - textWidthName / 2, // Center
            y: 320,
            size: fontSizeName,
            font: font,
            color: rgb(0.1, 0.1, 0.1),
        })

        // Draw Event Name
        const fontSizeEvent = 24
        const textEvent = eventName
        const textWidthEvent = fontRegular.widthOfTextAtSize(textEvent, fontSizeEvent)
        page.drawText(textEvent, {
            x: 400 - textWidthEvent / 2,
            y: 250,
            size: fontSizeEvent,
            font: fontRegular,
            color: rgb(0.2, 0.2, 0.2),
        })

        // Draw Date
        const fontSizeDate = 18
        const textDate = `Date: ${date}`
        const textWidthDate = fontRegular.widthOfTextAtSize(textDate, fontSizeDate)
        page.drawText(textDate, {
            x: 400 - textWidthDate / 2,
            y: 180,
            size: fontSizeDate,
            font: fontRegular,
            color: rgb(0.3, 0.3, 0.3),
        })

        // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save()
        return pdfBytes
    } catch (error) {
        console.error("Certificate Generation Error:", error)
        return null
    }
}
