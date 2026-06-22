export class TriggerServiceAdapter {
  ensureDailyTrigger(functionName: string, hour: number): void {
    const triggers = ScriptApp.getProjectTriggers();
    for (const trigger of triggers) {
      if (trigger.getHandlerFunction() === functionName) {
        ScriptApp.deleteTrigger(trigger);
      }
    }

    ScriptApp.newTrigger(functionName)
      .timeBased()
      .everyDays(1)
      .atHour(hour)
      .create();
  }
}
