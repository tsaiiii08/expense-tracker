const express = require('express')
const router = express.Router()
const Expense = require('../../models/expense')

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/new', (req, res) => {
  const { name, date, category, amount } = req.body
  Expense.create({ name, date, category, amount })
    .then(()=> res.redirect('/'))
})

router.get('/edit', (req, res) => {
  res.render('edit')
})

module.exports = router