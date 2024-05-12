import { Cliente } from "domains/cliente/core/entities/cliente";
import { ClienteVersao } from "domains/cliente/core/entities/cliente.versao";
import admin from "firebase-admin"
import { Auth, CreateRequest, UserRecord } from "firebase-admin/auth";
import jwt from 'jsonwebtoken'

export class Identity {
    app: admin.app.App;

    constructor() {
        console.info(' admin.apps[0]', admin.apps[0])
        
        this.app = admin.apps[0] || admin.initializeApp()

        console.info('this.app.options.serviceAccountId', this.app.options.serviceAccountId)
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

        const verified: jwt.JwtPayload = (
        jwt.verify(
            token, 
`-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCsujZg/Fxhytbh
IbpMF8n/ExSv4ZKPhAiWsfUXvAyhRZrkjCX2Kd3a/1xRZY5myZS+A1RG4Uzv+UTY
EdoNvypHsqySu7K6MRDuSNoPF5BslbH0cmsPeLXuMX2Oty644JrpTDS34WnUbnoT
skUyeoJPtX1eaMnRn5b9mrWhMkFlLZHiMmefHwcno+/nd3p0/Se8+tFi9W4ZRD2f
VFezAz6UfM9ixf6G1sHX/II+C5hj8nj/viiSDDsn/+M89uAfxcHxSrnyfKj15glm
+A9FaFMYFtHt4cgb5G2cADQb03q/5V2cjASL+527fjVZbdA+LfxBqaTX2UOUlrry
3MaNXtcjAgMBAAECggEAGJu7DZxGqSQV8yM0AI1PGQkl5Fz13X6JHrch3QzMm9ln
1PHmoqiaVA4Xn/0hCaHkkCG3SxXkOThBR6tbbqPyqR5amdkmAILnD5vPfWD1EZNO
NC5s9FpVSSdB5ShR/sL5Lw3NYPk7c6l9uPqoAyYTFLodr2qsfjIHeAAnqlyXloto
OlIax4CxeekuiHJ3lTouIHe86+4naKg/kGfLojMYreW114ch7EWtyXIGOgCE57e6
y4cRcov39DQ4taSioqcb2rZ8Ehh+FxDIolRdntecJOKgZdHik3Ag8jIhge8qfJby
8Vn+GiCYRwtINTOql+QM+ettA7VhnTOzBti7tDaTiQKBgQDqv0JYjTexrGKyGD4C
NgahgkRgCocvI0C41L1nJeJewj/CMaaXRxH8hICt3Y2pvWyP8Ys2ci9rDOhwXMQH
1LiaGkkPrhtOTIL5fLbaugJe0OhQfuKNUlWO9i8rY1/nDad68PWxZW0FttCUVknS
BUiIq8ffEU53Vf29ha6egdzzvwKBgQC8XYU8gxJFUNlQ2Pw3r3b3johXvw2r0JkM
oO6e5rWzka+xR+hWBQXw+MpyB08M4sUfK9BhJlJd4Of9qxu5W6VrkRTyHP4tynTP
ScdAk0LHDXIxQG8OVY+8jvmz6lxetFBEpzrDq4OknOn39+AVtDs30MOrbGGwkGBW
qA2KpA1lnQKBgQDQEbCT3q/T2xEr/FLSEOL1uwox+oLyJBQU//PVfn3UMebjkLCx
e7wUj7mi4jLTleOo/pa/LpybDTjlh0P2EPWDGfNSY6cuUqDw1DsbSi4Zrp+L4bub
ObQ+YDVVBuMVYEPns7aCg30LyIu+P3F1J1uwUFp7fNKI8f5TQy+QrViT7wKBgQCN
Z29T49lda7oX9Swx6WjXooo7xNLQfoHGdzFq3CrfKKjJ3v9NQ+wX38yqGU6Aj+QG
6G8/3vLKQsIlLcRcO65Mt9cPgjBV07wouGv50BK7Nx7YVlSIYDbNCE/vfinldlsj
jp6QsTrb4mfJnKz93hTua6vYDj6vu1J2+yVfRJRCCQKBgAxdt89OQsYAnQKeIYOj
SovV1QPOqIuQollPCyADYDZQgeg0HInepWJCFk1PAGHitPJvpk4cj7Vfy0XkgkAT
YCB+W6qVBJxTgHb9308W33hX8VFAaMw9omeBQ6YQnhxZ784PDt7PYMXSZ9LYPOtj
1RGutxJ1c4ZdmQPKSLlS3Yjw
-----END PRIVATE KEY-----
`,
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