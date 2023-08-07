const express = require('express')
const router = express.Router()
const Expense = require('../../models/expense')
const Category = require('../../models/category')

//新增一筆支出的畫面
router.get('/new', (req, res) => {
  res.render('new')
})
//新增一筆支出
router.post('/new', (req, res) => {
  const { name, date, categoryId, amount } = req.body
  Expense.create({ name, date, categoryId, amount })
    .then(()=> res.redirect('/'))
})
//編輯一筆支出的畫面
router.get('/edit/:id', async (req, res) => {
  const id = req.params.id
  const { name, amount, date, categoryId } = await Expense.findOne({_id:id})
  const categoryList = await Category.findOne({ id: categoryId }).lean()
  const category = categoryList.name
  const transformateDate = date.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
  res.render('edit', { id, name, amount, date: transformateDate, category, categoryId })
})
//完成編輯
router.put('/:id', async (req, res) => {
  const id = req.params.id
  const { name, amount, date, categoryId } = req.body
  await Expense.findOneAndUpdate({ _id: id }, { name, amount, date, categoryId })
  res.redirect('/')
})

module.exports = router