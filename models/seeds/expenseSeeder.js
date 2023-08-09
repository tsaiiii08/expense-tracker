const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Expense = require('../expense')
const User = require('../user')
const Category = require('../category')
const db = require('../../config/mongoose')
const SEED_USER =
[
  {
    name: '廣志',
    email: 'user1@example.com',
    password: '12345678'
  },
  {
    name: '小新',
    email: 'user2@example.com',
    password: '12345678'
  }
]

const expensesList = [
  {
    name: '午餐',
    date: '2019.04.23',
    category: '餐飲食品',
    amount: 60
  },
  {
    name: '晚餐',
    date: '2019.04.23',
    category: '餐飲食品',
    amount: 60
  },
  {
    name: '捷運',
    date: '2019.04.23',
    category: '交通出行',
    amount: 120
  },
  {
    name: '租金',
    date: '2015.04.01',
    category: '家居物業',
    amount: 25000
  },
  {
    name: '電影：驚奇隊長',
    date: '2019.04.23',
    category: '休閒娛樂',
    amount: 220
  }
]
db.once('open', async () => {
  await Promise.all(
    SEED_USER.map(async(user,user_index)=>{
      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(user.password, salt)
      const userData = await User.create({ name: user.name, email: user.email,password: hashPassword})
      console.log('user is created')
      if (user_index === 0){
        for (let i = 0; i < 4; i++) {
          const categoryData = await Category.findOne({name:expensesList[i].category})
          await Expense.create({ name: `${expensesList[i].name}`, date: `${expensesList[i].date}`, amount: `${expensesList[i].amount}` , categoryId: categoryData.id, userId: userData._id})
        }
      } else {
        const categoryData = await Category.findOne({ name: expensesList[4].category })
        await Expense.create({ name: expensesList[4].name, date: expensesList[4].date, amount: expensesList[4].amount, categoryId:categoryData.id, userId: userData._id })
      }
    })
  )
  console.log('expenseSeeder is done.')
  process.exit()
})
