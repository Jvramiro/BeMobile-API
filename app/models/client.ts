import { BaseModel, column, hasMany } from "@adonisjs/lucid/orm";
import Transaction from "./transaction.ts";
import type { HasMany } from "@adonisjs/lucid/types/relations";
import { DateTime } from "luxon";

export default class Client extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare name: string

    @column()
    declare email: string

    @hasMany(() => Transaction)
    declare transactions: HasMany<typeof Transaction>

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}