import {
  Index,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'

import { CreditCard } from '../../credit-cards/entities/credit-card.entity'

@Entity()
@Index('transaction_card_id_idx', ['creditCard'])
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  date: Date

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number

  @Column({ type: 'varchar', length: 255 })
  description: string

  @ManyToOne(() => CreditCard, (creditCard) => creditCard.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'card_id' })
  creditCard: CreditCard
}
