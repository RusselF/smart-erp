import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    findAll(): Promise<Record<string, string>>;
    update(data: Record<string, string>): Promise<{
        success: boolean;
    }>;
}
