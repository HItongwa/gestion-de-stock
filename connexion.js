import { Sequelize } from "sequelize";

const connexion = new Sequelize("gestion_stock_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
  logging: false
});

export default connexion;