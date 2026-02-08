import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

/**
 * Generates a PDF certificate with participant name, event name, and date.
 * Uses template image if available, otherwise creates a clean PDF from scratch.
 */
export async function generateCertificate(userName: string, eventName: string, date: string) {
    try {
        const pdfDoc = await PDFDocument.create()
        const page = pdfDoc.addPage([800, 600]) // Landscape

        // Use certificate template from public/certificate-template.png
        try {
            const templateUrl = typeof window !== 'undefined'
                ? `${window.location.origin}/certificate-template.png`
                : '/certificate-template.png'
            const templateResponse = await fetch(templateUrl)
            if (templateResponse.ok) {
                const existingPdfBytes = await templateResponse.arrayBuffer()
                const templateImage = await pdfDoc.embedPng(existingPdfBytes)
                page.drawImage(templateImage, {
                    x: 0,
                    y: 0,
                    width: 800,
                    height: 600,
                })
            }
        } catch {
            // Fallback: draw a subtle background
            page.drawRectangle({
                x: 0,
                y: 0,
                width: 800,
                height: 600,
                color: rgb(0.98, 0.98, 0.98),
            })
            page.drawRectangle({
                x: 30,
                y: 30,
                width: 740,
                height: 540,
                borderColor: rgb(0.2, 0.2, 0.2),
                borderWidth: 2,
            })
        }

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
        const textName = userName || "Participant"
        const textWidthName = fontBold.widthOfTextAtSize(textName, fontSizeName)
        page.drawText(textName, {
            x: 400 - textWidthName / 2,
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
        const textEvent = eventName || "Event"
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

        const pdfBytes = await pdfDoc.save()
        return pdfBytes
    } catch (error) {
        console.error("Certificate Generation Error:", error)
        return null
    }
}
