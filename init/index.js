require('dotenv').config()
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = 'mongodb://127.0.0.1:27017/WanderLust';             //for local Database

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj, owner: '66e91b95c3277d629e7141d7'}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();