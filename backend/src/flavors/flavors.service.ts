import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFlavorDto } from './dto/create-flavor.dto';
import { UpdateFlavorDto } from './dto/update-flavor.dto';
import { ToggleActiveDto } from './dto/toggle-active.dto';
import { FlavorType } from '@prisma/client';

@Injectable()
export class FlavorsService {
  constructor(private prisma: PrismaService) {}

  async create(createFlavorDto: CreateFlavorDto) {
    // Check if ID already exists
    const existingFlavor = await this.prisma.flavor.findUnique({
      where: { id: createFlavorDto.id },
    });

    if (existingFlavor) {
      throw new ConflictException(`Flavor with ID '${createFlavorDto.id}' already exists`);
    }

    return this.prisma.flavor.create({
      data: {
        id: createFlavorDto.id,
        name: createFlavorDto.name,
        type: createFlavorDto.type,
        active: createFlavorDto.active !== undefined ? createFlavorDto.active : true,
      },
    });
  }

  async findAll(type?: FlavorType, activeOnly?: boolean) {
    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (activeOnly) {
      where.active = true;
    }

    return this.prisma.flavor.findMany({
      where,
      orderBy: [
        { type: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  async findAllFillings(activeOnly: boolean = false) {
    return this.findAll('FILLING', activeOnly);
  }

  async findAllDoughs(activeOnly: boolean = false) {
    return this.findAll('DOUGH', activeOnly);
  }

  async findOne(id: string) {
    const flavor = await this.prisma.flavor.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            ordersAsFilling: true,
            ordersAsDough: true,
          },
        },
      },
    });

    if (!flavor) {
      throw new NotFoundException(`Flavor with ID '${id}' not found`);
    }

    return {
      ...flavor,
      usageCount: flavor._count.ordersAsFilling + flavor._count.ordersAsDough,
    };
  }

  async update(id: string, updateFlavorDto: UpdateFlavorDto) {
    await this.findOne(id); // Check if exists

    // If changing ID, check if new ID already exists
    if (updateFlavorDto.id && updateFlavorDto.id !== id) {
      const existingFlavor = await this.prisma.flavor.findUnique({
        where: { id: updateFlavorDto.id },
      });

      if (existingFlavor) {
        throw new ConflictException(`Flavor with ID '${updateFlavorDto.id}' already exists`);
      }
    }

    return this.prisma.flavor.update({
      where: { id },
      data: updateFlavorDto,
    });
  }

  async toggleActive(id: string, toggleActiveDto: ToggleActiveDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.flavor.update({
      where: { id },
      data: { active: toggleActiveDto.active },
    });
  }

  async remove(id: string) {
    const flavor = await this.findOne(id); // Check if exists

    // Check if flavor is being used in orders
    const ordersCount = await this.prisma.order.count({
      where: {
        OR: [
          { fillingId: id },
          { doughId: id },
        ],
      },
    });

    if (ordersCount > 0) {
      throw new BadRequestException(
        `Cannot delete flavor '${flavor.name}' because it is being used in ${ordersCount} order(s). Consider deactivating it instead.`
      );
    }

    return this.prisma.flavor.delete({
      where: { id },
    });
  }

  // Get flavor statistics
  async getStatistics(id: string) {
    const flavor = await this.findOne(id);

    const orders = await this.prisma.order.findMany({
      where: {
        OR: [
          { fillingId: id },
          { doughId: id },
        ],
      },
      select: {
        totalValue: true,
        orderDate: true,
      },
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (acc, order) => acc + Number(order.totalValue),
      0,
    );

    // Orders by month
    const ordersByMonth = orders.reduce((acc: any, order) => {
      const monthYear = new Date(order.orderDate).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'short',
      });
      acc[monthYear] = (acc[monthYear] || 0) + 1;
      return acc;
    }, {});

    return {
      flavor: {
        id: flavor.id,
        name: flavor.name,
        type: flavor.type,
        active: flavor.active,
      },
      statistics: {
        totalOrders,
        totalRevenue,
        ordersByMonth,
      },
    };
  }
}
