const cron = require('node-cron');

cron.schedule('1 * * * *', () => {
  console.log('Эта задача выполняется каждую минуту');
});

// Держим процесс Node.js активным
setInterval(() => {}, 1000);
