import Gateway from '#models/gateway'

export default class GatewayService {
  async charge(data: { amount: number, name: string, email: string, cardNumber: string, cvv: string})
  {
    const gateways = await Gateway.query()
      .where('is_active', true)
      .orderBy('priority', 'asc')

    for (const gateway of gateways) {
      try {
        
        if (gateway.name === 'Gateway1') {
          const token = await this.loginGateway1()
          const response = await fetch('http://localhost:3001/transactions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              amount: data.amount,
              name: data.name,
              email: data.email,
              cardNumber: data.cardNumber,
              cvv: data.cvv,
            }),
          })

          if (!response.ok) throw new Error('Gateway1 failed')

          const result = await response.json() as { id: string }
          return { gateway, externalId: result.id, data: result }
        }

        if (gateway.name === 'Gateway2') {
          const response = await fetch('http://localhost:3002/transacoes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Gateway-Auth-Token': 'tk_f2198cc671b5289fa856',
              'Gateway-Auth-Secret': '3d15e8ed6131446ea7e3456728b1211f',
            },
            body: JSON.stringify({
              valor: data.amount,
              nome: data.name,
              email: data.email,
              numeroCartao: data.cardNumber,
              cvv: data.cvv,
            }),
          })

          if (!response.ok) throw new Error('Gateway2 failed')

          const result = await response.json() as { id: string }
          return { gateway, externalId: result.id, data: result }
        }
      } catch {
        continue
      }
    }

    throw new Error('All gateways failed')
  }

  async refund(transaction: { externalId: string; gateway: { name: string } }) {
    if (transaction.gateway.name === 'Gateway1') {
      const token = await this.loginGateway1()
      const response = await fetch(
        `http://localhost:3001/transactions/${transaction.externalId}/charge_back`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) throw new Error('Gateway1 refund failed')
      return
    }

    if (transaction.gateway.name === 'Gateway2') {
      const response = await fetch('http://localhost:3002/transacoes/reembolso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Gateway-Auth-Token': 'tk_f2198cc671b5289fa856',
          'Gateway-Auth-Secret': '3d15e8ed6131446ea7e3456728b1211f',
        },
        body: JSON.stringify({ id: transaction.externalId }),
      })

      if (!response.ok) throw new Error('Gateway2 refund failed')
      return
    }

    throw new Error('Unknown gateway')
  }

  private async loginGateway1(): Promise<string> {
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'dev@betalent.tech',
        token: 'FEC9BB078BF338F464F96B48089EB498',
      }),
    })

    if (!response.ok) throw new Error('Gateway1 login failed')

    const result = await response.json() as { token: string }
    return result.token
  }
}