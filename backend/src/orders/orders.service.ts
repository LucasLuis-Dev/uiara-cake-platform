import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { OrderStatus } from '@prisma/client';
import {
  calculatePrice,
  validateAdvanceNotice,
} from '../utils/calculations';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const deliveryDate = new Date(createOrderDto.deliveryDate);

    // Validate minimum advance notice
    if (!validateAdvanceNotice(deliveryDate)) {
      throw new BadRequestException(
        'Orders must be placed at least 2 days in advance',
      );
    }

    // Validate if customer exists
    const customer = await this.prisma.customer.findUnique({
      where: { id: createOrderDto.customerId },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Validate if filling exists and is correct type
    const filling = await this.prisma.flavor.findUnique({
      where: { id: createOrderDto.fillingId },
    });
    if (!filling || filling.type !== 'FILLING') {
      throw new BadRequestException('Invalid filling');
    }

    // Validate if dough exists and is correct type
    const dough = await this.prisma.flavor.findUnique({
      where: { id: createOrderDto.doughId },
    });
    if (!dough || dough.type !== 'DOUGH') {
      throw new BadRequestException('Invalid dough');
    }

    // Calculate total value
    const totalValue = calculatePrice(
      createOrderDto.size,
      createOrderDto.coverageType,
    );

    // Create order
    return this.prisma.order.create({
      data: {
        customerId: createOrderDto.customerId,
        size: createOrderDto.size,
        coverageType: createOrderDto.coverageType,
        fillingId: createOrderDto.fillingId,
        doughId: createOrderDto.doughId,
        deliveryDate,
        totalValue,
        observations: createOrderDto.observations,
      },
      include: {
        customer: true,
        filling: true,
        dough: true,
      },
    });
  }

  async findAll(
    status?: OrderStatus,
    startDate?: string,
    endDate?: string,
  ) {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.deliveryDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    return this.prisma.order.findMany({
      where,
      include: {
        customer: true,
        filling: true,
        dough: true,
      },
      orderBy: { deliveryDate: 'asc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        filling: true,
        dough: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    await this.findOne(id); // Check if exists

    // If delivery date is being updated, validate advance notice
    if (updateOrderDto.deliveryDate) {
      const deliveryDate = new Date(updateOrderDto.deliveryDate);
      if (!validateAdvanceNotice(deliveryDate)) {
        throw new BadRequestException(
          'Orders must be placed at least 2 days in advance',
        );
      }
    }

    // Recalculate price if size or coverage type changed
    let totalValue: number | undefined;
    if (updateOrderDto.size || updateOrderDto.coverageType) {
      const currentOrder = await this.findOne(id);
      const newSize = updateOrderDto.size || currentOrder.size;
      const newCoverageType = updateOrderDto.coverageType || currentOrder.coverageType;
      totalValue = calculatePrice(newSize, newCoverageType);
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        ...updateOrderDto,
        ...(totalValue && { totalValue }),
      },
      include: {
        customer: true,
        filling: true,
        dough: true,
      },
    });
  }

  async updateStatus(id: string, updateStatusDto: UpdateStatusDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.order.update({
      where: { id },
      data: { status: updateStatusDto.status },
      include: {
        customer: true,
        filling: true,
        dough: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.order.delete({
      where: { id },
    });
  }

  // Helper method to get orders by delivery date
  async findByDeliveryDate(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.order.findMany({
      where: {
        deliveryDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        customer: true,
        filling: true,
        dough: true,
      },
      orderBy: { deliveryDate: 'asc' },
    });
  }

  // Helper method to get pending orders
  async findPending() {
    return this.prisma.order.findMany({
      where: {
        status: {
          in: ['PENDING', 'CONFIRMED', 'IN_PRODUCTION'],
        },
      },
      include: {
        customer: true,
        filling: true,
        dough: true,
      },
      orderBy: { deliveryDate: 'asc' },
    });
  }
}
