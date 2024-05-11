import { Cliente } from "domains/cliente/core/entities/cliente";
import { ClienteVersao } from "domains/cliente/core/entities/cliente.versao";
import admin from "firebase-admin"
import { Auth, CreateRequest, UserRecord } from "firebase-admin/auth";
import jwt from 'jsonwebtoken'

export class Identity {
    app: admin.app.App;

    constructor() {
        this.app = admin.apps[0] || admin.initializeApp({
            serviceAccountId: '197343799268-compute@developer.gserviceaccount.com',
        })
    }

    getIdentity(): Auth {
        return this.app?.auth()
    }

    createUser(cliente: Cliente): Promise<UserRecord> {

        const payload: CreateRequest = {
            email: cliente.getEmail(),
            emailVerified: false,
            password: cliente.getCpf(),
            displayName: cliente.getNome(),
            disabled: false,
        }

        return this.getIdentity().createUser(payload)
    }

    createCustomToken(cliente: Cliente, claims: any): Promise<string> {
       
        return this.getIdentity().createCustomToken(
            cliente.getIdentity()!, 
            claims)
    }

    async verifyIdToken(token: string): Promise<Cliente>  {

        console.warn('TOKEN', token)
        console.warn('TOKEN_PRIVATE_KEY', process.env.TOKEN_PRIVATE_KEY)

        const verified: jwt.JwtPayload = (
        jwt.verify(
            token, 
            "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCsujZg/Fxhytbh\nIbpMF8n/ExSv4ZKPhAiWsfUXvAyhRZrkjCX2Kd3a/1xRZY5myZS+A1RG4Uzv+UTY\nEdoNvypHsqySu7K6MRDuSNoPF5BslbH0cmsPeLXuMX2Oty644JrpTDS34WnUbnoT\nskUyeoJPtX1eaMnRn5b9mrWhMkFlLZHiMmefHwcno+/nd3p0/Se8+tFi9W4ZRD2f\nVFezAz6UfM9ixf6G1sHX/II+C5hj8nj/viiSDDsn/+M89uAfxcHxSrnyfKj15glm\n+A9FaFMYFtHt4cgb5G2cADQb03q/5V2cjASL+527fjVZbdA+LfxBqaTX2UOUlrry\n3MaNXtcjAgMBAAECggEAGJu7DZxGqSQV8yM0AI1PGQkl5Fz13X6JHrch3QzMm9ln\n1PHmoqiaVA4Xn/0hCaHkkCG3SxXkOThBR6tbbqPyqR5amdkmAILnD5vPfWD1EZNO\nNC5s9FpVSSdB5ShR/sL5Lw3NYPk7c6l9uPqoAyYTFLodr2qsfjIHeAAnqlyXloto\nOlIax4CxeekuiHJ3lTouIHe86+4naKg/kGfLojMYreW114ch7EWtyXIGOgCE57e6\ny4cRcov39DQ4taSioqcb2rZ8Ehh+FxDIolRdntecJOKgZdHik3Ag8jIhge8qfJby\n8Vn+GiCYRwtINTOql+QM+ettA7VhnTOzBti7tDaTiQKBgQDqv0JYjTexrGKyGD4C\nNgahgkRgCocvI0C41L1nJeJewj/CMaaXRxH8hICt3Y2pvWyP8Ys2ci9rDOhwXMQH\n1LiaGkkPrhtOTIL5fLbaugJe0OhQfuKNUlWO9i8rY1/nDad68PWxZW0FttCUVknS\nBUiIq8ffEU53Vf29ha6egdzzvwKBgQC8XYU8gxJFUNlQ2Pw3r3b3johXvw2r0JkM\noO6e5rWzka+xR+hWBQXw+MpyB08M4sUfK9BhJlJd4Of9qxu5W6VrkRTyHP4tynTP\nScdAk0LHDXIxQG8OVY+8jvmz6lxetFBEpzrDq4OknOn39+AVtDs30MOrbGGwkGBW\nqA2KpA1lnQKBgQDQEbCT3q/T2xEr/FLSEOL1uwox+oLyJBQU//PVfn3UMebjkLCx\ne7wUj7mi4jLTleOo/pa/LpybDTjlh0P2EPWDGfNSY6cuUqDw1DsbSi4Zrp+L4bub\nObQ+YDVVBuMVYEPns7aCg30LyIu+P3F1J1uwUFp7fNKI8f5TQy+QrViT7wKBgQCN\nZ29T49lda7oX9Swx6WjXooo7xNLQfoHGdzFq3CrfKKjJ3v9NQ+wX38yqGU6Aj+QG\n6G8/3vLKQsIlLcRcO65Mt9cPgjBV07wouGv50BK7Nx7YVlSIYDbNCE/vfinldlsj\njp6QsTrb4mfJnKz93hTua6vYDj6vu1J2+yVfRJRCCQKBgAxdt89OQsYAnQKeIYOj\nSovV1QPOqIuQollPCyADYDZQgeg0HInepWJCFk1PAGHitPJvpk4cj7Vfy0XkgkAT\nYCB+W6qVBJxTgHb9308W33hX8VFAaMw9omeBQ6YQnhxZ784PDt7PYMXSZ9LYPOtj\n1RGutxJ1c4ZdmQPKSLlS3Yjw\n-----END PRIVATE KEY-----\n",
            // process.env.TOKEN_PRIVATE_KEY!
        )) as jwt.JwtPayload

    return new Cliente(
        verified?.claims.cpf,
        verified?.claims.nome,
        verified?.claims.email!,
        verified?.uid,
        new ClienteVersao(
            verified?.claims.versao,
            verified?.claims.dataCadastro
        )
    )
         
    }
}