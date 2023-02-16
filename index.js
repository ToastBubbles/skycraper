let axios = require("axios");
var cron = require("node-cron");
const fs = require("fs");
const { keys } = require("./keys");
// const sgMail = require("@sendgrid/mail");
require("dotenv").config();

// sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
console.log("started");
function fetchLegoInfo(LegoObject, showAll = false, allPieces) {
  // console.log(LegoObject.setNumber);
  axios.defaults.headers.common = {
    "x-api-key": keys.leg0,
    // product_number: LegoObject.setNumber,
  };
  //https://services.slingshot.lego.com/api/v4/lego_historic_product_read/_search
  // /api/v4/lego_historic_product_read/_search
  // https://bricksandpieces.services.lego.com/api/v1/bricks/product/${LegoObject.setNumber} //OLD URL
  // https://bricksandpieces.cs.services.lego.com/api/v1/bricks/product/60374?country=US&orderType=missing
  axios
    .get(
      `https://bricksandpieces.cs.services.lego.com/api/v1/bricks/product/${LegoObject.setNumber}`,
      // `https://services.slingshot.lego.com/api/v4/lego_historic_product_read/_search`,
      {
        params: {
          country: "US",
          orderType: "missing",
          // product_number: LegoObject.setNumber,
          // _id: LegoObject.setNumber,
        },
      }
    )
    .then((res) => {
      // console.log(res.statusText);
      if (res.statusText == "OK") {
        handleLegoResponse(res.data, LegoObject, showAll, allPieces);
      }
      //
      // console.log(LegoObject.setNumber);
    });
}

function handleLegoResponse(responseData, pieceToLookFor, showAll, allPieces) {
  // console.log(responseData.bricks);
  const inStockPieces = responseData.bricks.filter((piece) => !piece.isSoldOut);
  const outStockPieces = responseData.bricks.filter((piece) => piece.isSoldOut);
  responseData.bricks.forEach((brick) => {
    if (!showAll) {
      // console.log(brick);
      if (pieceToLookFor.parts.includes(brick.itemNumber)) {
        // console.log(brick);
        !brick.isSoldOut &&
          console.log(
            `${brick.colorFamily} ${brick.description} is available!`
          );
        brick.isSoldOut &&
          console.log(
            `${brick.colorFamily} ${brick.description} is NOT available`
          );
      }
    } else {
      console.log(brick.description, brick.colorFamily, brick.itemNumber);
    }
  });
  // inStockPieces.forEach((part) => {
  //   // console.log(part.description, part.colorFamily, part.designId);
  //   LegoObject.parts.forEach(wantedPart =>{
  //     if(part.itemNumber == wantedPart){
  //       console.log(wantedPart)
  //     }
  //   })

  //   // console.log(part);
  // });
  // console.log(inStockPieces);
  // const theChosenPiece = inStockPieces.filter(
  //   (piece) => piece.itemNumber === pieceToLookFor.itemNumber
  // );

  // theChosenPiece.length !== 0
  //   ? pieceWasFoundProtical(pieceToLookFor, allPieces)
  //   : console.log(`The ${pieceToLookFor.name} peice is not avialible.`);
}

function pieceWasFoundProtical(availiblePiece, allPieces) {
  const message = `The ${availiblePiece.name} peice is now avialible!`;

  // console.log(message);
  // sendEmail(message);

  let updatedList = allPieces.filter(
    (piece) => piece.itemNumber != availiblePiece.itemNumber
  );
  fs.writeFile("pieces.json", JSON.stringify(updatedList), "utf8", (err) =>
    err ? console.log("Error", err) : console.log("Updated Pices")
  );
}

// function sendEmail(messageBody) {
//   let currentTime = new Date();

//   const msgToSend = {
//     to: "samscamp@live.com", // Change to your recipient
//     from: process.env.HOST_EMAIL_NAME, // Change to your verified sender
//     subject: `Piece was found at ${currentTime.toLocaleTimeString()}`,
//     text: messageBody,
//   };

//   sgMail
//     .send(msgToSend)
//     .then(() => {
//       console.log("Email sent");
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

function fetchPiecesToLookFor() {
  let rawdata = fs.readFileSync("parts.json");
  // console.log(JSON.parse(rawdata));
  return JSON.parse(rawdata);
}
function getElementIds(setNumber) {
  let thisSet = { setNumber };
  fetchLegoInfo(thisSet, true);
}
getElementIds(11030);
// getElementIds(4411);
//11027
//11030

cron.schedule("*/5 * * * *", () => {
  const piecesToSearchFor = fetchPiecesToLookFor().sets;
  console.log("calling API...");
  // console.log(piecesToSearchFor);
  piecesToSearchFor.forEach((set) => {
    // console.log("huh");
    // console.log(piece);
    // fetchLegoInfo(set, piecesToSearchFor);
    fetchLegoInfo(set);
  });
});

/**
 * {
  color: '',
  colorFamily: 'Tr. Opalescence',
  description: 'PLATE 1X1 ROUND',
  designId: 34823, // part number
  isIPElement: false,
  imageUrl: 'https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/6430373.jpg',
  itemNumber: 6430373,  //element id
  itemQuantity: 4,
  price: { amount: 0, currency: '' },
  maxAmount: 4,
  isAvailable: true,
  unavailableReason: null,
  isSoldOut: true,
  category: 'Plates, Special Circles And Angles',
  materialType: 'ELEMENT'
}
 */
