
import {v4 as uuidv4} from 'uuid'
import { query } from '../config/db.config.js';

export class Usuario {

    constructor(name, lastname, email, phone, birthday,budget) {
        this.id = uuidv4().slice(0,8);
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.phone = phone;
        this.birthday = birthday;
        this.budget = budget;
        this.active = true;
    }

   static async create(data) {
    try {
        const {name, lastname, email, phone, birthday, budget} = data

        const id = uuidv4()
        const active = true;

        const {rows} = await query(
            'INSERT INTO usuario (id, name, lastname, email, phone, birthday, budget, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [id, name, lastname, email, phone, birthday, budget, active] 
        )
        return rows[0]
    } catch (error) {
        console.error('Error creating user', error.message)
        throw  new Error(`Error al crear usuario ${error}`)
        
    }
   
   }
}
