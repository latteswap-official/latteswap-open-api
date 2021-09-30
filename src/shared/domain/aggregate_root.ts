import { Entity } from './entity'
import { UniqueEntityID } from './unique_entity_id'

export abstract class AggregateRoot<T> extends Entity<T> {
  get id(): UniqueEntityID {
    return this._id
  }
}
