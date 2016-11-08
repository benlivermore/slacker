'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const request = require('request');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

const tpToken = process.env['TP_TOKEN'];
const PORT = process.env['PORT'] || 3000;

app.post('/tp/ticket', function (req, res) {
  const command = req.body.command;
  const args = req.body.text;
  if (command === '/ticket') {

    const text = args.trim();

    let responseText;
    if (!isNaN(text)) {
      responseText = `https://intellifylearning.tpondemand.com/entity/${text}`;
      return request(`https://intellifylearning.tpondemand.com/api/v1/UserStories/${text}?access_token=${tpToken}&format=json`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          const ticket = JSON.parse(body);
          
          const message = 
          `${ticket.Name}
  Status: ${ticket.EntityState.Name}`
          return res.json({
            response_type: 'in_channel',
            text: responseText,
            attachments: [{
              text: message
            }]
          });
        } else {
          return res.json({});
        }
      });
    } else {
      responseText = text.replace(/#[0-9]*/, (ticketDisplay) => {
        const entity = ticketDisplay.substr(1);
        return `<https://intellifylearning.tpondemand.com/entity/${entity}|${ticketDisplay}>`
      });
      return res.json({
        response_type: 'in_channel',
        text: responseText
      })
    }

  }

  return res.json({});
})


app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}`);
})
