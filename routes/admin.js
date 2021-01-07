var express = require('express');
const router = express.Router();
var productHelpers = require('../helpers/product-helpers');
const { response } = require('express');
const userHelpers = require('../helpers/user-helpers');
const adminHelpers = require('../helpers/admin-helpers')
const verifyLogin = (req, res, next) => {
  if (req.session.adminLoggedIn) {
    next()
  } else {
    res.redirect('/admin/adminlogin')
  }
}

/* GET users listing. */
router.get('/',verifyLogin, (req, res, next) => {
  let admin=req.session.admin;
//   if(admin){
//     admin.status=true
//     console.log(admin);
//   }
  productHelpers.getAllProducts().then((products)=>{
    console.log(products)
    res.render('admin/view-products', { admin, products})
  })
});
router.get('/add-product', verifyLogin,function (req, res) {
  res.render('admin/add-product')
})
router.post('/add-product', verifyLogin,(req, res) => {
  productHelpers.addProduct(req.body, (id) => {
    let image = req.files.Image
    console.log(id);

    image.mv('./public/product-images/'+ id +'.jpg', (err)=>{
      if (!err) {
        res.render('admin/add-product')

      } else {
        console.log(err);
      }
    })
  })
})

router.get('/delete-product/:id',(req,res)=>{
  let proId=req.params.id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })


})
router.get('/edit-product/:id',async(req,res)=>{
 let product=await productHelpers.getProductDetails(req.params.id)
 console.log(product);
  res.render('admin/edit-product',{product})
})
router.post('/edit-product/:id',(req,res)=>{
  let id=req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let image=req.files.Image
      image.mv('./public/product-images/' + id + '.jpg')

    }
  })

})
router.get('/adminlogin', (req, res) => {  
  if (req.session.admin) {
    res.redirect('/admin')

  } else {
    res.render('admin/adminlogin', { "loginErr": req.session.adminLoginErr, admin:true })
    req.session.adminLoginErr = false

  }
 

})
router.post('/adminlogin', (req, res) => {

  adminHelpers.doAdminLogin(req.body).then((response) => {
    if (response.status) {  
      req.session.admin = response.admin
      req.session.adminLoggedIn = true
      res.redirect('/admin')
    } else {
      req.session.adminLoginErr = "Invalid Username or Password"
      res.redirect('/admin/adminlogin')
    }
  })

})
router.get('/adminlogout', (req, res) => {
  req.session.admin=null
  req.session.adminLoggedIn=false
  res.redirect('/admin/')
})

router.get('/remove-product/:id', (req, res) => {
  let proId = req.params.id
  console.log(proId);
  userHelpers.deleteProduct(proId).then((response) => {
    res.redirect('/cart/')
  })
})
router.get('/all-users',verifyLogin,(req,res)=>{
  let  admin=req.session.admin;
  
  productHelpers.getAllUsers().then((users) => {
    console.log(users);
    res.render('admin/all-users', {Admin:req.session.admin,admin,users})
  })
})
router.get('/all-orders',verifyLogin,(req,res)=>{
  let  admin=req.session.admin;
  
  productHelpers.getAllOrders().then((orders) => {
    
    res.render('admin/all-orders', {Admin:req.session.admin,admin,orders, admin:true})
  })
})

module.exports = router;