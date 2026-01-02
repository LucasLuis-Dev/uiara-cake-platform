import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { DateRangeDto } from './dto/date-range.dto';
import { CalendarQueryDto } from './dto/calendar-query.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('reports')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Obter métricas do dashboard' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Métricas retornadas com sucesso' })
  getDashboard(@Query() dateRangeDto: DateRangeDto) {
    const startDate = dateRangeDto.startDate
      ? new Date(dateRangeDto.startDate)
      : undefined;
    const endDate = dateRangeDto.endDate
      ? new Date(dateRangeDto.endDate)
      : undefined;

    return this.reportsService.getDashboard(startDate, endDate);
  }

  @Get('calendar')
  @ApiOperation({ summary: 'Obter calendário de entregas' })
  @ApiQuery({ name: 'month', required: false, type: Number })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Calendário retornado com sucesso' })
  getCalendar(@Query() calendarQueryDto: CalendarQueryDto) {
    return this.reportsService.getCalendar(
      calendarQueryDto.month,
      calendarQueryDto.year,
    );
  }

  @Get('financial')
  @ApiOperation({ summary: 'Obter relatório financeiro' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Relatório retornado com sucesso' })
  getFinancialReport(@Query() dateRangeDto: DateRangeDto) {
    const startDate = dateRangeDto.startDate
      ? new Date(dateRangeDto.startDate)
      : undefined;
    const endDate = dateRangeDto.endDate
      ? new Date(dateRangeDto.endDate)
      : undefined;

    return this.reportsService.getFinancialReport(startDate, endDate);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Obter receita por período' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Receita retornada com sucesso' })
  getRevenueByPeriod(@Query() dateRangeDto: DateRangeDto) {
    const today = new Date();
    const startDate = dateRangeDto.startDate
      ? new Date(dateRangeDto.startDate)
      : new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = dateRangeDto.endDate
      ? new Date(dateRangeDto.endDate)
      : today;

    return this.reportsService.getRevenueByPeriod(startDate, endDate);
  }

  @Get('product-performance')
  @ApiOperation({ summary: 'Obter performance de produtos' })
  @ApiResponse({ status: 200, description: 'Performance retornada com sucesso' })
  getProductPerformance() {
    return this.reportsService.getProductPerformance();
  }

  @Get('upcoming-deliveries')
  @ApiOperation({ summary: 'Obter próximas entregas' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Entregas retornadas com sucesso' })
  getUpcomingDeliveries(
    @Query('days', new DefaultValuePipe(7), ParseIntPipe) days: number,
  ) {
    return this.reportsService.getUpcomingDeliveries(days);
  }
}
