export default function printBarcode(data: any, variation?: any) {
    
    const barcodeValue = variation
        ? `${data.shop_id}-${data.id}-${variation?.id}-shprovar`
        : `${data.shop_id}-${data.id}-shpro`;

    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(
        currentDate.getMonth() + 1
    )
        .toString()
        .padStart(2, '0')}/${currentDate.getFullYear()}`;

    const printWindow: any = window.open('', '', 'width=800,height=600');

    printWindow.document.write(`
      <html>
        <head>
          <title>Sticker Print</title>
          <style>
            @media print {
              @page {
                size: 4in 2in;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                width: 4in;
                height: 2in;
                display: flex;
                justify-content: center;
                align-items: center;
              }
            }
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .sticker {
              width: 4in;
              height: 2in;
              display: flex;
              align-items: center;
              justify-content: space-around;
              border: 1px solid #000;
              padding: 5px;
              box-sizing: border-box;
            }
            .date {
              font-size: 18px;
            }
            .id {
              font-size: 20px;
              font-weight: bold;
            }
            img {
              width: 1.8in;
              height: 1.8in;
            }
          </style>
        </head>
        <body>
          <div class="sticker">
            <img src="https://barcodeapi.org/api/${barcodeValue}" alt="Barcode" />
            <div>
              <p class="date">Date: ${formattedDate}</p>
              <p class="id">${`${barcodeValue}` ? `${barcodeValue}` : `${barcodeValue}`}</p>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
}
