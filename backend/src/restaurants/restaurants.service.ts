import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  CreateRestaurantDto,
  RestaurantBranchDto,
} from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import {
  RestaurantBranch,
  RestaurantRecord,
} from './interfaces/restaurant.interface';

@Injectable()
export class RestaurantsService {
  // Temporal storage until the database repository is connected.
  private readonly restaurants = new Map<string, RestaurantRecord>();

  create(createRestaurantDto: CreateRestaurantDto): RestaurantRecord {
    const now = new Date().toISOString();
    const branchCount = this.resolveBranchCount(createRestaurantDto);
    const headquartersAddress = createRestaurantDto.headquartersAddress?.trim() ?? '';

    const restaurant: RestaurantRecord = {
      id: randomUUID(),
      name: createRestaurantDto.name.trim(),
      businessType: createRestaurantDto.businessType,
      description: createRestaurantDto.description?.trim() ?? '',
      logoUrl: createRestaurantDto.logoUrl ?? null,
      branchCount,
      headquartersAddress,
      branches: this.buildBranches(
        branchCount,
        headquartersAddress,
        createRestaurantDto.branches,
      ),
      createdAt: now,
      updatedAt: now,
    };

    this.restaurants.set(restaurant.id, restaurant);

    return restaurant;
  }

  findAll(): RestaurantRecord[] {
    return Array.from(this.restaurants.values());
  }

  findOne(id: string): RestaurantRecord {
    const restaurant = this.restaurants.get(id);

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found.');
    }

    return restaurant;
  }

  update(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
  ): RestaurantRecord {
    const currentRestaurant = this.findOne(id);
    const branchCount = this.resolveBranchCount(
      updateRestaurantDto,
      currentRestaurant,
    );
    const headquartersAddress =
      updateRestaurantDto.headquartersAddress?.trim() ??
      currentRestaurant.headquartersAddress;

    const restaurant: RestaurantRecord = {
      ...currentRestaurant,
      name: updateRestaurantDto.name?.trim() ?? currentRestaurant.name,
      businessType:
        updateRestaurantDto.businessType ?? currentRestaurant.businessType,
      description:
        updateRestaurantDto.description?.trim() ?? currentRestaurant.description,
      logoUrl:
        updateRestaurantDto.logoUrl === undefined
          ? currentRestaurant.logoUrl
          : updateRestaurantDto.logoUrl,
      branchCount,
      headquartersAddress,
      branches: this.buildBranches(
        branchCount,
        headquartersAddress,
        updateRestaurantDto.branches ?? currentRestaurant.branches,
      ),
      updatedAt: new Date().toISOString(),
    };

    this.restaurants.set(id, restaurant);

    return restaurant;
  }

  remove(id: string): void {
    if (!this.restaurants.delete(id)) {
      throw new NotFoundException('Restaurant not found.');
    }
  }

  private resolveBranchCount(
    restaurantDto: Pick<CreateRestaurantDto, 'branchCount' | 'branches'>,
    fallbackRestaurant?: RestaurantRecord,
  ): number {
    const rawCount =
      restaurantDto.branchCount ??
      fallbackRestaurant?.branchCount ??
      ((restaurantDto.branches?.length ?? 0) + 1);

    return Math.min(20, Math.max(1, Math.round(rawCount)));
  }

  private buildBranches(
    branchCount: number,
    headquartersAddress: string,
    branches: Array<RestaurantBranchDto | RestaurantBranch> | undefined,
  ): RestaurantBranch[] {
    const additionalBranches = (branches ?? [])
      .filter((branch) => !branch.isHeadquarters)
      .slice(0, Math.max(0, branchCount - 1))
      .map((branch, index) => this.createBranch(branch, index + 2));

    while (additionalBranches.length < branchCount - 1) {
      additionalBranches.push(
        this.createBranch({ address: '' }, additionalBranches.length + 2),
      );
    }

    return [
      {
        id: randomUUID(),
        label: 'Casa matriz',
        address: headquartersAddress,
        isHeadquarters: true,
      },
      ...additionalBranches,
    ];
  }

  private createBranch(
    branch: RestaurantBranchDto | RestaurantBranch,
    branchNumber: number,
  ): RestaurantBranch {
    return {
      id: 'id' in branch ? branch.id : randomUUID(),
      label: branch.label?.trim() || `Sucursal ${branchNumber}`,
      address: branch.address.trim(),
      isHeadquarters: false,
    };
  }
}
