import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { PurchasesModule } from './purchases/purchases.module';
import { SettingsModule } from './settings/settings.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, CategoriesModule, ProductsModule, OrdersModule, DashboardModule, SuppliersModule, PurchasesModule, SettingsModule, ExpensesModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
