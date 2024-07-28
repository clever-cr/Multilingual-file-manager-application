import Bull from 'bull';

const fileQueue = new Bull('fileQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});

export default fileQueue;
