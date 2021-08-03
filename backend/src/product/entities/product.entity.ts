import { Entity, Unique, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Category } from "src/category/entities/category.entity";

@Entity()
@Unique(['name'])
@Unique(['productCode'])
export class Product extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column()
    productCode: string;
      
    @Column()
    name: string;

    @Column("float")
    price: number;

    @Column()
    isFavorite: boolean;

    @Column()
    isAvailable: boolean;

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

    @ManyToOne(() => Category, category => category.products, {onDelete: 'CASCADE'})
    category: Category;
}
 