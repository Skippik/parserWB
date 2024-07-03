import dayjs from 'dayjs';

export const asDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD');
};
