// Функция для вывода обратного отсчёта в консоль
const countdownTimer = (seconds: number) => {
  return new Promise<void>((resolve, reject) => {
    let timer = seconds;
    const interval = setInterval(() => {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(`Повторная попытка через ${timer} сек...`);
      timer--;
      if (timer < 0) {
        clearInterval(interval);
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        resolve();
      }
    }, 1000);
  });
};

export default countdownTimer;
