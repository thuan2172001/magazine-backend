const request = require('request');

function postJSON(url, payload) {
  return new Promise((resolve, reject) => {
    request(
      {
        url,
        method: 'POST',
        json: true,
        body: payload,
      },
      (err, response, body) => {
        console.log('🚀 ~ file: api-sender.js ~ line 13 ~ return newPromise ~ body', body);
        if (err) {
          console.log(err.message); return reject(err);
        }
        if (response.statusCode !== 200) {
          console.log(body);
          return reject(body);
        }
        return resolve(body);
      },
    );
  });
}

// function getJSON(url, token) {
//   return new Promise((resolve, reject) => {
//     request(
//       {
//         url,
//         method: 'GET',
//         headers: {
//           authorization: token,
//           cookie:
//             'datr=DLrxXvri6Rj9A49jBBaEqVXz; sb=ErrxXvJPL6k07oA3kUFjBTgp; _fbp=fb.1.1593084250425.774986473; c_user=100005554472534; xs=20%3AVOxs5GJQEnQmNw%3A2%3A1595118251%3A9283%3A6370; dpr=2; m_pixel_ratio=2; spin=r.1002461820_b.trunk_t.1596547573_s.1_v.2_; js_ver=3868; locale=en_US; wd=1440x749; fr=1OL7SJEQDUsvdE5uD.AWW5zYEuDrbTHfsvJHWSSLzEtNU.Be8LVq.aI.F8p.0.0.BfKk75.AWWKZzUZ; presence=EDvF3EtimeF1596608718EuserFA21B05554472534A2EstateFDsb2F1596599394442EatF1596599424159Et3F_5bDiFA2user_3a1B06666279942A2EoF1EfF4CAcDiFA2user_3a100486431730224A2EoF2EfF1CAcDiFA2user_3a1B03885920631A2EoF3EfF3CAcDiFA2thread_3a2452700494852709A2EoF4EfF2CAcDiFA2user_3a1B08394850583A2ErF1EoF5EfF5C_5dEutc3F1596608717765G596608718112Elm3FA2user_3a1B08394850583A2CEchF_7bCC; act=1596608731878%2F6',
//           'user-agent':
//             'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36',
//           'accept-language': 'en-GB,en;q=0.9,en-US;q=0.8,vi;q=0.7',
//           accept:
//             'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
//         },
//       },
//       (err, response, body) => {
//         if (err) return reject(err);
//         if(response.statusCode !== 200) return reject(body);
//         return resolve(body);
//       },
//     );
//   });
// }

function getJSON(url, payload) {
  return new Promise((resolve, reject) => {
    request(
      {
        url,
        method: 'GET',
        json: true,
        body: payload,
      },
      (err, response, body) => {
        if (err) return reject(err);
        if (response.statusCode !== 200) return reject(body);
        return resolve(body);
      },
    );
  });
}

function deleteJSON(url, payload) {
  return new Promise((resolve, reject) => {
    request(
      {
        url,
        method: 'DELETE',
        json: true,
        body: payload,
      },
      (err, response, body) => {
        if (err) return reject(err);
        if (response.statusCode !== 200) return reject(body);
        return resolve(body);
      },
    );
  });
}

function updateJSON(url, payload) {
  return new Promise((resolve, reject) => {
    request(
      {
        url,
        method: 'PUT',
        json: true,
        body: payload,
      },
      (err, response, body) => {
        console.log('🚀 ~ file: api-sender.js ~ line 96 ~ returnnewPromise ~ body', body);
        if (err) return reject(err);
        if (response.statusCode !== 200) return reject(body);
        return resolve(body);
      },
    );
  });
}

module.exports = {
  getJSON,
  postJSON,
  deleteJSON,
  updateJSON,
};
