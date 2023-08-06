const express = require('express')
const router = express.Router()
const Expense = require('../../models/expense')

router.get('/', (req, res) => {
  let sum = 0
  Expense.find()
  .lean()
  .then(expenses => {
    expenses.forEach(expense => {
      expense.date = expense.date.toJSON().slice(0, 10)
      sum += expense.amount
    })
    return expenses
  })
  .then(expenses => {
    res.render('index', { expenses, sum })
  })
  .catch(err => console.log(err))
})

module.exports = router