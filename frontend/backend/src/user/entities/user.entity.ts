import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { UserRole } from 'src/shared/role.enum';

@Entity()
@Unique(['email'])
export class User extends BaseEntity  {
    
    @PrimaryGeneratedColumn('increment')
    id: string;
    
    @Column()
    firstname: string;

    @Column()
    lastname: string;
  
    @Column()
    email: string;
  
    @Column()
    password: string;

    @Column({
        default: UserRole.MODERATOR,
        enum: UserRole,
        type: 'enum',
    })
    userRole: UserRole;
  
    @Column()
    salt: string;
  
    @CreateDateColumn()
    created: Date;

    @Column({nullable: true})
    @Exclude()
    public currentHashedRefreshToken?: string;

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt)
        return hash === this.password;
    }

    toResponseObject() {
        const { id, firstname, lastname, email, userRole, created } = this;
        const responseObject = { id, firstname, lastname, email, userRole, created };
        return responseObject;
    }
} 