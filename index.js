let axios = require("axios");
var cron = require("node-cron");
const fs = require("fs");
const { keys } = require("./keys");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

let usingEmailService = !!keys.sg;
if (usingEmailService) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

let foundParts = [];
let lookingForParts = fetchPiecesToLookFor();

console.log("started");
function fetchLegoInfo(LegoObject, showAll = false, allPieces) {
  axios.defaults.headers.common = {
    "x-api-key": keys.leg0,
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
        },
      }
    )
    .then((res) => {
      // console.log(res.statusText);
      if (res.statusText == "OK") {
        handleLegoResponse(res.data, LegoObject, showAll, allPieces);
      }
    });
}

function handleLegoResponse(responseData, pieceToLookFor, showAll, allPieces) {
  // const inStockPieces = responseData.bricks.filter((piece) => !piece.isSoldOut);
  // const outStockPieces = responseData.bricks.filter((piece) => piece.isSoldOut);
  responseData.bricks.forEach((brick) => {
    if (!showAll) {
      if (pieceToLookFor.parts.includes(brick.itemNumber)) {
        !brick.isSoldOut && pieceWasFoundProtocol(brick);

        brick.isSoldOut &&
          console.log(
            `${brick.colorFamily} ${brick.description} is NOT available`
          );
      }
    } else {
      console.log(brick.description, brick.colorFamily, brick.itemNumber);
    }
  });
}

function pieceWasFoundProtocol(foundPart) {
  const message = `The ${foundPart.description} peice is now avialible!`;

  console.log(message);
  if (usingEmailService) {
    sendEmail(message);
  }

  foundParts.push(foundPart);

  for (let p = 0; p < lookingForParts.sets.length; p++) {
    lookingForParts.sets[p].parts.forEach((part) => {
      if (part == foundPart.itemNumber) {
        lookingForParts.sets[p].parts.splice(
          lookingForParts.sets[p].parts.indexOf(foundPart.itemNumber),
          1
        );
      }
    });
  }
}

function sendEmail(messageBody) {
  let currentTime = new Date();

  const msgToSend = {
    to: keys.email, // Change to your recipient
    from: keys.sendEmail, // Change to your verified sender
    subject: `Piece was found at ${currentTime.toLocaleTimeString()}`,
    text: messageBody,
  };
  console.log(msgToSend);

  sgMail
    .send(msgToSend)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
      console.log("dont work");
    });
}
// }

function fetchPiecesToLookFor() {
  let rawdata = fs.readFileSync("parts.json");
  return JSON.parse(rawdata);
}
function getElementIds(setNumber) {
  let thisSet = { setNumber };
  fetchLegoInfo(thisSet, true);
}
// getElementIds(60374);
// getElementIds(4411);
//11027
//11030

cron.schedule("*/1 * * * *", () => {
  const piecesToSearchFor = lookingForParts.sets;
  console.log("calling API...");
  piecesToSearchFor.forEach((set) => {
    fetchLegoInfo(set);
  });
});

/**          templet:
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
