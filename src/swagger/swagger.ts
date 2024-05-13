import {
    post_cliente, 
    put_cliente,
    post_cliente_autenticacao

} from 'domains/cliente/adapter/driver/rest/swagger/acesso.swagger'

import {
    post_produto, 
    put_produto,

} from 'domains/pedido/adapter/driver/rest/swagger/produto.swagger'

import {
    post_pedido,
    put_pedido,
    post_webhook_pedido,
    put_pedido_status

} from 'domains/pedido/adapter/driver/rest/swagger/pedido.swagger'

import {
    post_webhook_mercadopago

} from 'domains/pagamento/adapter/driver/rest/swagger/pagamento.swagger'

export const swagger = {
    swagger: "2.0",
    info: {
        version: '1.0.0',           
        title: 'Tech Challenge Fiap',              
        description: 'Conjuntos dde recursos e operações do Tech Challenge da FIAP'
    },
    host: ["backend-koxvlyfy2a-rj.a.run.app"],
    // host: ["localhost:31300"],
    schemes: ["https", "http"],
    tags: [                   
        {
            name: 'Cliente',             
            description: 'APIs do domínio de Clientes'       
        },  {
            name: 'Pedido',             
            description: 'APIs do domínio de Pedidos'       
        },  {
            name: 'Produto',             
            description: 'APIs para gerenciamento de produtos'       
        }, {
            name: 'Pagamento',             
            description: 'APIs do domínio de Pagamento'       
        }
        
    ],
    definitions: {
        post_cliente,
        put_cliente,
        post_cliente_autenticacao,
        post_produto,
        put_produto,
        post_pedido,
        put_pedido_status,
        post_webhook_pedido,
        put_pedido,
        post_webhook_mercadopago
    },
    securityDefinitions: {
        JWT: {
          type: 'apiKey',
          in: 'header', 
          name: 'Authorization', 
          description: 'JWT Access Token - Incluir o Bearer'
        }
    },
    "x-google-backend": {
        "address": "https://backend-koxvlyfy2a-rj.a.run.app",
        "jwt_audience": "https://backend-koxvlyfy2a-rj.a.run.app"
    },        
}