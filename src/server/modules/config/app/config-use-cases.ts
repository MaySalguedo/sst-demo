import type { AppConfig, AppConfigInput } from "@domain/entities";
import type { PropertiesConfigRepository } from "@infra/adapters/properties-config-repository";

export class GetConfigUseCase {
  constructor(private readonly config: PropertiesConfigRepository) {}

  execute(): AppConfig {
    return this.config.getAll();
  }
}

export class SaveConfigUseCase {
  constructor(private readonly config: PropertiesConfigRepository) {}

  execute(partial: AppConfigInput): AppConfig {
    return this.config.save(partial);
  }
}
