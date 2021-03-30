import { MAIL_NAME, PASSWORD } from '../../../environment';

const mailer = require('nodemailer');

const { PostAccepted } = require('./PostAcceptedTemplate');

const getEmailData = (to, name, template) => {
  let data = null;

  switch (template) {
    case 'postAccepted':
      data = {
        from: 'Magazine Admin <MAIL_NAME>',
        to,
        subject: `Hello ${name}`,
        html: PostAccepted(name, 'Your post has been accepted!'),
      };
      break;
    case 'postCreated':
      data = {
        from: 'Magazine Admin <MAIL_NAME>',
        to,
        subject: `Hello ${name}`,
        html: PostAccepted(name, 'A post has been created!'),
      };
      break;
    case 'postRejected':
      data = {
        from: 'Magazine Admin <MAIL_NAME>',
        to,
        subject: `Hello ${name}`,
        html: PostAccepted(name, 'Your post has been rejected!'),
      };
      break;
    case 'alertDays':
      data = {
        from: 'Magazine Admin <MAIL_NAME>',
        to,
        subject: `Hello ${name}`,
        html: PostAccepted(name, 'You need to check the posts. The final closure date is coming soon!'),
      };
      break;
    default:
      data;
  }
  return data;
};

const sendEmail = (to, name, type) => {
  const smtpTransport = mailer.createTransport({
    service: 'Gmail',
    auth: {
      user: MAIL_NAME,
      pass: PASSWORD,
    },
  });

  const mail = getEmailData(to, name, type);

  smtpTransport.sendMail(mail, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      console.log('sent mail successfully');
    }
    smtpTransport.close();
  });
};

module.exports = {
  sendEmail,
};
