import {User} from '../models/entity/User'

declare module 'express' {
  interface Request {
    user?:User;
  }
}