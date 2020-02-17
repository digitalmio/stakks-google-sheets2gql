import BaseModel from './baseModel';
import { Model } from 'objection';

export default class StacksData extends BaseModel {
  static get tableName() {
    return 'data';
  }

  static get relationMappings() {
    return {
      values: {
        relation: Model.HasManyRelation,
        modelClass: 'StacksDataValues',
        join: {
          from: 'data.id',
          to: 'dataValues.dataId'
        }
      },
      currentValue: {
        relation: Model.BelongsToOneRelation,
        modelClass: 'StacksDataValues',
        join: {
          from: 'data.valueId',
          to: 'dataValues.id'
        }
      }
    };
  }
}
