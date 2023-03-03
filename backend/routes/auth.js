const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser=require('../middleware/fetchuser');

const JWT_SECRET = 'IMNOTBAD$OK'

//Route 1:create a user with Post '/api/auth/createuser'. No login required
router.post('/createuser', [
  
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Enter a valid password').isLength({ min: 5 }),
  body('name').isLength({ min: 3 }),
], async (req, res) => {
  let success=false;
  //if there are no errors then return Bad request and the errors. 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }

  try {

    //check whether the email is already exist

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(404).json({success, error: 'sorry a user with this email is already exists.' })
    }
    const salt = await bcrypt.genSalt(10)
    const secPass = await bcrypt.hash(req.body.password, salt)
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    })
    const data = {
      user: {
        id: user.id
      }

    }
    const authtoken = jwt.sign(data, JWT_SECRET)
    
    // res.json(user);
    success=true;
    res.json({success, authtoken })


  } catch (error) {
    console.error(error.message)
    res.status(500).send('Some error occured.')
  }

})

//Route 2:authenticate a user with Post '/api/auth/login'. No login required
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'password can not be blank').exists(),
], async (req, res) => {
  let success=false;
  //if there are no errors then return Bad request and the errors. 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let user =await User.findOne({email});
    if (!user) {
      success=false;
      return res.status(404).json({success, error: 'Please login with the correct credentials' });
    }

    const passCompare = await bcrypt.compare(password, user.password)

    if (!passCompare) {
      return res.status(404).json({ error: 'Please login with the correct credentials' });
    }
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET)
    success=true;
    res.json({success, authtoken })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Some error occured.')
  }
})

//Route 3:get a logged in user details with Post '/api/auth/getuser'. No login required
router.post('/getuser',fetchuser, async (req, res) => {

try {
  const userId=req.user;
  const user=await User.findOne({userId}).select('-password');
  res.send(user);
} catch (error) {
  console.error(error.message)
  res.status(500).send('Some error occured.')
}
})
module.exports = router