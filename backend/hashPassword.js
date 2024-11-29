const bcrypt = require('bcrypt');

const hashPassword = async (plainTextPassword) => {
  const hashedPassword = await bcrypt.hash(plainTextPassword, 10);
  console.log('Hashed Password:', hashedPassword);
};

hashPassword('staffLogin123');
