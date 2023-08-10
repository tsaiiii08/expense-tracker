const express = require('express')
const router = express.Router()
const Expense = require('../../models/expense')
const Category = require('../../models/category')

//新增一筆支出的畫面
router.get('/new', (req, res) => {
  res.render('new')
})
//新增一筆支出
router.post('/new', async(req, res) => {
  const userId = req.user._id
  const { name, date, categoryId, amount } = req.body
  try{
    await Expense.create({ name, date, categoryId, amount, userId })
    res.redirect('/')
  } catch (error){
    console.log('error is on add a new expense')
  }
  
})
//編輯一筆支出的畫面
router.get('/edit/:id', async (req, res) => {
  const userId = req.user._id
  const id = req.params.id
  try{
    const { name, amount, date, categoryId } = await Expense.findOne({ _id: id,userId})
    const categoryList = await Category.findOne({ id: categoryId }).lean()
    const category = categoryList.name
    const transformateDate = date.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
    res.render('edit', { id, name, amount, date: transformateDate, category, categoryId })
  } catch(error){
    console.log('error is on edit a expense')
  }
})

//完成編輯
router.put('/:id', async (req, res) => {
  const userId = req.user._id
  const id = req.params.id
  const { name, amount, date, categoryId } = req.body
  try{
    await Expense.findOneAndUpdate({ _id: id, userId }, { name, amount, date, categoryId })
    res.redirect('/')
  } catch(error){
    console.log('error is on finish edit')
  }
})

//刪除一筆支出紀錄
router.delete('/:id', async (req, res) => {
  const userId = req.user._id
  const id = req.params.id
  try{
     await Expense.findOneAndRemove({ _id: id,userId })
  res.redirect('/')
  } catch(error){
    console.log('error is on delet expense')
  }
})

module.exports = router