/**
 * @file user.ts
 * @path src/domain/entities/user.ts
 * @description เอนทิตีผู้ใช้ (User Entity) ในระดับ Domain Layer กำหนดคุณลักษณะหลักของบัญชีผู้ดูแลระบบ (Admin)
 */

export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  name: string | null;
  role: "ADMIN";
  createdAt: Date;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  public static create(props: UserProps): User {
    return new User(props);
  }

  public get id(): string {
    return this.props.id;
  }

  public get email(): string {
    return this.props.email;
  }

  public get passwordHash(): string {
    return this.props.passwordHash;
  }

  public get name(): string | null {
    return this.props.name;
  }

  public get role(): "ADMIN" {
    return this.props.role;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      createdAt: this.createdAt,
    };
  }
}
