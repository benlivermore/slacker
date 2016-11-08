const express = require('express');
const bodyParser = require('body-parser');
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

const PORT = process.env['PORT'] || 3000;

app.post('/tp/ticket', function (req, res) {
  const command = req.body.command;
  const args = req.body.text;

  if (command === '/ticket') {

    const entity = args.trim();
    return res.json({
      response_type: 'ephemeral',
      text: `https://intellifylearning.tpondemand.com/entity/${entity}` 
    });

  }

  return res.json({});
})


app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}`);
})
