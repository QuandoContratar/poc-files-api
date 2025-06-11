import { peopleData } from "../db/people"
import { UnauthorizedError } from "../errors/unauthorized"

export class PeopleApp {
    async login (request:any,response:any) {
        const { body } = request
        const bodyParsed = JSON.parse(body)
        
        const data = peopleData.find((person) => person.email === bodyParsed.email && person.password === bodyParsed.password)

        if (!data) {
            throw new UnauthorizedError('Usuário ou Senha inválidos')
        }
        
        return response.status(200).send('Login Realizado com sucesso') 
    }
}