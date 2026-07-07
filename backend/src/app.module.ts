import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { appConfig } from './config/app.config';
import { authConfig } from './config/auth.config';
import { cloudinaryConfig } from './config/cloudinary.config';
import { envValidationSchema } from './config/env.validation';
import { ProductsModule } from './products/products.module';
import { PromotionsModule } from './promotions/promotions.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { ThemesModule } from './themes/themes.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [appConfig, authConfig, cloudinaryConfig],
      validationSchema: envValidationSchema,
    }),
    AuthModule,
    UsersModule,
    RestaurantsModule,
    CategoriesModule,
    ProductsModule,
    PromotionsModule,
    ThemesModule,
    CloudinaryModule,
  ],
})
export class AppModule {}
