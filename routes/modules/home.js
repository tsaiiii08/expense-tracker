const express = require('express')
const router = express.Router()
const Expense = require('../../models/expense')
const Category = require('../../models/category')

router.get('/', async(req, res) => {
  let sum = 0
  let expenses = []
  let rawExpenses = await Expense.find().lean()
  await Promise.all(
    rawExpenses.map(async rawExpense => {
    const catergory = await Category.findOne({ id: rawExpense.categoryId }).lean()
    rawExpense.icon = catergory.icon
    rawExpense.date = rawExpense.date.toJSON().slice(0, 10)
    sum += rawExpense.amount
    expenses.push(rawExpense)

    })
  )
  res.render('index', { expenses, sum })
})

module.exports = router