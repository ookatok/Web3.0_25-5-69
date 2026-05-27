/**
 * @file contact.ts
 * @path src/domain/entities/contact.ts
 * @description เอนทิตีการติดต่อ (Contact Entity) ในระดับ Domain Layer กำหนดคุณลักษณะการส่งข้อความติดต่อและแบบประเมินราคาเสื้อของลูกค้า
 */

export interface ContactProps {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string;
  createdAt: Date;
}

export class Contact {
  private constructor(private readonly props: ContactProps) {}

  public static create(props: ContactProps): Contact {
    return new Contact(props);
  }

  public get id(): string {
    return this.props.id;
  }

  public get name(): string {
    return this.props.name;
  }

  public get phone(): string | null {
    return this.props.phone;
  }

  public get email(): string | null {
    return this.props.email;
  }

  public get message(): string {
    return this.props.message;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      phone: this.phone,
      email: this.email,
      message: this.message,
      createdAt: this.createdAt,
    };
  }
}
