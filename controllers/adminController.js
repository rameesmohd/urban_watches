const User = require('../models/userModel')
const orderModel = require('../models/orders')
const bcrypt = require('bcrypt')
let mssg;

const securePassword = async(password)=> {
    try {
       const passwordHash = await bcrypt.hash(password,10);
       return passwordHash

    } catch (error) {
        console.log(error.message);
    }
}


const loadLogin = async(req,res)=>{
    try {
        res.render('login')
      

    } catch (error) {
        console.log(error.message);
    }
}


const verifyLogin  =async(req,res)=>{

    try {

        const Email = req.body.email
        const password = req.body.password

        const userData = await User.findOne({email:Email})
        if(userData){

            const passwordMatch  = await bcrypt.compare(password,userData.password)
            if(passwordMatch){

                if(userData.is_admin===0){
                    res.render('login',{message : "you are not admin!!!"})

                }else{
                    req.session.admin_id = userData._id;
                    res.redirect('/admin/dashboard')
                }
                
            }else{
                res.render('login',{message : "password is incurrect!!"})
            }

        }else{
            res.render('login',{message : "email and password is incurrect!"})
        }
        
    } catch (error) {
        console.log(error.message);
    }

}



const adminLogout = async(req,res)=>{
    try {
        
        req.session.admin_id = null;
        res.redirect('/admin')

    } catch (error) {
        console.log(error.message);
    }
}


