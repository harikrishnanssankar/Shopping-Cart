const { Router } = require('express');
var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
const adminHelpers = require('../helpers/admin-helpers');
const verifyLogin = (req, res, next) => {
  if (req.session.adminLoggedIn) {
    next()

  } else {
    res.redirect('/admin/login', {admin:true})
  }
}

// router.get('/admin', verifyLogin,(req, res, next) => {
//   let admin= req.session.admin
//      productHelpers.getAllProducts().then((products) => {
//        res.render('admin/view-products', {admin:true, products, admin});
//      })
// });
// router.get('/adminlogin', (req, res) => {
//   if (req.session.admin) {
//     res.redirect('/admin')
//   }else {
//     res.render('admin/login', {"adminLoginErr": req.session.adminLoginErr, admin:true })
//     req.session.adminLoginErr = false
//   }
// })
// // router.get('/adminlogin',(req,res) => {
// //   res.render('admin/login', {admin:true})
// // })
// router.post('/adminlogin', (req, res) => {
//     adminHelpers.doAdminLogin(req.body).then((response) => {
//       console.log('res:',response)
//       if (response.status) {
//         req.session.admin = response.admin
//         req.session.adminLoggedIn = true
//         res.redirect('/admin/admin')
//       } else {
//         req.session.adminLoginErr = "Invalid username or password!!!"
//         res.redirect('/login', {admin:true})
//       }
//     })
//   })
// //logout session destroy
// router.get('/adminlogout', (req, res) => {
//   req.session.admin=null
//   req.session.adminLoggedIn= false
//   res.redirect('/admin/adminlogin')
// })
///////////////////////////------------------------------------------



// router.get('/', async (req, res, next) => {
//   let user = req.session.user
//   console.log(user);
//   let cartCount = null
//   productHelpers.getAllProducts().then((products) => {
//     res.render('admin/view-products', { products, user,});
//   })


// });
// router.get('/login', (req, res) => {
//   if (req.session.user) {
//     res.redirect('/')
//   } else {
//     res.render('admin/login', { "loginErr": req.session.userLoginErr })
//     req.session.userLoginErr = false
//   }
// })
// router.post('/admin/login', (req, res) => {
//   userHelpers.doAdminLogin(req.body).then((response) => {
//     if (response.status) {
//       req.session.user = response.user
//       req.session.userLoggedIn = true
//       res.redirect('/')
//     } else {
//       req.session.userLoginErr = "Invalid username or password!!!"
//       res.redirect('/login')
//     }
//   })
// })
// //logout session destroy
// router.get('/logout', (req, res) => {
//   req.session.user=null
//   req.session.userLoggedIn= false
//   res.redirect('/')
// })

/////////////////////////////////////////-----------------------------------

// router.get('/', (req, res, next) => {
//   productHelpers.getAllProducts().then((products) => {
//     res.render('admin/view-products', { admin: true, products});
//   })
// })
// router.get('/adminlogin', (req, res) => {
//   res.render('admin/login', {admin:true})
// })
// router.post('/adminlogin', (req, res) => {
//   console.log(req.body);
//   adminHelpers.doAdminLogin(req.body).then((response) => {
//     console.log('res:-', response);
//     if(response.status){
//       res.render('/')
//     }
//   })
// })

/////////////////////////////////////////----------------------------------------
////////////////////
///////////4th try//////////////

// router.get('/admin', async (req, res, next) => {
//   let admin = req.session.admin
//   console.log('1:', admin);
//   productHelpers.getAllProducts().then((products) => {
//     res.render('admin/view-products', { products, admin, admin:true });
//   })


// });
// router.get('/login', (req, res) => {
//   if (req.session.user) {
//     res.redirect('/admin')
//   } else {
//     res.render('admin/login', { "loginErr": req.session.userLoginErr })
//     req.session.userLoginErr = false
//   }
// })
// router.post('/login', (req, res) => {
//   adminHelpers.doLogin(req.body).then((response) => {
//     if (response.status) {
//       req.session.admin = response.admin
//       req.session.userLoggedIn = true
//       res.redirect('/admin')
//     } else {
//       req.session.userLoginErr = "Invalid username or password!!!"
//       res.redirect('admin/login')
//     }
//   })
// })
// //logout session destroy
// router.get('/logout', (req, res) => {
//   req.session.admin=null
//   req.session.userLoggedIn= false
//   res.redirect('admin/login')
// })


/////////////////////////////------------

router.get('admin/adminlogin', (req,res) => {
  res.render('/admin/adminlogin')
})
router.post('/adminlogin', (req,res) => {
  console.log(req.body);
  // adminHelpers.doAdminLogin(req.body).then((response) => {
  //   console.log(response);
  // })
})


////////////////------------------------
router.get('/add-product', (req, res) => {
  res.render('admin/add-product', { admin: true, admin: req.session.admin })
})
router.post('/add-product', (req, res) => {

  productHelper.addProduct(req.body, (id) => {
    let image = req.files.Image
    image.mv('./public/product-image/' + id + '.jpg', (err) => {
      if (!err) {
        res.render("admin/add-product")
      } else {
        console.log(err)
      }
    })

  })
})

router.get('/delete-product/:id', (req, res) => {
  let proId = req.params.id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response) => {
    res.redirect('/admin/')
  })

})

router.get('/edit-product/:id', async (req, res) => {
  let product = await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product', { product, admin: true, admin: req.session.admin })
})
router.post('/edit-product/:id', (req, res) => {
  let id = req.params.id
  productHelpers.updateProduct(req.params.id, req.body).then(() => {
    res.redirect('/admin')
    if (req.files.Image) {
      let image = req.files.Image
      image.mv('./public/product-image/' + id + '.jpg')
    }
  })
})

module.exports = router;
