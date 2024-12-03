import  express from 'express';
import dotenv from 'dotenv'

import userRouter from './routes/usuario.routes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })) 

app.use('/api/v1', userRouter)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}🐭`)
})