const adminDashboard = async(req,res)=>{
    try {

    const orderData =  await orderModel.find({})
    
    let from = new Date()
    let to = new Date()
    

     //----SALES-TOTAL-&-COUNT------//

      let DeliveredOrderData = []

      orderData.forEach(element => {
        const filteredOrders = element.order.filter((value)=>value.status == 'Delivered')    
        DeliveredOrderData = DeliveredOrderData.concat(filteredOrders)
      });

      const countTotalSales = DeliveredOrderData.length

      const sumTotalSales = DeliveredOrderData.reduce((total,value)=>{return total+value.total},0)

      //-----SALES-TODAY-&-COUNT-------//

      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);

      let sumTodaySales=0;
      let countTodaySales=0

      DeliveredOrderData.forEach(element => {
            if(element.date >= from && element.date <= to){
                countTodaySales++
                sumTodaySales = sumTodaySales + element.total
            }
      });

      //------SALES-MONTH-&-COUNT------//

        from.setDate(1); // Set the day of the month to 1 to get the first day of the current month

        to.setMonth(to.getMonth() + 1); // Set the month to next month
        to.setDate(0); // Set the day to 0 to get the last day of the current month

        let sumThisMonthSales = 0;
        let countThisMonthSales = 0;

        DeliveredOrderData.forEach(element => {
            if (element.date >= from && element.date <= to) {
                countThisMonthSales++;
                sumThisMonthSales += element.total;
            }
        });
  
      //-------REVENUE------------//

      const totalRevenue = sumTotalSales*0.3

      const todayRevenue = sumTodaySales*0.3

      const monthRevenue = sumThisMonthSales*0.3

     //::::::::::::::-LINECHART::::::::::::::::::::::::::://
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const yearAgo = new Date(today);
      yearAgo.setFullYear(today.getFullYear() - 1);

      const currentDate = new Date()

      const currentMonth = currentDate.getMonth()

      const currentYear = currentDate.getFullYear()

      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

      const monthlyStart = new Date(currentYear, currentMonth, 1).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

      const monthlyEnd = new Date(currentYear, currentMonth, daysInMonth);

      //::::SALES-MONTH-&-COUNT:::::
      const dailySalesDetails = []
      const dailySalesCount = []

      for (let i = 2; i <= daysInMonth + 1; i++) {

          const dateOrdered = new Date(currentYear, currentMonth, i)

          const salesOfDay = DeliveredOrderData.filter((order) => {
              return new Date(order.date).toDateString() === dateOrdered.toDateString()
          })
       
          const totalSalesOfDay = salesOfDay.reduce((total, order) => {
              return total + order.total;
          }, 0);

          let productCountOfDay = 0;
          salesOfDay.forEach((order) => {
              productCountOfDay += order.quantity;
          });

          dailySalesDetails.push({ date: dateOrdered, totalSales: totalSalesOfDay, totalItemsSold: productCountOfDay });
          dailySalesCount.push(productCountOfDay)
      }
      

        //::::SALES-YEAR-CHART:::::::

        const monthlySalesData = [];

        for (let month = 0; month < 12; month++) {

        const startDate = new Date(currentYear, month, 1);

        const endDate = new Date(currentYear, month + 1, 0);

        const salesOfMonth = DeliveredOrderData.filter((order) => {
            const orderDate = new Date(order.date);
            return orderDate >= startDate && orderDate <= endDate;
        });

        const totalSalesOfMonth = salesOfMonth.reduce((total, order) => {
            return total + order.total;
        }, 0);

        let productCountOfMonth = 0;

        salesOfMonth.forEach((order) => {
            productCountOfMonth += order.quantity;
        });
        monthlySalesData.push(productCountOfMonth );
        }

        //console.log(monthlySalesData);

          
        //::::BAR CHART :::::::::::::
        const orderStatusData = []
        let statusData=[];
        let Data

        orderData.forEach(element => {
            Data = [];
            filteredOrders = element.order.filter((value)=>value.status == 'Order Confirmed')    
            Data = Data.concat(filteredOrders)
            Data.length > 0 ? statusData.push(Data) : null;
        });
        orderStatusData.push(statusData.length)
        statusData=[];

        orderData.forEach(element => {
             Data = [];
            filteredOrders = element.order.filter((value)=>value.status == 'Shipped')    
            Data = Data.concat(filteredOrders)
            Data.length > 0 ? statusData.push(Data) : null;
        });
        orderStatusData.push(statusData.length)
        statusData=[];

        orderData.forEach(element => {
             Data = [];
            filteredOrders = element.order.filter((value)=>value.status == 'Out for Delivery')    
            Data = Data.concat(filteredOrders)
            Data.length > 0 ? statusData.push(Data) : null;
        });
        orderStatusData.push(statusData.length)
        statusData=[];

        orderData.forEach(element => {
             Data = [];
            filteredOrders = element.order.filter((value)=>value.status == 'Delivered')    
            Data = Data.concat(filteredOrders)
            Data.length > 0 ? statusData.push(Data) : null;
        });
        orderStatusData.push(statusData.length)
        statusData=[];

        orderData.forEach(element => {
             Data = [];
            filteredOrders = element.order.filter((value)=>value.status == 'Canceled')    
            Data = Data.concat(filteredOrders)
            Data.length > 0 ? statusData.push(Data) : null;
        });
        orderStatusData.push(statusData.length)
        statusData=[];

        orderData.forEach(element => {
            Data = [];
            filteredOrders = element.order.filter((value)=>value.status == 'Requested For Return')    
            Data = Data.concat(filteredOrders)
            Data.length > 0 ? statusData.push(Data) : null;
        });
        orderStatusData.push(statusData.length)
        statusData=[];

        //------USERS----------------//

        const users = await User.find({is_admin : 0})
    
        const userCount = users.length

    res.render('dashboard',{
        sumTotalSales,
        countTotalSales,

        sumTodaySales,
        countTodaySales,

        sumThisMonthSales,
        countThisMonthSales,

        userCount,

        totalRevenue,
        todayRevenue,
        monthRevenue,

        dailySalesDetails,
        dailySalesCount,

        orderStatusData,
        monthlySalesData
    })

    } catch (error) {
        console.log(error.message);
    }
}

//admin users::::::::::::::::::::::::::::::::::::::

const adminUsers = async(req,res)=>{
    try {
        var search=''
        if(req.query.search){
            search = req.query.search;
        }

        const userData = await User.find({
            is_admin:0
            ,$or:[
                {name :{$regex : '.*'+search+'.*'}},
                {email :{$regex : '.*'+search+'.*'}},
                {mobile :{$regex : '.*'+search+'.*'}}
            ]
        })

        res.render('users',{users:userData,mssg})
        mssg = null;

    } catch (error) {
        console.log(error.message);
    }
}

