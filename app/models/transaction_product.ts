import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import Transaction from './transaction.ts';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import Product from './product.ts';

export default class TransactionProduct extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare transactionId: number

    @column()
    declare productId: number

    @column()
    declare quantity: number

    @belongsTo(() => Transaction)
    declare transaction: BelongsTo<typeof Transaction>

    @belongsTo(() => Product)
    declare product: BelongsTo<typeof Product>
    
}