# skycraper

This application will get part availability info from TLG.

## Authors

- [@ToastBubbles](https://www.github.com/ToastBubbles)

## Requirements:

requires a keys.js file...

```bash
const keys = {
  leg0: "your_key_here",
};
exports.keys = keys;
```

and a parts.json (requires parent set number)...

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
