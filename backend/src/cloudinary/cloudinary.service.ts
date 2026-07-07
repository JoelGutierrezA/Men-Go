import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinarySettings } from './interfaces/cloudinary-settings.interface';

@Injectable()
export class CloudinaryService {
  private readonly settings: CloudinarySettings;

  constructor(private readonly configService: ConfigService) {
    this.settings =
      this.configService.getOrThrow<CloudinarySettings>('cloudinary');

    if (this.isConfigured()) {
      cloudinary.config({
        cloud_name: this.settings.cloudName,
        api_key: this.settings.apiKey,
        api_secret: this.settings.apiSecret,
        secure: true,
      });
    }
  }

  getConfiguration(): CloudinarySettings {
    return this.settings;
  }

  isConfigured(): boolean {
    return Boolean(
      this.settings.cloudName &&
        this.settings.apiKey &&
        this.settings.apiSecret,
    );
  }
}
