import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { OrderStatus } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('orders')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar nova encomenda' })
  @ApiResponse({ status: 201, description: 'Encomenda criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou antecedência insuficiente' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as encomendas' })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Lista de encomendas retornada com sucesso' })
  findAll(
    @Query('status') status?: OrderStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.ordersService.findAll(status, startDate, endDate);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Listar encomendas pendentes' })
  @ApiResponse({ status: 200, description: 'Encomendas pendentes retornadas com sucesso' })
  findPending() {
    return this.ordersService.findPending();
  }

  @Get('by-date/:date')
  @ApiOperation({ summary: 'Buscar encomendas por data de entrega' })
  @ApiResponse({ status: 200, description: 'Encomendas encontradas' })
  findByDeliveryDate(@Param('date') date: string) {
    return this.ordersService.findByDeliveryDate(new Date(date));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar encomenda por ID' })
  @ApiResponse({ status: 200, description: 'Encomenda encontrada' })
  @ApiResponse({ status: 404, description: 'Encomenda não encontrada' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar encomenda' })
  @ApiResponse({ status: 200, description: 'Encomenda atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Encomenda não encontrada' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status da encomenda' })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Encomenda não encontrada' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar encomenda' })
  @ApiResponse({ status: 204, description: 'Encomenda deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Encomenda não encontrada' })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
