import express from 'express';
import path from 'path';
import {
  API_PREFIX,
  MONGODB_DATABASE,
  MONGODB_PASS,
  MONGODB_PORT,
  MONGODB_URL,
  MONGODB_USER,
  NODE_ENV,
  PORT,
  PROJECT_NAME,
} from './environment';
import * as db from './database';
import {seed} from './seed-data/seed';
import {sendEmail} from "./api/client/nodemailer/mail.service";
import {PostAccepted} from "./api/client/nodemailer/PostAcceptedTemplate";
import Role from "./models/role";
import User from "./models/user";
import AcademicYear from "./models/academic_year";
import * as AcademicYearService from "../app/api/client/academicYear/academicYear.service"

const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cron = require('node-cron');
const nodemailer = require('nodemailer');

const app = express();
const server = require('http').Server(app);
const fs = require('fs');
module.exports = () => {
  console.log('Bootstrap starting time', new Date());
  const urlConnection = `mongodb://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_URL}:${MONGODB_PORT}/${MONGODB_DATABASE}`;
  console.log(urlConnection);
  const errMes = {};
  if (!fs.existsSync('uploads')){
    fs.mkdirSync('uploads');
  }
  const dbConnect = () => db
    .connect(urlConnection)
    .then(async (msg) => {
      console.log(msg);
      console.log('MongoDB Url: ', MONGODB_URL);
      return seed().then(() => {
        console.log('Seed success!');
      }).catch((e) => {
        console.log('Seed error', e.stack);
        errMes.e = e.stack;
      });
    }).catch((err) => {
      console.log(err.message);
      console.log('ERROR DATABASE', err);
      throw err;
    })
  const initApi = () => {
    if (NODE_ENV !== 'production') {
      app.use(morgan('dev'));
    }
    app.use(cors());
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(API_PREFIX, require('./api'));
    app.use('/mobile/build', express.static(`${__dirname}/../mobile/build`));
    app.use('/uploads', express.static(`${__dirname}/../uploads`));
    app.use(express.static(`${__dirname}/../deploy/build`));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../deploy/build', 'index.html'));
    });
    app.use((err, req, res, next) => {
      res.json({error: errMes.e ?? 'DO_YOU_LIKE_SCHOOL?'});
    });
    console.log('Bootstrap ending time', new Date());
  }

  const SentEmailToCoordinators = async () => {
    const coordinatorRole = await Role.findOne({role: 'coordinator'})
    const allCoordinators = await User.find({role: coordinatorRole})
    allCoordinators.map(item => {
      console.log(item.email + item.fullName)
      sendEmail(item.email, item.fullName, 'alertDays')
    })
    sendEmail('thuan2172001@gmail.com', 'Trinh Van Thuan', 'alertDays')
  }

  SentEmailToCoordinators().then(r => console.log('sent email successfully'));

  let task = cron.schedule('0 7 * * *', async function() {
    const ActiveAcademicYear = await AcademicYear.findOne({status: 'Active'})
    console.log(ActiveAcademicYear)
    if (ActiveAcademicYear) {
      const finalClosureDate = ActiveAcademicYear.finalClosureDate
      const timeToAlert = ActiveAcademicYear.alertDays
      const today = new Date()
      const diffTime = finalClosureDate.getTime() - today.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)
      console.log(diffDays)
      console.log('Running Cron Job');
      if (diffDays <= timeToAlert && diffDays > 0) {
        const coordinatorRole = await Role.findOne({role: 'coordinator'})
        const allCoordinators = await User.find({role: coordinatorRole})
        allCoordinators.map(item => {
          console.log(item.email + item.fullName)
          sendEmail(item.email, item.fullName, 'alertDays')
        })
      }
      // if (finalClosureDate.getTime() - today.getTime() <= 0) AcademicYearService.update({
      //   ...ActiveAcademicYear,
      //   status: 'Complete'
      // }).then(() => console.log("end active academic year"))
    }
  });

  task.start()

  return Promise.all([dbConnect(), initApi()]).then((e) => {
    server.setTimeout(7200000);
    server.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`${PROJECT_NAME} server is listening on port ${PORT}`);
      console.log(new Date());
    });
  }).catch(err => {
    console.log('Something wrong!', err);
  });
};

module.exports.server = server;
