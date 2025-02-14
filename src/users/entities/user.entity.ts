import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
} from 'typeorm'

import { CreditCard } from '../../credit-cards/entities/credit-card.entity'

@Entity()
@Index('user_email_ids', ['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column()
  name: string

  @OneToMany(() => CreditCard, (creditCard) => creditCard.user, {
    cascade: true,
  })
  creditCards: CreditCard[]
}
