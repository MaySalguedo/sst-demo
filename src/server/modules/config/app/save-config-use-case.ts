import type { AppConfig, AppConfigInput } from "@domain/models/app-config";
import type { PropertiesConfigRepository } from "@infra/adapters/properties-config-repository";

export class SaveConfigUseCase {
  constructor(private readonly config: PropertiesConfigRepository) {}

  execute(partial: AppConfigInput): AppConfig {
    return this.config.save(partial);
  }
}
