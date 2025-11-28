import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

async function main() {
  try {
    const port = config.port || 5000;
    await mongoose.connect(config.database_url as string);

    app.listen(port, () => {
      console.log(`FitNest server is listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
