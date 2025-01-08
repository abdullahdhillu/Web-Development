const fs = require('fs')
const dotenv = require('dotenv'); 
const mongoose = require('mongoose'); 
const tourModel = require('./../../model/tourModel');
dotenv.config({ path: './../../config.env' }); 
// console.log(process.env.DATABASE_PASSWORD)
const DB = process.env.DATABASE.replace("<PASSWORD>" , process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(() => {
  console.log('DB connection successful!');
}).catch(err => {
  console.log('DB connection failed:', err.message);
});
const importData = async () => {
    try{
        const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf8'));
        console.log(tours.length)
        await tourModel.create(tours);
        console.log('Imported Data Successfully');
    }
    catch(err) {
        console.log(err.message)
    }
    process.exit();
}

const deleteData = async () => {
    try{
        await tourModel.deleteMany();
        console.log('Deleted Data Successfully');
    }
    catch(err) {
        console.log(err.message);
    }
    process.exit()
}
if(process.argv[2] == '--import')
{
    importData();
}
else if(process.argv[2] == '--delete')
{
    deleteData();
}

// console.log(process.argv)