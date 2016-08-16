var mailer = require('nodemailer');
var config = require('./config');
var lang = require('./lang');
var mail_conf = config.get('mail');

var transport = mailer.createTransport({
  host: mail_conf.host,
  secureConnection: mail_conf.secureConnection, // use SSL
  port: mail_conf.port, // port for secure SMTP
  auth: {
    user: mail_conf.auth.user,
    pass: mail_conf.auth.pass
  }
});

function sendMail(to_user, subject, content) {
  transport.sendMail({
    from: mail_conf.auth.user,
    to: to_user,
    subject: subject,
    generateTextFromHTML: true,
    html: content
  }, function(error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log("Message sent: " + response.message);
    }
    transport.close();
  });
}

exports.sendApplyAuthorized = function(to_user, auth_url, code) {
  var content = lang.get('MAIL_APPLY_AUTHORIZED_TPL').replace(/{%url%}/g, auth_url).replace(/{%code%}/g, code);
  var subject = lang.get('MAIL_APPLY_AUTHORIZED_SUBJECT');
  sendMail(to_user, subject, content);
};