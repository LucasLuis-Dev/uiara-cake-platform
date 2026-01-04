export interface Customer {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
  _count: count
}

interface count {
  orders: number;
}

export interface CustomerCreateDto {
  name: string;
  phone: string;
  whatsapp?: string;
  address?: string;
}

export interface CustomerUpdateDto extends Partial<CustomerCreateDto> {}