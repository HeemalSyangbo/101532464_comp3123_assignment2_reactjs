const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) {
    return res.status(409).json({
      status: false,
      message: 'Username or email already exists'
    });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hash });

  return res.status(201).json({
    message: 'User created successfully.',
    user_id: String(user._id)
  });
};

exports.login = async (req, res) => {
  const { email, username, password } = req.body;
  const filter = email ? { email } : { username };

  const user = await User.findOne(filter);
  if (!user)
    return res.status(401).json({
      status: false,
      message: 'Invalid Username and password'
    });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok)
    return res.status(401).json({
      status: false,
      message: 'Invalid Username and password'
    });

  return res.status(200).json({ message: 'Login successful.' });
};
