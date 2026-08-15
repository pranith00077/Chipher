// ============================================================
// CHiPER - IMAGE DECODER
// ============================================================
//
// Reads:
//
// MAGIC
// LENGTH
// PAYLOAD
//
// from RGB LSBs.
// ============================================================

const MAGIC = "CHIPER1";


// ============================================================
// DECODE MESSAGE FROM IMAGE
// ============================================================

export async function decodeMessageFromImage(
  imageFile
) {

  if (!imageFile) {
    throw new Error(
      "Please select a CHiPER image."
    );
  }


  return new Promise(
    (resolve, reject) => {

      const image =
        new Image();

      const reader =
        new FileReader();


      // ------------------------------------------------------
      // FileReader
      // ------------------------------------------------------

      reader.onload = () => {

        image.src =
          reader.result;

      };


      reader.onerror = () => {

        reject(
          new Error(
            "Failed to read image file."
          )
        );

      };


      // ------------------------------------------------------
      // Image loaded
      // ------------------------------------------------------

      image.onload = () => {

        try {

          // --------------------------------------------------
          // Canvas
          // --------------------------------------------------

          const canvas =
            document.createElement("canvas");

          canvas.width =
            image.width;

          canvas.height =
            image.height;


          const context =
            canvas.getContext(
              "2d",
              {
                willReadFrequently: true
              }
            );


          if (!context) {

            reject(
              new Error(
                "Could not create canvas context."
              )
            );

            return;

          }


          context.drawImage(
            image,
            0,
            0
          );


          // --------------------------------------------------
          // Pixel data
          // --------------------------------------------------

          const imageData =
            context.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );


          const pixels =
            imageData.data;


          // --------------------------------------------------
          // Extract RGB LSBs
          // --------------------------------------------------

          const bits = [];


          for (
            let i = 0;
            i < pixels.length;
            i += 4
          ) {

            // Red
            bits.push(
              pixels[i] & 1
            );

            // Green
            bits.push(
              pixels[i + 1] & 1
            );

            // Blue
            bits.push(
              pixels[i + 2] & 1
            );

          }


          // --------------------------------------------------
          // Convert bits → bytes
          // --------------------------------------------------

          const bytes =
            bitsToBytes(bits);


          // --------------------------------------------------
          // Validate MAGIC
          // --------------------------------------------------

          const decoder =
            new TextDecoder();


          const magic =
            decoder.decode(
              bytes.slice(
                0,
                MAGIC.length
              )
            );


          if (
            magic !== MAGIC
          ) {

            reject(
              new Error(
                "This image does not contain valid CHiPER data."
              )
            );

            return;

          }


          console.log(
            "CHiPER magic header detected."
          );


          // --------------------------------------------------
          // Read payload length
          // --------------------------------------------------

          const lengthOffset =
            MAGIC.length;


          if (
            bytes.length <
            lengthOffset + 4
          ) {

            reject(
              new Error(
                "CHiPER header is incomplete."
              )
            );

            return;

          }


          const lengthView =
            new DataView(
              bytes.buffer,
              bytes.byteOffset +
              lengthOffset,
              4
            );


          const payloadLength =
            lengthView.getUint32(
              0
            );


          console.log(
            "Payload length:",
            payloadLength
          );


          // --------------------------------------------------
          // Calculate payload boundaries
          // --------------------------------------------------

          const payloadStart =
            MAGIC.length + 4;


          const payloadEnd =
            payloadStart +
            payloadLength;


          if (
            payloadEnd >
            bytes.length
          ) {

            reject(
              new Error(
                "CHiPER payload is incomplete or the image was modified."
              )
            );

            return;

          }


          // --------------------------------------------------
          // Extract payload
          // --------------------------------------------------

          const payloadBytes =
            bytes.slice(
              payloadStart,
              payloadEnd
            );


          const encryptedJSON =
            decoder.decode(
              payloadBytes
            );


          // --------------------------------------------------
          // Parse JSON
          // --------------------------------------------------

          let encryptedPackage;


          try {

            encryptedPackage =
              JSON.parse(
                encryptedJSON
              );

          }
          catch (error) {

            console.error(
              "Invalid encrypted JSON:",
              encryptedJSON
            );


            reject(
              new Error(
                "CHiPER data was found, but the encrypted package is invalid."
              )
            );

            return;

          }


          // --------------------------------------------------
          // Validate encrypted package
          // --------------------------------------------------

          if (
            !encryptedPackage.encryptedKey ||
            !encryptedPackage.iv ||
            !encryptedPackage.ciphertext
          ) {

            reject(
              new Error(
                "Invalid CHiPER encrypted package."
              )
            );

            return;

          }


          console.log(
            "CHiPER encrypted package extracted:",
            encryptedPackage
          );


          resolve(
            encryptedPackage
          );

        }
        catch (error) {

          reject(error);

        }

      };


      // ------------------------------------------------------
      // Image error
      // ------------------------------------------------------

      image.onerror = () => {

        reject(
          new Error(
            "Failed to load image."
          )
        );

      };


      reader.readAsDataURL(
        imageFile
      );

    }
  );

}


// ============================================================
// BITS → BYTES
// ============================================================

function bitsToBytes(bits) {

  const byteCount =
    Math.floor(
      bits.length / 8
    );


  const bytes =
    new Uint8Array(
      byteCount
    );


  for (
    let i = 0;
    i < byteCount;
    i++
  ) {

    let value = 0;


    for (
      let bit = 0;
      bit < 8;
      bit++
    ) {

      value =
        (value << 1) |
        bits[
          i * 8 + bit
        ];

    }


    bytes[i] =
      value;

  }


  return bytes;

}