
let mongoose = require('mongoose')
let validator = require('validator')

let personSchema = new mongoose.Schema({
person:{
        name :{
            type: String,
            required: true,
            unique: true,
            validate: (value) => {
              return validator.isname(value)

        } }
        
        ,

        age : number,

        favoriteFoods : [String] ,
}
})

module.exports = mongoose.model('person', personSchema)