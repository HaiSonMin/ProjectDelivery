const mongoose = require("mongoose");
// Singleton Patten
class Database {
  constructor() {
    this.connect();
  }

  connect(typeDB = "MongoDB") {
    mongoose
      .connect(process.env.MONGO_URI, { maxPoolSize: 50 })
      .then(console.log(`Connect ${typeDB} Successfully`))
      .catch((err) => console.log(err));
  }

  // Initialize DB if not initialized
  static getInstance() {
    if (!this.instance) this.instance = new Database();
    return this.instance;
  }
}

const instanceDB = Database.getInstance();
module.exports = instanceDB;
