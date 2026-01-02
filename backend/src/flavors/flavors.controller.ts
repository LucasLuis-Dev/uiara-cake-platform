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
  ParseBoolPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { FlavorsService } from './flavors.service';
import { CreateFlavorDto } from './dto/create-flavor.dto';
import { UpdateFlavorDto } from './dto/update-flavor.dto';
import { ToggleActiveDto } from './dto/toggle-active.dto';
import { FlavorType } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('flavors')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('flavors')
export class FlavorsController {
  constructor(private readonly flavorsService: FlavorsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo sabor' })
  @ApiResponse({ status: 201, description: 'Sabor criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Sabor com este ID já existe' })
  create(@Body() createFlavorDto: CreateFlavorDto) {
    return this.flavorsService.create(createFlavorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os sabores' })
  @ApiQuery({ name: 'type', required: false, enum: FlavorType })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Lista de sabores retornada com sucesso' })
  findAll(
    @Query('type') type?: FlavorType,
    @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly?: boolean,
  ) {
    return this.flavorsService.findAll(type, activeOnly);
  }

  @Get('fillings')
  @ApiOperation({ summary: 'Listar todos os recheios' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Lista de recheios retornada com sucesso' })
  findAllFillings(
    @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly?: boolean,
  ) {
    return this.flavorsService.findAllFillings(activeOnly);
  }

  @Get('doughs')
  @ApiOperation({ summary: 'Listar todas as massas' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Lista de massas retornada com sucesso' })
  findAllDoughs(
    @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly?: boolean,
  ) {
    return this.flavorsService.findAllDoughs(activeOnly);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar sabor por ID' })
  @ApiResponse({ status: 200, description: 'Sabor encontrado' })
  @ApiResponse({ status: 404, description: 'Sabor não encontrado' })
  findOne(@Param('id') id: string) {
    return this.flavorsService.findOne(id);
  }

  @Get(':id/statistics')
  @ApiOperation({ summary: 'Obter estatísticas de um sabor' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas com sucesso' })
  @ApiResponse({ status: 404, description: 'Sabor não encontrado' })
  getStatistics(@Param('id') id: string) {
    return this.flavorsService.getStatistics(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar sabor' })
  @ApiResponse({ status: 200, description: 'Sabor atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Sabor não encontrado' })
  update(@Param('id') id: string, @Body() updateFlavorDto: UpdateFlavorDto) {
    return this.flavorsService.update(id, updateFlavorDto);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Ativar/desativar sabor' })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Sabor não encontrado' })
  toggleActive(@Param('id') id: string, @Body() toggleActiveDto: ToggleActiveDto) {
    return this.flavorsService.toggleActive(id, toggleActiveDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar sabor' })
  @ApiResponse({ status: 204, description: 'Sabor deletado com sucesso' })
  @ApiResponse({ status: 400, description: 'Sabor está sendo usado em encomendas' })
  @ApiResponse({ status: 404, description: 'Sabor não encontrado' })
  remove(@Param('id') id: string) {
    return this.flavorsService.remove(id);
  }
}
