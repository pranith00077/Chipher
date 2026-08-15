// ============================================================
// CHiPER - STEGANOGRAPHY ENCODER
// ============================================================
//
// Format stored inside image:
//
//   MAGIC (7 bytes)
//   +
//   PAYLOAD LENGTH (4 bytes)
//   +
//   UTF-8 encrypted JSON
//
// Example:
//
//   CHIPER1 + [length] + {"encryptedKey":"...","iv":"..."}
//
// LSB steganography:
// - 1 bit stored in each RGB channel
// - Alpha channel is untouched
//
// IMPORTANT:
// - Always output PNG.
// - JPEG can destroy LSB data.
// ============================================================

const MAGIC = "CHIPER1";

const MAGIC_BYTES = new TextEncoder().encode(MAGIC);

const HEADER_SIZE =
  MAGIC_BYTES.length + 4;


// ============================================================
// ENCODE ENCRYPTED DATA INTO IMAGE
// ============================================================

export async function encodeMessageIntoImage(
  imageFile,
  encryptedData
) {

  if (!imageFile) {
    throw new Error(
      "Please select a cover image."
    );
  }

  if (!encryptedData) {
    throw new Error(
      "Encrypted data is required."
    );
  }


  // ----------------------------------------------------------
  // Load image
  // ----------------------------------------------------------

  const image =
    await loadImage(imageFile);


  // ----------------------------------------------------------
  // Create canvas
  // ----------------------------------------------------------

  const canvas =
    document.createElement("canvas");

  canvas.width =
    image.width;

  canvas.height =
    image.height;


  const context =
    canvas.getContext("2d", {
      willReadFrequently: true
    });


  if (!context) {
    throw new Error(
      "Could not create canvas context."
    );
  }


  // ----------------------------------------------------------
  // Draw image
  // ----------------------------------------------------------

  context.drawImage(
    image,
    0,
    0
  );


  // ----------------------------------------------------------
  // Get pixels
  // ----------------------------------------------------------

  const imageData =
    context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

  const pixels =
    imageData.data;


  // ----------------------------------------------------------
  // Convert encrypted JSON to UTF-8 bytes
  // ----------------------------------------------------------

  const encoder =
    new TextEncoder();

  const payloadBytes =
    encoder.encode(
      encryptedData
    );


  // ----------------------------------------------------------
  // Create header
  //
  // MAGIC = CHIPER1
  // LENGTH = 4-byte unsigned integer
  // ----------------------------------------------------------

  const header =
    new Uint8Array(
      HEADER_SIZE
    );


  // Copy MAGIC
  header.set(
    MAGIC_BYTES,
    0
  );


  // Store payload length
  const view =
    new DataView(
      header.buffer
    );


  view.setUint32(
    MAGIC_BYTES.length,
    payloadBytes.length,
    false
  );


  // ----------------------------------------------------------
  // Combine header + payload
  // ----------------------------------------------------------

  const completePayload =
    new Uint8Array(
      HEADER_SIZE +
      payloadBytes.length
    );


  completePayload.set(
    header,
    0
  );


  completePayload.set(
    payloadBytes,
    HEADER_SIZE
  );


  // ----------------------------------------------------------
  // Calculate required bits
  // ----------------------------------------------------------

  const requiredBits =
    completePayload.length * 8;


  // 3 RGB channels per pixel
  const availableBits =
    Math.floor(
      (pixels.length / 4) * 3
    );


  if (
    requiredBits >
    availableBits
  ) {

    throw new Error(
      "The selected image is too small for this encrypted message."
    );

  }


  console.log(
    "CHiPER payload:",
    completePayload.length,
    "bytes"
  );

  console.log(
    "Required bits:",
    requiredBits
  );

  console.log(
    "Available bits:",
    availableBits
  );


  // ----------------------------------------------------------
  // Write payload bits into RGB channels
  // ----------------------------------------------------------

  let bitIndex = 0;


  for (
    let pixelIndex = 0;
    pixelIndex < pixels.length;
    pixelIndex++
  ) {

    // Skip alpha
    if (
      pixelIndex % 4 === 3
    ) {
      continue;
    }


    const byteIndex =
      Math.floor(
        bitIndex / 8
      );


    if (
      byteIndex >=
      completePayload.length
    ) {
      break;
    }


    const bitPosition =
      7 -
      (bitIndex % 8);


    const bit =
      (
        completePayload[byteIndex]
        >>
        bitPosition
      ) & 1;


    // Replace LSB
    pixels[pixelIndex] =
      (
        pixels[pixelIndex] &
        0xFE
      ) |
      bit;


    bitIndex++;

  }


  // ----------------------------------------------------------
  // Put modified pixels back
  // ----------------------------------------------------------

  context.putImageData(
    imageData,
    0,
    0
  );


  // ----------------------------------------------------------
  // Convert canvas to PNG
  // ----------------------------------------------------------

  const blob =
    await canvasToBlob(
      canvas
    );


  // ----------------------------------------------------------
  // Create output file
  // ----------------------------------------------------------

  const outputFile =
    new File(
      [
        blob
      ],
      "chiper-image.png",
      {
        type: "image/png"
      }
    );


  console.log(
    "CHiPER image generated successfully."
  );


  return outputFile;
}



// ============================================================
// LOAD IMAGE
// ============================================================

function loadImage(
  imageFile
) {

  return new Promise(
    (resolve, reject) => {

      const image =
        new Image();


      const objectURL =
        URL.createObjectURL(
          imageFile
        );


      image.onload = () => {

        URL.revokeObjectURL(
          objectURL
        );

        resolve(image);

      };


      image.onerror = () => {

        URL.revokeObjectURL(
          objectURL
        );

        reject(
          new Error(
            "Failed to load the image."
          )
        );

      };


      image.src =
        objectURL;

    }
  );

}



// ============================================================
// CANVAS → PNG BLOB
// ============================================================

function canvasToBlob(
  canvas
) {

  return new Promise(
    (resolve, reject) => {

      canvas.toBlob(
        (blob) => {

          if (!blob) {

            reject(
              new Error(
                "Failed to create PNG image."
              )
            );

            return;

          }


          resolve(blob);

        },
        "image/png"
      );

    }
  );

}