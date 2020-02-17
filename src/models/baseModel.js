import { Model } from 'objection';

export default class BaseModel extends Model {
  static get modelPaths() {
    return [__dirname];
  }

  // To make sure we do have timestamps
  $beforeInsert() {
    const timestamp = knex.fn.now();
    if (this.constructor.timestamps || this.constructor.tsCreatedAt) {
      this.createdAt = timestamp;
    }

    if (this.constructor.timestamps || this.constructor.tsUpdatedAt) {
      this.updatedAt = timestamp;
    }
  }

  $beforeUpdate(opt, queryContext) {
    if (this.constructor.timestamps || this.constructor.tsUpdatedAt) {
      this.updatedAt = knex.fn.now();
    }
  }
}
