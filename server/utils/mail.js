const Mailgun = require('mailgun-js');
const juice = require('juice');

class EmailMiddleware {
  constructor(app, {apiKey, domain} = {})
  {
    this.app = app;
    this.mailgun = Mailgun({
      apiKey: apiKey || process.env.MAILGUN_APIKEY,
      domain: domain || process.env.MAILGUN_DOMAIN
    });
    
    app.mail = this;
  }
  async send(to, subject, template, data)
  {
    const html = await this.renderTemplate(template, data);
    return this.sendMail(to, subject, html);
  }
  async renderTemplate(template, data = {})
  {
    return new Promise((resolve, reject) => {
      this.app.render(template, data, (error, html) => {
        error ? reject(error) : resolve(html);
      });
    }).then(html => juice(html));
  }
  async sendMail(to, subject, html)
  {
    return new Promise((resolve, reject) => {
      this.mailgun.messages().send({
        from: 'martijn@touchtribe.nl',
        to,
        subject,
        html
      }, (error, body) => {
        error ? reject(error) : resolve(body);
      })
    })
  }
}
module.exports = (app, config) => {
  new EmailMiddleware(app, config);
};
