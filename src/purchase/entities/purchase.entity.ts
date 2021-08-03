import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { ProductModel } from "../dto/products.model";

@Entity()
export class Purchase extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column('jsonb', {nullable: false})
    items: ProductModel[];

    @Column("float")
    subtotal: number;

    @Column()
    coupon: string;

    @Column("float")
    discount: number;

    @Column("float")
    grandTotal: number;

    @Column()
    clientName: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    address: string; 

    @CreateDateColumn()
    created: Date;
}
