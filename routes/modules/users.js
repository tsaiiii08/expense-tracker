const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async(req, res) => {
  // 取得註冊表單參數
  const { name, email, password, confirmPassword } = req.body
  // 檢查使用者是否已經註冊
  const user =  await User.findOne({ email })
  // 如果已經註冊：退回原本畫面
  if (user) {
      console.log('User already exists.')
      res.render('register', {name,email,password,confirmPassword})
  } else {
    // 如果還沒註冊：寫入資料庫
    await User.create({name,email, password})
      res.redirect('/')
    }
  })

router.get('/logout',  (req, res) => {
  req.logout(function (err) {
    if (err) { return err; }
    res.redirect("/");
  });
})

module.exports = router