import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, CreateExpenseCategoryDto } from './dto/create-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'OWNER')
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  // ================= CATEGORIES =================
  
  @Get('categories')
  getCategories() {
    return this.expensesService.getCategories();
  }

  @Post('categories')
  createCategory(@Body() data: CreateExpenseCategoryDto) {
    return this.expensesService.createCategory(data);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.expensesService.deleteCategory(id);
  }

  // ================= EXPENSES =================

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.expensesService.findAll(
      page ? +page : 1,
      limit ? +limit : 10,
      startDate,
      endDate
    );
  }

  @Post()
  create(@Body() data: CreateExpenseDto, @Req() req: any) {
    return this.expensesService.create(data, req.user?.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expensesService.remove(id);
  }
}
