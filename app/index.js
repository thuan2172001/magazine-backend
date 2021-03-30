const main = require('./main');

main()
  .catch((err) => {
    console.log(err);
    process.exit(0);
  });
