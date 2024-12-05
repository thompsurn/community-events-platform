const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log('Hashed Password:', hash);
}

hashPassword('NewStaffPassword123!'); // Replace with your desired password



