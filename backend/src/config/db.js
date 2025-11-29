const mongoose = require('mongoose');

module.exports = async function connect() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI missing in .env');

  await mongoose.connect(uri, { dbName: 'comp3123_assigment1' });
  console.log('✅ MongoDB connected');
};
