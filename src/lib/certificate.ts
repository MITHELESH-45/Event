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

        // Embed fonts
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
        const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)

        // Draw "Certificate of Participation" header
        const headerText = "CERTIFICATE OF PARTICIPATION"
        const headerSize = 20
        const headerWidth = fontBold.widthOfTextAtSize(headerText, headerSize)
        page.drawText(headerText, {
            x: 400 - headerWidth / 2,
            y: 450,
            size: headerSize,
            font: fontBold,
            color: rgb(0.15, 0.15, 0.15),
        })

        // Draw "This is to certify that" text
        const certifyText = "This is to certify that"
        const certifySize = 16
        const certifyWidth = fontRegular.widthOfTextAtSize(certifyText, certifySize)
        page.drawText(certifyText, {
            x: 400 - certifyWidth / 2,
            y: 390,
            size: certifySize,
            font: fontRegular,
            color: rgb(0.3, 0.3, 0.3),
        })

        // Draw Participant Name (Centered and Bold)
        const fontSizeName = 36
        const textName = userName
        const textWidthName = fontBold.widthOfTextAtSize(textName, fontSizeName)
        page.drawText(textName, {
            x: 400 - textWidthName / 2, // Center
            y: 340,
            size: fontSizeName,
            font: fontBold,
            color: rgb(0.1, 0.1, 0.1),
        })

        // Draw "has successfully participated in" text
        const participatedText = "has successfully participated in"
        const participatedSize = 16
        const participatedWidth = fontRegular.widthOfTextAtSize(participatedText, participatedSize)
        page.drawText(participatedText, {
            x: 400 - participatedWidth / 2,
            y: 290,
            size: participatedSize,
            font: fontRegular,
            color: rgb(0.3, 0.3, 0.3),
        })

        // Draw Event Name (Bold)
        const fontSizeEvent = 28
        const textEvent = eventName
        const textWidthEvent = fontBold.widthOfTextAtSize(textEvent, fontSizeEvent)
        page.drawText(textEvent, {
            x: 400 - textWidthEvent / 2,
            y: 240,
            size: fontSizeEvent,
            font: fontBold,
            color: rgb(0.15, 0.15, 0.15),
        })

        // Draw Date
        const fontSizeDate = 16
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
