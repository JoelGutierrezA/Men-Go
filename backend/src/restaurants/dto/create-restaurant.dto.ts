import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export enum RestaurantBusinessType {
  Restaurant = 'restaurante',
  Bar = 'bar',
  Pub = 'pub',
  Cafeteria = 'cafeteria',
  FoodTruck = 'food-truck',
  Other = 'otro',
}

export class RestaurantBranchDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  label?: string;

  @IsString()
  @MaxLength(180)
  address!: string;

  @IsOptional()
  @IsBoolean()
  isHeadquarters?: boolean;
}

export class CreateRestaurantDto {
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsEnum(RestaurantBusinessType)
  businessType!: RestaurantBusinessType;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  branchCount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  headquartersAddress?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(19)
  @ValidateNested({ each: true })
  @Type(() => RestaurantBranchDto)
  branches?: RestaurantBranchDto[];
}
