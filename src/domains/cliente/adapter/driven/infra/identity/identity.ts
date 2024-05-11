import { Cliente } from "domains/cliente/core/entities/cliente";
import { ClienteVersao } from "domains/cliente/core/entities/cliente.versao";
import admin from "firebase-admin"
import { Auth, CreateRequest, UserRecord } from "firebase-admin/auth";
import jwt from 'jsonwebtoken'

export class Identity {
    app: admin.app.App;

    constructor() {
        this.app = admin.apps[0] || admin.initializeApp()
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
            process.env.TOKEN_PRIVATE_KEY!
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