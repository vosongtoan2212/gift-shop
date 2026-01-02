import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';

export enum PaymentMethod {
  COD = 'cod',
  VNPAY = 'vnpay',
  VNPAY_QR = 'vnpay_qr',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => OrderEntity, (order) => order.payment)
  @JoinColumn()
  order: OrderEntity;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  method: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true, unique: true })
  vnpTxnRef: string;

  @Column({ nullable: true })
  vnpTransactionNo: string;

  @Column({ nullable: true })
  vnpBankCode: string;

  @Column({ nullable: true })
  vnpCardType: string;

  @Column({ type: 'text', nullable: true })
  vnpResponseCode: string;

  @Column({ type: 'text', nullable: true })
  vnpSecureHash: string;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
