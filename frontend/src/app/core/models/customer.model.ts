export interface Customer {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerCreateDto {
  name: string;
  phone: string;
  whatsapp?: string;
  address?: string;
}
