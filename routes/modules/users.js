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
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  // 檢查使用者是否已經註冊
  const user =  await User.findOne({ email })
  // 如果已經註冊：退回原本畫面
  if (user) {
    errors.push({ message: '這個 Email 已經註冊過了。' })
    res.render('register', { name, email, password, confirmPassword, errors })
  } else {
    // 如果還沒註冊：寫入資料庫
    await User.create({name,email, password})
      res.redirect('/')
    }
  })

router.get('/logout',  (req, res) => {
  req.logout(function (err) {
      if (err) { return err}
      req.flash('success_msg', '你已經成功登出。')
      res.redirect("/users/login");
  });
})

module.exports = router