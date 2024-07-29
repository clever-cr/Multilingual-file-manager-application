import fileQueue from '../queues/queue';
import File from '../models/file';

describe('Queue', () => {
  it('should process file upload job', async () => {
    const jobData = {
      userId: 'userId123',
      name: 'testfile.txt',
      buffer: Buffer.from('This is a test file'),
      size: 1024,
      type: 'text/plain',
    };

    fileQueue.process(async (job, done) => {
      try {
        const { userId, name, buffer, size, type } = job.data;
        const filePath = path.join(__dirname, '../uploads', userId, name);
        fs.writeFileSync(filePath, buffer);

        const file = new File({ userId, name, path: filePath, size, type });
        await file.save();

        done();
      } catch (error) {
        done(error);
      }
    });

    const job = await fileQueue.add(jobData);
    const result = await job.finished();

    expect(result).toBeUndefined(); // done() does not return a value
    const savedFile = await File.findOne({
      userId: jobData.userId,
      name: jobData.name,
    });
    expect(savedFile).not.toBeNull();
    expect(savedFile).toHaveProperty('name', 'testfile.txt');
  });
});
