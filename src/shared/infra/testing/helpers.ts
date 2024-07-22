import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { Config } from "../config";
import { before } from "lodash";

export function setupSequelize(options: SequelizeOptions = {}) {
  let _sequelize: Sequelize;
  beforeAll(async () => {
    _sequelize = new Sequelize({
      ...options,
      ...Config.db(),
    });
    await _sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await _sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await _sequelize.close();
  });

  return {
    get sequelize() {
      return _sequelize;
    },
  };
}
