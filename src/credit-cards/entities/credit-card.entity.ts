import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm'

import { Transaction } from '../../transactions/entities/transaction.entity'
import { User } from '../../users/entities/user.entity'

@Entity()
export class CreditCard {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(() => User, (user) => user.creditCards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @OneToMany(() => Transaction, (transaction) => transaction.creditCard, {
    cascade: true,
  })
  transactions: Transaction[]
}
