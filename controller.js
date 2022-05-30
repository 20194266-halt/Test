const { error } = require("console");
const mysql = require("mysql");
const prompt = require("prompt-sync")();

//Connect to databasa
const pool = mysql.createPool({
    connectionLimit:10,
    host: "localhost",
    user:"root",
    password:"",
    database: "test"

})

function getAllWatch(){
    pool.query(`SELECT w.serial_number, w.year_of_manufacture, w.water_resistant, w.color, w.size, w.left_over, w.customer_reviews, m.name as "model_name", b.name as "brand_name"
                FROM watch w, brand b, model m 
                WHERE w.model_id = m.id and m.brand_id = b.id`, (error, results) => {
        if (error) {
         throw error
        }
        console.log(results)
       })
}

function deleteBrand() {
let name = prompt("Enter brand name you want to delete: ")
pool.query(`SELECT id FROM brand WHERE name = ? `, name,  (error, results) => {
    if (error) {
     throw error
    }
    pool.query(`SELECT id FROM model WHERE brand_id = ?`, results[0].id, (error, results1) => {
        if (error) {
         throw error
        }
        results1.forEach(x => {
            console.log(x.id)
            pool.query(`DELETE FROM watch WHERE model_id = ? `, x.id, (error, results2) =>{
                if(error){
                    throw error
                } 
                console.log(results2)
            })
        });
        pool.query(`DELETE FROM model WHERE model_id = ? `, results[0].id, (error, results3) =>{
            if(error){
                throw error
            } 
            console.log(results3)
        })    
    })
    pool.query(`DELETE FROM brand WHERE name = ? `, name, (error, results4) =>{
            if(error){
                throw error
            } 
            console.log(results4)
        }) 
       } )
} 

function addBrand(){
    let brandName = prompt("Enter brand name that you want to add: ")
    pool.query(`INSERT INTO brand(name) VALUES(?)`, brandName, (error, results) =>{
        if(error){
            throw error
        } 
        console.log(results)
    })
}

function deleteModel(){
    let name = prompt("Enter model name you want to delete: ")
    pool.query(`SELECT id FROM model WHERE name = ?`, name, (error, results) => {
        if (error) {
         throw error
        }
        results.forEach(x => {
            console.log(x.id)
            pool.query(`DELETE FROM watch WHERE model_id = ? `, x.id, (error, results2) =>{
                if(error){
                    throw error
                } 
                console.log(results2)
            })
        });
        
        pool.query(`DELETE FROM model WHERE name = ? `, name, (error, results3) =>{
            if(error){
                throw error
            } 
            console.log(results3)
        }) 
    })
}

function addModel(){
    let brandName = prompt("Enter brand name of the model that you want to add: ")
    //
    pool.query(`SELECT id FROM brand WHERE name = ? `, brandName,  (error, results) => {
        if (error) {
         throw error
        }
        if(results.length==0)
        {
            pool.query(`INSERT INTO brand(name) VALUES(?)`, brandName, (error, results1) =>{
                if(error){
                    throw error
                } 
                console.log(results1)
            })
            pool.query(`SELECT id FROM brand WHERE name = ?`, brandName, (error, results2) =>{
                if(error){
                    throw error
                } 
                //console.log(results2)
                let modelName = prompt("Enter model name you want to add: ", modelName)
                pool.query(`INSERT INTO model(name, brand_id) VALUES(?, ?)`, [modelName, results2], (error, results3) =>{
                    if(error){
                        throw error
                    } 
                    console.log(results3)
                })
            })
        }
        if(results.length!=0){
            let modelName = prompt("Enter model name you want to add: ", modelName)
            pool.query(`INSERT INTO model(name, brand_id) VALUES(?, ?)`, [modelName, results[0].id], (error, results4) =>{
                if(error){
                    throw error
                } 
                console.log(results4)
            })
        }
    })
}

