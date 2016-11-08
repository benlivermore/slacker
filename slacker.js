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
    const linksAddedText = req.body.text.replace(/#[0-9]+/g, (ticketDisplay) => {
      const entity = ticketDisplay.substr(1);
      return `<https://intellifylearning.tpondemand.com/entity/${entity}|${ticketDisplay}>`
    });
    const responseText = `${req.body.user_name} says: ${linksAddedText}`;
    const tickets = args.match(/^[0-9]+|#[0-9]+/g).map((ticketNum) => {
      return ticketNum.replace('#', '');
    });
    const whereClause = `&where=Id in (${tickets.join(',')})`;

    return request(`https://intellifylearning.tpondemand.com/api/v1/Assignables/?access_token=${tpToken}&format=json&${whereClause}`, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const items = JSON.parse(body).Items;
        
        const attachments = items.map((ticket) => {
          return {
            pretext: `https://intellifylearning.tpondemand.com/entity/${ticket.Id}`,
            text: `${ticket.Name}
Status: ${ticket.EntityState.Name}`
          }
        })
        return res.json({
          response_type: 'in_channel',
          text: responseText,
          attachments
        });
      } else {
        return res.json({});
      }
    });

  }

  return res.json({});
})


app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}`);
})
