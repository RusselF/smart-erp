import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const settings = await this.prisma.setting.findMany();
    // Convert array of {key, value} to a simple object {key: value}
    return settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  }

  async update(data: Record<string, string>) {
    // Upsert each key-value pair
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        await this.prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }
    }
    return { success: true };
  }
}
