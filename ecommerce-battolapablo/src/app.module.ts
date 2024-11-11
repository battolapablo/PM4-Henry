import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ProductsModule } from './modules/products/products.module';
import { AuthUserModule } from './modules/authUser/authUser.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrderDetailsModule } from './modules/order-details/order-details.module';
import { OrdersModule } from './modules/orders/orders.module';
import { FilesModule } from './modules/files/files.module';
import { CloudinaryConfig } from './config/cloudinary';
import TypeOrmConfig from './config/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [TypeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        const config = configService.get<TypeOrmModuleOptions>('typeorm');
        if (!config) {
          throw new Error('TypeORM configuration is not defined');
        }
        return config;
      },
    }),
    CategoriesModule,
    AuthUserModule,
    ProductsModule,
    UsersModule,
    OrdersModule,
    OrderDetailsModule,
    FilesModule,
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: '1h' },
      global: true,
    }),
  ],
  providers: [CloudinaryConfig],
})
export class AppModule {}