//add new user

const addUserLoad = async(req,res)=>{
    try {
        res.render('new-user')
    } catch (error) {
        console.log(error.message);
    }
}

const addUser = async(req,res)=>{
    try {
        const Name = req.body.name
        const Email = req.body.email
        const Mno = req.body.mno
        const password = req.body.pass

        const Spassword =await securePassword(password)

        const user = new User({
            name : Name,
            email : Email,
            mobile : Mno,
            password : Spassword,
            is_admin : 0
        })

        const userData = await user.save();
        if(userData){
            mssg="User added succesfully"
            res.redirect('/admin/users')
        }else{
            res.render("new-user",{message:'Something went wrong'})
        }
    } catch (error) {
        console.log(error.message);
    }
}

//edit user::::::::::::::::::::::::::::::::::::::::
const editUserLoad = async(req,res)=>{
    try {
        const id = req.query.id
        const userData = await User.findById({_id : id})
        if(userData){
            res.render('edit-user',{ user:userData});
        }else{
            res.redirect('/admin/users');
        }
        
        
    } catch (error) {
        console.log(error.message);g
    }
}

const updateUser =async(req,res)=>{
    try {
       const userData = await User.findByIdAndUpdate({_id: req.body.id},{$set : {name:req.body.name,email:req.body.email,mobile:req.body.mno }})
        res.redirect('/admin/users')
    } catch (error) {
        console.log(error.message);
    }
}

const deleteUser = async(req,res)=>{
    try {
        
        const id=req.query.id;
        await User.deleteOne({ _id:id })
        res.redirect('/admin/users')

    } catch (error) {
        console.log(error.message);
    }
}

//Block && Unblock user

const blockUser = async(req,res)=>{
    try {
    
    const id = req.query.id

    await User.updateOne({_id:id},{$set :{is_blocked : 1}})
    res.redirect('/admin/users')

    } catch (error) {
        console.log(error.message);
    }
}

const unblockUser = async(req,res)=>{
    try {
        
        const id = req.query.id

        await User.updateOne({_id:id},{$set :{is_blocked : 0}})
        res.redirect('/admin/users')

    } catch (error) {
        console.log(error.message);
    }
}

const salesReportLoad = async(req,res)=>{

    try {

        if (Object.keys(req.body).length === 0) {

            const date = new Date()
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const newDate = `${year}-${month}-${day}`;

            const fromDate = null
            const toDate = newDate

            const orders = await orderModel.find({})
            
            res.render('sales-report',{orders,toDate,fromDate})

        }else{

            let fromDate = new Date(req.body.from);
            let toDate = new Date(req.body.to);

            // Set the time of toDate to 11:59 PM
            toDate.setHours(23, 59, 0, 0);
            
            // Convert the date to UTC
            toDate = new Date(toDate.toISOString());
            
            const orders = await orderModel.find({
                $and: [
                  { 'order.date': { $gte: fromDate } },
                  { 'order.date': { $lte: toDate } }
                ]
              });

              const year = fromDate.getFullYear();
              const month = String(fromDate.getMonth() + 1).padStart(2, '0');
              const day = String(fromDate.getDate()).padStart(2, '0');
              fromDate = `${year}-${month}-${day}`;

              const year1 = toDate.getFullYear();
              const month1 = String(toDate.getMonth() + 1).padStart(2, '0');
              const day1 = String(toDate.getDate()).padStart(2, '0');
              toDate = `${year1}-${month1}-${day1}`;

              console.log(orders);
              res.render('sales-report',{orders,fromDate,toDate}) 
            }

    } catch (error) {
        console.log(error.message);
    }


}

module.exports = {
    loadLogin,
    verifyLogin,
    adminLogout,
    adminDashboard,
    adminUsers,
    addUserLoad,
    addUser,
    editUserLoad,
    updateUser,
    deleteUser,
    blockUser,
    unblockUser,
    salesReportLoad
}
