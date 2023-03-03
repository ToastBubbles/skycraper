# skycraper

This application will get PaB part availability info from TLG.

## Authors

- [@ToastBubbles](https://www.github.com/ToastBubbles)

## Requirements:

requires a keys.js file... (you can find the key online if you look hard enough 👀)

```bash
const keys = {
  leg0: "your_key_here",
  //optional email notification:
  sg: "your_sendgrid_key_here",
  email: "recievingEmailAddress@example.com", //email that recieves notification
  sendEmail: "senderEmailAddress@example.com" //email that sends notification
};
exports.keys = keys;
```

and a parts.json (requires parent set number and element ID's)...

```bash
{
  "sets": [
    {
      "setNumber": 11111,
      "parts": [123456,234567]
    },
    {
      "setNumber": 2222,
      "parts": [987654]
    }
  ]
}
```

## How to run:

Clone the project

```bash
  git clone https://github.com/ToastBubbles/skyscraper
```

Make the keys.js and parts.json in the main directory, fill in desired information.

(if using an email service (ie Sendgrid), make sure to follow their setup procedures and add their respective keys.)

Navigate to the project directory

```bash
  cd skyscraper
```

Install dependencies

```bash
  npm i
```

Run the project

```bash
  node index
```
