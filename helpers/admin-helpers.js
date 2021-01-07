var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { response } = require('express')
var objectId = require('mongodb').ObjectID


module.exports = {
    doAdminLogin: (adminData) => {
        console.log(adminData)
        return new Promise(async (resolve, reject) => {
            let loginstatus = false
            let response = {}
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ Email: adminData.Email })
            console.log(admin);
            if (admin) {
                bcrypt.compare(adminData.Password, admin.Password).then((status) => {
                    if (status) {
  
                        console.log('Login Success');
                        response.admin = admin
                        response.status = true
                        resolve(response)
                    } else {
                        console.log('Login Failed')
                        resolve({ status: false })
                    }
                })
  
            } else {
                console.log('login failed');
                resolve({ status: false })
            }
        })
    }
}