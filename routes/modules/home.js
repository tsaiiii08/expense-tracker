const express = require('express')
const router = express.Router()
const Expense = require('../../models/expense')
const Category = require('../../models/category')

//查看所有支出紀錄
router.get('/', async(req, res) => {
  const userId = req.user._id
  let totalAmount = 0
  let expenses = []
  try {
    let rawExpenses = await Expense.find({ userId }).lean()
    await Promise.all(
      rawExpenses.map(async rawExpense => {
      const categoryList = await Category.findOne({ id: rawExpense.categoryId }).lean()
      rawExpense.icon = categoryList.icon
      rawExpense.date = rawExpense.date.toJSON().slice(0, 10)
      totalAmount += rawExpense.amount
      expenses.push(rawExpense)
      })
    )
    res.render('index', { expenses, totalAmount })
  } catch(error){
    console.log('error is on find all expenses')
  }
})

//依選擇的類別顯示支出
router.get('/category/:category', async (req, res) => {
  const userId = req.user._id
  const categoryArr = {home:'1',traffic:'2',entertainment:'3',food:'4',others:'5'}
  const categoryEng = req.params.category
  const categoryId = categoryArr[`${categoryEng}`]
  try{
    const categoryList = await Category.findOne({ id:categoryId }).lean()
    const categoryName = categoryList.name
    let totalAmount = 0
    let expenses = []
    let rawExpenses = await Expense.find({ categoryId, userId }).lean()
    rawExpenses.map(rawExpense => {
      rawExpense.icon = categoryList.icon
      rawExpense.date = rawExpense.date.toJSON().slice(0, 10)
      totalAmount += rawExpense.amount
      expenses.push(rawExpense)
    })
    res.render('index', { expenses, totalAmount, categoryName })
  } catch (error) {
    console.log('error is on find expenses of specific category')
  }
})

module.exports = router