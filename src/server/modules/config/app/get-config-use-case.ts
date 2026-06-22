import type { AppConfig } from "@domain/models/app-config";
import type { PropertiesConfigRepository } from "@infra/adapters/properties-config-repository";

export class GetConfigUseCase {
  constructor(private readonly config: PropertiesConfigRepository) {}

  execute(): AppConfig {
    return this.config.getAll();
  }
}
