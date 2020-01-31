const envs = require("dotenv").config({
  path: ".env"
});

console.log(envs);

module.exports = {
  dialect: process.env.DATABASE_DIALECT,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  define: {
    timestamps: true,
    underscored: true
  }
};
