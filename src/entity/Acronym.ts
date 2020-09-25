import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class Acronym extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  acronym: string;

  @Column()
  meaning: string;
}
