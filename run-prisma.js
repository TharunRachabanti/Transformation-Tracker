const { spawn } = require('child_process');

process.env.DATABASE_URL = "postgresql://postgres.akaxfinhrriyfmygmdco:Tharun%402081182114@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres";
process.env.DIRECT_URL = "postgresql://postgres.akaxfinhrriyfmygmdco:Tharun%402081182114@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres";

const child = spawn('node', ['./node_modules/prisma/build/index.js', 'db', 'push'], {
  stdio: 'inherit',
  env: process.env
});

child.on('exit', (code) => {
  process.exit(code);
});
