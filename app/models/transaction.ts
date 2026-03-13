import { BaseModel, belongsTo, column, hasMany } from "@adonisjs/lucid/orm";
import Client from "./client.ts";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import Gateway from "./gateway.ts";
import TransactionProduct from "./transaction_product.ts";
import { DateTime } from "luxon";

export default class Transaction extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare clientId: number

    @column()
    declare gatewayId: number

    @column()
    declare externalId: string | null

    @column()
    declare status: string

    @column()
    declare amount: number

    @column()
    declare cardLastNumbers: string | null

    @belongsTo(() => Client)
    declare client: BelongsTo<typeof Client>

    @belongsTo(() => Gateway)
    declare gateway: BelongsTo<typeof Gateway>

    @hasMany(() => TransactionProduct)
    declare transactionProducts: HasMany<typeof TransactionProduct>

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

}