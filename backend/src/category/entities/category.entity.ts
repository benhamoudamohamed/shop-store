import { Entity, Unique, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Product } from "src/product/entities/product.entity";

@Entity()
@Unique(['name'])
export class Category  extends BaseEntity {
    
    @PrimaryGeneratedColumn('increment')
    id: string;
    
    @Column()
    name: string;

    @Column()
    fileName: string;

    @Column()
    fileURL: string;

    @Column()
    fileName_low: string;

    @Column()
    fileURL_low: string; 
  
    @CreateDateColumn()
    created: Date;

    @OneToMany(() => Product, product => product.category, {eager: true, onDelete: 'CASCADE'})
    products: Product[];
}
