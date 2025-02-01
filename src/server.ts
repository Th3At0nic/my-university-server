import { Server } from 'http';
import app from './app';
import config from './app/config';
import mongoose from 'mongoose';
import seedSuperAdmin from './app/DB';
let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    const superAdmin = await seedSuperAdmin();
    if (superAdmin) {
      console.log(superAdmin);
    }

    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

process.on('unhandledRejection', () => {
  console.log(`An unhandledRejection detected! Shutting down...`);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log('An uncaughtException detected! Shutting down...');
  process.exit(1);
});
