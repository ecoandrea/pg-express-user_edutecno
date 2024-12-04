import { v4 as uuidv4 } from 'uuid'
import { query } from '../config/db.config.js';

export class Usuario {
    constructor(name, lastname, email, phone, birthdate, budget) {
        this.id = uuidv4();
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.phone = phone;
        this.birthdate = birthdate;
        this.budget = budget;
        this.active = true
    }

    static async create(data) {
        try {
            const { name, lastname, email, phone, birthday, budget } = data

            const id = uuidv4()
            const active = true
            
            const { rows } = await query(
                'INSERT INTO usuario (id, name, lastname, email, birthday, phone, budget, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                [id, name, lastname, email, birthday, phone, budget, active]
            )

            return rows[0]
        } catch (error) {
            console.error('Error al crear el usuario', error.message)
            throw new Error(`Error al crear el usuario ${error}`)
        }
    }

    static async findAllActive() {
        try {
            const findQuery = `SELECT * FROM usuario WHERE active = $1`;
            const value = [true]

            const { rows } = await query(findQuery, value)
            return rows
        } catch (error) {
            console.error(`Èrror al buscar un usuario. ERROR: ${error.message}`)
            throw new Error(`Error al buscar un usuario ${error}`)
        }
    }

    static async findActiveById(id) {
        try {
            const findQuery = `SELECT * FROM usuario WHERE id = $1 AND active = $2`
            const value = [id, true]

            const { rows } = await query(findQuery, value)
            
            /* rows.length > 0 ? rows[0] : null */
            if(rows.length === 0 ) throw new Error('No pudimos encontrar el ID')

            return rows[0]
        } catch(error) {
            console.error(`Error al buscar un usuario por id. ERROR: ${error.message}`)
            throw new Error(`Error al buscar un usuario por id ${error}`)
        }
    }

    static async update(id, data) {
        try {
            const { name, lastname, email, phone, birthday, budget } = data;

            const updateQuery = `
                UPDATE usuario 
                SET 
                    name = $1, 
                    lastname = $2, 
                    email = $3, 
                    phone = $4, 
                    birthday = $5, 
                    budget = $6
                WHERE id = $7 AND active = true
                RETURNING *;
            `

            const values = [name, lastname, email, phone, birthday, budget, id]

            const { rows } = await query(updateQuery, values)

            if (rows.length === 0) throw new Error("No pudimos encontrar el ID");

            return rows[0]
        } catch (error) {
            console.error(`Error al actualizar un usuario por id. ERROR: ${error.message}`);
            throw new Error(`Error al actualizar un usuario por id ${error}`);
        }
    }

    static async permaDelete(id) {
        try {
            const deleteQuery = `DELETE FROM usuario WHERE id = $1 AND active = true`;
            const value = [id]

            await query(deleteQuery, value)

        } catch (error) {
            console.error(`Error al eliminar un usuario por id. ERROR: ${error.message}`);
            throw new Error(`Error al eliminar un usuario por id ${error}`);      
        }
    }

    static async softDelete(id) {
        try {
            const softDeleteQuery = 'UPDATE usuario SET active = false WHERE id = $1 AND active = true RETURNING *'
            const value = [id]

            const { rows } = await query(softDeleteQuery, value)
            if (rows.length === 0) throw new Error("No pudimos encontrar el ID");

            return rows[0]
        } catch (error) {
            console.error(`Error al eliminar un usuario por id. ERROR: ${error.message}`);
            throw new Error(`Error al eliminar un usuario por id ${error}`);
        }
    }
}