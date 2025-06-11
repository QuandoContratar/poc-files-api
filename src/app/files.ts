import AWS from 'aws-sdk'
import { Blob } from 'buffer'

export class FilesApp {
    async upload (request:any, response:any) {
        const data = await request.file()
        console.log("🚀 ~ FilesApp ~ upload ~ data:", data)
    
        if (!data) {
            return response.status(400).send({ error: 'Nenhum arquivo enviado.' })
        }
        const { filename, mimetype } = data
        const fileBuffer = await data.toBuffer()

        const blob = new Blob([fileBuffer], { type: mimetype })

        console.log("Arquivo recebido:", filename)
        console.log("MIME Type:", mimetype)

        await this.uploadToS3(blob, filename, mimetype)
        
        return response.status(200).send('Arquivo enviado com sucesso') 
    }

    async uploadToS3 (blob: Blob, fileName: string, mimeType: string) {
        const s3 = new AWS.S3({
            region: "us-east-1",
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        })

        const params = {
            Bucket: "quando-contratar-quando-raw",
            Key: fileName,
            Body: blob,
            ContentType: mimeType,
        }

        await s3.upload(params).promise()
        console.log("Arquivo enviado para o S3:", fileName)
    }

    async uploadToS3WebHook (request:any, response:any) {
        const data = JSON.parse(request.body)
        console.log("🚀 ~ FilesApp ~ uploadToS3WebHook ~ data:", data)

        if (!data) {
            return response.status(400).send({ error: 'Nenhum arquivo enviado.' })
        }

        const fileBuffer = await data.toBuffer()

        const blob = new Blob([fileBuffer], { type: 'application/json' })

        const now = new Date()
        now.setHours(now.getHours() - 3)
        const pad = (n: number) => n.toString().padStart(2, '0')
        const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`

        await this.uploadToS3(blob, `pipefy-file-${timestamp}.json`, 'application/json')
        
        return response.status(200).send('Arquivo enviado com sucesso') 
    }
}