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
    const categoryList = await Category.findOne({ id: rawExpense.categoryId }).lean()
      rawExpense.icon = categoryList.icon
    rawExpense.date = rawExpense.date.toJSON().slice(0, 10)
    sum += rawExpense.amount
    expenses.push(rawExpense)

    })
  )
  res.render('index', { expenses, sum })
})

//依選擇的類別顯示支出
router.get('/category/:category', async (req, res) => {
  const categoryArr = {home:'1',traffic:'2',entertainment:'3',food:'4',others:'5'}
  const categoryEng = req.params.category
  const categoryId = categoryArr[`${categoryEng}`]
  const categoryList = await Category.findOne({ id:categoryId }).lean()
  const categoryName = categoryList.name
  let sum = 0
  let expenses = []
  let rawExpenses = await Expense.find({ categoryId }).lean()
  rawExpenses.map(rawExpense => {
    rawExpense.icon = categoryList.icon
    rawExpense.date = rawExpense.date.toJSON().slice(0, 10)
    sum += rawExpense.amount
    expenses.push(rawExpense)
  })
  
  res.render('index', { expenses, sum, categoryName })

})

module.exports = router