
const app = require('./src/app');

const PORT = 3505;



const server = app.listen(PORT, () => {
  console.log(
    'Sever listen PORT::',
    PORT
  );
});

process.on('SIGINT', () => {
  server.close(() =>
    console.log('Exit Server Express')
  );
});
