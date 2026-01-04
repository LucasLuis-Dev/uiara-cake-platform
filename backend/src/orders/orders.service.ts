import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CalendarService } from '../calendar/calendar.service';
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
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private prisma: PrismaService,
    private calendarService: CalendarService,
  ) {}

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
    const order = await this.prisma.order.create({
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

    // 🎯 CREATE GOOGLE CALENDAR EVENT
    try {
      const eventId = await this.calendarService.createEvent({
        summary: `🎂 Entrega: ${customer.name}`,
        description: this.buildEventDescription(order),
        location: customer.address ?? undefined,
        startDateTime: deliveryDate,
        endDateTime: new Date(deliveryDate.getTime() + 60 * 60 * 1000), // +1 hour
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 120 }, // 2 hours before
            { method: 'popup', minutes: 30 }, // 30 min before
          ],
        },
      });

      // Save eventId in order
      if (eventId) {
        await this.prisma.order.update({
          where: { id: order.id },
          data: { googleCalendarEventId: eventId },
        });
        this.logger.log(`✅ Calendar event created for order ${order.id}`);
      }
    } catch (error) {
      this.logger.error('Failed to create calendar event', error);
      // Don't fail order creation if calendar fails
    }

    return order;
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
    const currentOrder = await this.findOne(id);

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
      const newSize = updateOrderDto.size || currentOrder.size;
      const newCoverageType = updateOrderDto.coverageType || currentOrder.coverageType;
      totalValue = calculatePrice(newSize, newCoverageType);
    }

    // Update order
    const updatedOrder = await this.prisma.order.update({
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

    // 🎯 UPDATE GOOGLE CALENDAR EVENT
    if (currentOrder.googleCalendarEventId) {
      try {
        const calendarUpdate: any = {};

        // Update summary if customer changed (unlikely, but possible)
        calendarUpdate.summary = `🎂 Entrega: ${updatedOrder.customer.name}`;
        calendarUpdate.description = this.buildEventDescription(updatedOrder);

        // Update dates if changed
        if (updateOrderDto.deliveryDate) {
          const newDeliveryDate = new Date(updateOrderDto.deliveryDate);
          calendarUpdate.startDateTime = newDeliveryDate;
          calendarUpdate.endDateTime = new Date(
            newDeliveryDate.getTime() + 60 * 60 * 1000,
          );
        }

        const success = await this.calendarService.updateEvent(
          currentOrder.googleCalendarEventId,
          calendarUpdate,
        );

        if (success) {
          this.logger.log(`✅ Calendar event updated for order ${id}`);
        }
      } catch (error) {
        this.logger.error('Failed to update calendar event', error);
      }
    }

    return updatedOrder;
  }

  async updateStatus(id: string, updateStatusDto: UpdateStatusDto) {
    const order = await this.findOne(id);

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { status: updateStatusDto.status },
      include: {
        customer: true,
        filling: true,
        dough: true,
      },
    });

    // 🎯 DELETE CALENDAR EVENT IF CANCELLED
    if (
      updateStatusDto.status === 'CANCELLED' &&
      order.googleCalendarEventId
    ) {
      try {
        const success = await this.calendarService.deleteEvent(
          order.googleCalendarEventId,
        );

        if (success) {
          await this.prisma.order.update({
            where: { id },
            data: { googleCalendarEventId: null },
          });
          this.logger.log(`✅ Calendar event deleted for cancelled order ${id}`);
        }
      } catch (error) {
        this.logger.error('Failed to delete calendar event', error);
      }
    }

    // 🎯 UPDATE EVENT COLOR BASED ON STATUS
    if (
      updateStatusDto.status !== 'CANCELLED' &&
      order.googleCalendarEventId
    ) {
      try {
        const colorId = this.getColorIdByStatus(updateStatusDto.status);
        const eventDescription = this.buildEventDescription(updatedOrder);
        
        await this.calendarService.updateEvent(
          order.googleCalendarEventId,
          {
            summary: this.getEventTitleByStatus(updatedOrder),
            description: eventDescription,
          },
        );

        this.logger.log(`✅ Calendar event status updated for order ${id}`);
      } catch (error) {
        this.logger.error('Failed to update calendar event status', error);
      }
    }

    return updatedOrder;
  }

  async remove(id: string) {
    const order = await this.findOne(id);

    // 🎯 DELETE CALENDAR EVENT
    if (order.googleCalendarEventId) {
      try {
        await this.calendarService.deleteEvent(order.googleCalendarEventId);
        this.logger.log(`✅ Calendar event deleted for removed order ${id}`);
      } catch (error) {
        this.logger.error('Failed to delete calendar event', error);
      }
    }

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
          in: ['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'READY'],
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

  // 🎨 HELPER: Build event description
  private buildEventDescription(order: any): string {
    const statusEmoji = {
      PENDING: '⏳',
      CONFIRMED: '✅',
      IN_PRODUCTION: '👨‍🍳',
      READY: '📦',
      DELIVERED: '🎉',
      CANCELLED: '❌',
    };

    return `
${statusEmoji[order.status]} Status: ${order.status}

📦 Pedido #${order.id.substring(0, 8)}
👤 Cliente: ${order.customer.name}
📱 Telefone: ${order.customer.phone}
${order.customer.whatsapp ? `💬 WhatsApp: ${order.customer.whatsapp}` : ''}
${order.customer.address ? `📍 Endereço: ${order.customer.address}` : ''}

🍰 DETALHES DO BOLO:
━━━━━━━━━━━━━━━━━━━━
📏 Tamanho: ${order.size}
🎨 Cobertura: ${order.coverageType === 'CHANTILLY' ? 'Chantilly' : 'Ganache'}
🍫 Recheio: ${order.filling.name}
🥐 Massa: ${order.dough.name}

💰 Valor: R$ ${Number(order.totalValue).toFixed(2)}

${order.observations ? `📝 Observações:\n${order.observations}` : ''}

🗓️ Data do pedido: ${new Date(order.orderDate).toLocaleDateString('pt-BR')}
    `.trim();
  }

  // 🎨 HELPER: Get event title by status
  private getEventTitleByStatus(order: any): string {
    const statusPrefix = {
      PENDING: '⏳',
      CONFIRMED: '✅',
      IN_PRODUCTION: '👨‍🍳',
      READY: '📦',
      DELIVERED: '🎉',
      CANCELLED: '❌',
    };

    return `${statusPrefix[order.status]} Entrega: ${order.customer.name}`;
  }

  // 🎨 HELPER: Get color ID by status
  private getColorIdByStatus(status: OrderStatus): string {
    const colorMap = {
      PENDING: '5', // Yellow
      CONFIRMED: '10', // Green
      IN_PRODUCTION: '7', // Blue
      READY: '2', // Sage
      DELIVERED: '9', // Gray
      CANCELLED: '11', // Red
    };

    return colorMap[status] || '5';
  }
}
