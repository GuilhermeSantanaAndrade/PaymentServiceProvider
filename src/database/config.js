const envs = require("dotenv").config({
  path: global.AUTO_TEST ? ".env.test" : ".env"
});

module.exports = {
  dialect: process.env.DATABASE_DIALECT,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  define: {
    timestamps: true,
    underscored: false
  },
  logging: false
};
