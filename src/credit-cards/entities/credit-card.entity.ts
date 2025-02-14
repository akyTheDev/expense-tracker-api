import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

import { User } from '../../users/entities/user.entity'

@Entity()
export class CreditCard {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(() => User, (user) => user.creditCards, { onDelete: 'CASCADE' })
  user: User
}
