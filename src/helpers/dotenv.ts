import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const expandEnv = (file: string) => {
  try {
    const buf = fs.readFileSync(file);
    const parsed = dotenv.parse(buf);
    dotenvExpand.expand({ parsed });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return;
    }

    console.log(error);
  }
};

const config = () => {
  const envFile = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
  const envFileLocal = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}.local`);

  // keep order
  [envFileLocal, envFile].forEach((file) => {
    expandEnv(file);
  });

  dotenv.config();
};

export default config;
