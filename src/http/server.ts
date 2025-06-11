import Fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import { PeopleApp } from '../app/people'
import { FilesApp } from '../app/files'

const ipFrontEnd = ''

const server = Fastify()
server.register(cors, {
    origin: true
})
server.register(multipart)

// Middleware para configurar CSP
server.addHook('onSend', async (request, reply, payload) => {
    reply.header('Content-Security-Policy', `default-src 'self'; connect-src 'self' ${ipFrontEnd}`)
    return payload
});

const baseUrl = '/files-api'

server.post(`${baseUrl}/people/login`, (request,response)=>{
    console.log('login endpoint called')
    return new PeopleApp().login(request,response)
})

server.post(`${baseUrl}/files`, (request,response)=>{
    console.log('upload file endpoint called')
    return new FilesApp().upload(request,response)
})

server.post(`${baseUrl}/files/web-hook`, (request,response)=>{
    console.log('upload file endpoint called')
    return new FilesApp().upload(request,response)
})

server.listen({
    host:"0.0.0.0",
    port: process.env.PORT ?? 3000,
}as any)

console.log('Application is ready')