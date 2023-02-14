let axios = require("axios");
var cron = require("node-cron");
const fs = require("fs");
const { keys } = require("./keys");
// const sgMail = require("@sendgrid/mail");
require("dotenv").config();

// sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
console.log("started");
function fetchLegoInfo(LegoObject, allPieces) {
  console.log(LegoObject.setNumber);
  axios.defaults.headers.common = {
    "x-api-key": keys.leg0,
  };

  axios
    .get(
      `https://bricksandpieces.services.lego.com/api/v1/bricks/product/${LegoObject.setNumber}`,
      {
        params: {
          country: "US",
          orderType: "buy",
        },
      }
    )
    .then((res) => {
      handleLegoResponse(res.data, LegoObject, allPieces);
      console.log(LegoObject.setNumber);
    });
}

function handleLegoResponse(responseData, pieceToLookFor, allPieces) {
  console.log(responseData);
  const inStockPieces = responseData.bricks.filter((piece) => !piece.isSoldOut);
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

  console.log(message);
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
  let rawdata = fs.readFileSync("pieces.json");
  return JSON.parse(rawdata);
}
const piecesToSearchFor = [{ setNumber: "4411" }];
cron.schedule("*/1 * * * *", () => {
  //const piecesToSearchFor = fetchPiecesToLookFor();
  console.log("calling API...");

  piecesToSearchFor.forEach((piece) => fetchLegoInfo(piece, piecesToSearchFor));
});
