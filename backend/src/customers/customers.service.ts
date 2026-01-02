import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: createCustomerDto,
    });
  }

  async findAll(search?: string) {
    const where: any = {};
    
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    return this.prisma.customer.findMany({
      where,
      include: {
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
        where: { id },
        include: {
        orders: {
            include: {
            filling: true,
            dough: true,
            },
            orderBy: { orderDate: 'desc' },
        },
        },
    });

    if (!customer) {
        throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    // Calculate statistics
    const totalSpent = customer.orders.reduce(
        (acc, order) => acc + Number(order.totalValue),
        0,
    );
    const lastOrder = customer.orders[0]?.orderDate || null;

    return {
        ...customer,
        statistics: {
        totalOrders: customer.orders.length,
        totalSpent,
        lastOrder,
        },
    };
    }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    // Check if has orders
    const orders = await this.prisma.order.count({
      where: { customerId: id },
    });

    if (orders > 0) {
      throw new BadRequestException(
        'Cannot delete customer with registered orders',
      );
    }

    return this.prisma.customer.delete({
      where: { id },
    });
  }
}


