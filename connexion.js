import { Sequelize } from "sequelize";

const connexion = new Sequelize("stock_db", "root", "TON_MOT_DE_PASSE", {
  host: "localhost",
  dialect: "mysql",
  port: 3306, // ← IMPORTANT
  logging: false
});

export default connexion;