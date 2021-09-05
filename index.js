//in mm
const width = 290 / 0.353
const height = 30 / 0.353
const textx = 35
const texty = 60
const barcodex = 260
const barcodey = 5
const stripeStart = 250
const stripeWidth = 8
const stripeMargin = 5
const imagex = 35
const imagey = 0
const imageScale=0.3

const pdfDoc = require('pdfkit')
const fs = require('fs')
const {   SymbologyType,
    OutputType,
    EncodingMode,
    createFile } =require ('symbology')
const { scale } = require('pdfkit')


const doc = new pdfDoc({ size: [width, height], margins: { top: 0, bottom: 0, left: 0, right: 0 } }/**/)

doc.pipe(fs.createWriteStream('temp/output.pdf'))
let name = "Test testesen".split(" ")
displayname = `${name.shift()}`
name.forEach((data) => displayname += " " + data.charAt(0).toUpperCase())
let seat = "Row 1, Seat 5"
let barcode = "8b22c5de"
let stripes = 4
let title = "ADMIN"


async function generatePdf(barcode, displayname=null, displayseat=null, title=null, stripes=null) {
    //var qrpng = qr.imageSync(barcode, { type: 'png' , margin: 0, size: 4}) 
    //fs.writeFileSync(`${barcode}.png`,qrpng)
    const data  = await createFile({
        symbology: SymbologyType.QRCODE,
        fileName: `temp/${barcode}.png`,
        showHumanReadableText: false,
        height: 75,
        width: 75
      }, barcode, OutputType.PNG)
      console.log(data)
      let barcodeScale=(75/data.width)

      console.log(barcodeScale)
      if(title) {
    doc
        .rect(0, 0, 30, 90).fill('#000')
        .fontSize(20)
        .save()
        .rotate(90 * 3)
        .fill("#FFFFFF")
        .text(title, -85, 5, {
            width: height,
            height: 30 / 0.353,
            align: 'center',
        })
        .restore()
    }
        doc
        .save()
        .scale(barcodeScale)
        .image(`temp/${barcode}.png`,barcodex/barcodeScale,barcodey/barcodeScale)
        .restore()
        .save()
        .scale(imageScale)
        .image("images/torrilanlogo.png", imagex/imageScale, imagey/imageScale)
        .restore()
        

    doc
        .fontSize(10)
        .fill("#000")
        .text(displayname, textx, texty)
        .text(displayseat)
        
        for (let index = 0; index < stripes; index++) {
            doc.rect(stripeStart-stripeWidth-((stripeMargin+stripeWidth)*index),0,stripeWidth,90).fill("#000")
            
        }
        

    doc.end()
}

generatePdf(barcode,displayname,seat,title,4)