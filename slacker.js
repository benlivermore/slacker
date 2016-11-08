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

    const entity = args.trim();
    const token = 'MTpDQ3ZyK0I5WFpHeXdEK3hvZHJEU0xmeDFFSUs1NU5WM3JOVXZmSXQ5L2FzPQ==';

    return request(`https://intellifylearning.tpondemand.com/api/v1/UserStories/${entity}?access_token=${token}&format=json`, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const ticket = JSON.parse(body);

        const message = 
        `${ticket.Name}
Status: ${ticket.EntityState.Name}`
        return res.json({
          response_type: 'ephemeral',
          text: `https://intellifylearning.tpondemand.com/entity/${entity}`,
          attachments: [{
            text: message
          }]
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