function deleteWatch(){
    let serialNumber = prompt("Enter watch serial number you want to delete: ")
    pool.query(`DELETE FROM watch WHERE serial_number = ? `, serialNumber, (error, results) =>{
        if(error){
            throw error
        } 
        console.log(results)
    }) 
}

function addWatch(){
    let modelName = prompt("Enter model name you want to add: ", modelName)
    pool.query(`SELECT id FROM model WHERE name = ? `, modelName,  (error, results) => {
        if (error) {
         throw error
        }
        if(results.length == 0){
            addModel();
            pool.query(`SELECT id FROM model WHERE name = ?`, modelName, (error, results1)=>{
            console.log("Enter watch's information: ")
            let serialNumber = prompt("Serial number: ")
            let yearOfManufacture = prompt("Year of manufacture: ")
            let waterResistant = prompt("Water resistant: ")
            let color = prompt("Corlor: ")
            let size = prompt("Size:")
            let leftOver = prompt("Left-over: ")
            let customerReviews = prompt("Customer reviews: ")
            pool.query(`INSERT INTO watch(serial_number, year_of_manufacture, water_resistant, color, size, left_over ,customer_reviews, model_id)`
            , [serialNumber, yearOfManufacture, waterResistant, color, size, leftOver, customerReviews, results1[0].id ])
            })
            
        }
        if(results.length != 0){  
            console.log("Enter watch's information: ")
            let serialNumber = prompt("Serial number: ")
            let yearOfManufacture = prompt("Year of manufacture: ")
            let waterResistant = prompt("Water resistant: ")
            let color = prompt("Corlor: ")
            let size = prompt("Size:")
            let leftOver = prompt("Left-over: ")
            let customerReviews = prompt("Customer reviews: ")
            pool.query(`INSERT INTO watch(serial_number, year_of_manufacture, water_resistant, color, size, left_over ,customer_reviews, model_id)`
            , [serialNumber, yearOfManufacture, waterResistant, color, size, leftOver, customerReviews, results[0].id ], (error, results3) =>{
                console.log(results3)
            })
                
            }
})}

function searchByBrandAndModel(){
    let brand = prompt("Enter watch brand name you want to delete: ")
    let model = prompt("Enter watch model name you want to delete: ")
    pool.query(`SELECT w.serial_number, w.year_of_manufacture, w.water_resistant, w.color, w.size, w.left_over, w.customer_reviews, m.name as model_name, b.name as brand_name
                FROM watch w, brand b, model m 
                WHERE w.model_id = m.id and m.brand_id = b.id and b.name = LOWER(?) and m.name = LOWER(?)`, [brand, model], (error, results)=>{
        if(error){
            throw error
        } 
        console.log(results)
    })
}

function Favorite(){
    pool.query(`SELECT w.serial_number, w.year_of_manufacture, w.water_resistant, w.color, w.size, w.left_over, w.customer_reviews, m.name as model_name, b.name as brand_name
                from watch w, brand b, model m 
                where w.model_id = m.id and m.brand_id = b.id 
                order by w.customer_reviews DESC`, (error, results)=>{
        if(error){
            throw error
        } 
        console.log(results)
    })
}

console.log("1. Print all watch \n")
console.log("2. Add a brand\n")
console.log("3.Delete brand\n")
console.log("4. Add a model\n ")
console.log("5. Delete a model\n")
console.log("6. Add a watch\n")
console.log("7. Delete a watch\n")
console.log("8. Search by brand name and model name\n")
console.log("9. Top customer's reviews\n")

let option = prompt("You choose: ")

if(option == "1"){
    getAllWatch()
}
else if(option == "2"){
    addBrand()
}
else if(option == "3"){
    deleteBrand()
}
else if(option == "4"){
    addModel()
}
else if(option == "5"){
    deleteModel()
}
else if(option == "6"){
    addWatch()
}
else if(option == "7"){
    deleteWatch()
}
else if(option == "8"){
    searchByBrandAndModel()
}
else if(option == "9"){
    Favorite()
}

