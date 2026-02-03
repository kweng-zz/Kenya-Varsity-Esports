// src/lib/services/workflowAutomation.ts
/**
 * Tournament Workflow Automation Service
 * Automates tournament lifecycle events and triggers
 */

import { tournamentManagement } from './tournamentManagement';
import { participantManagement } from './participantManagement';
import { registrationEnhancement } from './registrationEnhancement';
import { bracketGeneration, type Bracket } from './bracketGeneration';
import { matchScheduling } from './matchScheduling';
import { notificationService, NotificationType } from './notification';
import { broadcastTournamentStatusChange } from '@/lib/realtime/tournament-subscription';

export interface WorkflowStep {
  id: string;
  name: string;
  trigger: WorkflowTrigger;
  action: WorkflowAction;
  conditions?: WorkflowCondition[];
  enabled: boolean;
}

export type WorkflowTrigger = 
  | 'registration_start'
  | 'registration_end'
  | 'tournament_start'
  | 'round_complete'
  | 'match_complete'
  | 'tournament_end'
  | 'scheduled_time'
  | 'manual';

export type WorkflowAction =
  | 'open_registration'
  | 'close_registration'
  | 'generate_bracket'
  | 'schedule_matches'
  | 'send_reminders'
  | 'advance_round'
  | 'calculate_standings'
  | 'notify_winners'
  | 'archive_tournament';

export interface WorkflowCondition {
  field: string;
  operator: 'eq' | 'gt' | 'lt' | 'gte' | 'lte';
  value: any;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  tournamentId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  error?: string;
  result?: any;
}

class WorkflowAutomationService {
  // Registered workflows
  private workflows: Map<string, WorkflowStep> = new Map();
  
  // Execution history
  private executions: Map<string, WorkflowExecution> = new Map();

  // Default workflows
  private defaultWorkflows: WorkflowStep[] = [
    {
      id: 'auto_close_registration',
      name: 'Auto-close Registration',
      trigger: 'registration_end',
      action: 'close_registration',
      enabled: true,
    },
    {
      id: 'auto_generate_bracket',
      name: 'Auto-generate Bracket on Registration Close',
      trigger: 'registration_end',
      action: 'generate_bracket',
      conditions: [{ field: 'participantCount', operator: 'gte', value: 2 }],
      enabled: true,
    },
    {
      id: 'match_reminders',
      name: 'Send Match Reminders',
      trigger: 'scheduled_time',
      action: 'send_reminders',
      enabled: true,
    },
    {
      id: 'auto_archive',
      name: 'Auto-archive Completed Tournaments',
      trigger: 'tournament_end',
      action: 'archive_tournament',
      enabled: false, // Disabled by default
    },
  ];

  constructor() {
    // Register default workflows
    this.defaultWorkflows.forEach(w => this.workflows.set(w.id, w));
  }

  /**
   * Trigger a workflow event
   */
  async trigger(
    trigger: WorkflowTrigger,
    tournamentId: string,
    context?: Record<string, any>
  ): Promise<WorkflowExecution[]> {
    const executions: WorkflowExecution[] = [];

    // Find matching workflows
    const matchingWorkflows = Array.from(this.workflows.values())
      .filter(w => w.trigger === trigger && w.enabled);

    for (const workflow of matchingWorkflows) {
      // Check conditions
      if (workflow.conditions && workflow.conditions.length > 0) {
        const conditionsMet = await this.checkConditions(
          workflow.conditions,
          tournamentId,
          context
        );
        if (!conditionsMet) continue;
      }

      // Execute workflow
      const execution = await this.executeWorkflow(
        workflow,
        tournamentId,
        context
      );
      executions.push(execution);
    }

    return executions;
  }

  /**
   * Execute a specific workflow
   */
  private async executeWorkflow(
    workflow: WorkflowStep,
    tournamentId: string,
    context?: Record<string, any>
  ): Promise<WorkflowExecution> {
    const execution: WorkflowExecution = {
      id: `exec_${Date.now()}`,
      workflowId: workflow.id,
      tournamentId,
      status: 'running',
      startedAt: new Date().toISOString(),
    };

    this.executions.set(execution.id, execution);

    try {
      const result = await this.executeAction(
        workflow.action,
        tournamentId,
        context
      );

      execution.status = 'completed';
      execution.completedAt = new Date().toISOString();
      execution.result = result;
    } catch (error) {
      execution.status = 'failed';
      execution.completedAt = new Date().toISOString();
      execution.error = error instanceof Error ? error.message : 'Unknown error';
    }

    return execution;
  }

  /**
   * Execute an action
   */
  private async executeAction(
    action: WorkflowAction,
    tournamentId: string,
    context?: Record<string, any>
  ): Promise<any> {
    switch (action) {
      case 'open_registration':
        return this.openRegistration(tournamentId);

      case 'close_registration':
        return this.closeRegistration(tournamentId);

      case 'generate_bracket':
        return this.generateBracket(tournamentId, context);

      case 'schedule_matches':
        return this.scheduleMatches(tournamentId, context);

      case 'send_reminders':
        return this.sendReminders(tournamentId);

      case 'advance_round':
        return this.advanceRound(tournamentId);

      case 'calculate_standings':
        return this.calculateStandings(tournamentId);

      case 'notify_winners':
        return this.notifyWinners(tournamentId);

      case 'archive_tournament':
        return this.archiveTournament(tournamentId);

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  // Action implementations

  private async openRegistration(tournamentId: string): Promise<any> {
    const result = await tournamentManagement.updateTournamentStatus(
      tournamentId,
      'registration_open'
    );
    
    if (result.success) {
      broadcastTournamentStatusChange(
        tournamentId,
        'upcoming',
        'registration_open'
      );
    }

    return result;
  }

  private async closeRegistration(tournamentId: string): Promise<any> {
    const result = await tournamentManagement.updateTournamentStatus(
      tournamentId,
      'registration_closed'
    );

    if (result.success) {
      broadcastTournamentStatusChange(
        tournamentId,
        'registration_open',
        'registration_closed'
      );
    }

    return result;
  }

  private async generateBracket(
    tournamentId: string,
    context?: Record<string, any>
  ): Promise<Bracket> {
    const participants = await participantManagement.listByTournament(
      tournamentId,
      { status: 'confirmed', pageSize: 1000 }
    );

    const format = context?.format || 'single_elimination';
    
    const bracket = await bracketGeneration.generateBracket(
      tournamentId,
      format,
      participants.participants
    );

    return bracket;
  }

  private async scheduleMatches(
    tournamentId: string,
    context?: Record<string, any>
  ): Promise<any> {
    // Would get bracket matches and schedule them
    const startTime = context?.startTime || new Date();
    const endTime = context?.endTime || new Date(Date.now() + 8 * 60 * 60 * 1000);

    return matchScheduling.autoSchedule(tournamentId, [], {
      matchDurationMinutes: 30,
      breakBetweenMatchesMinutes: 10,
      maxConcurrentMatches: 4,
      startTime,
      endTime,
    });
  }

  private async sendReminders(tournamentId: string): Promise<number> {
    return matchScheduling.sendMatchReminders(tournamentId, 30);
  }

  private async advanceRound(tournamentId: string): Promise<any> {
    // Would advance to next round in bracket
    return { advanced: true };
  }

  private async calculateStandings(tournamentId: string): Promise<any> {
    // Would recalculate standings
    return { calculated: true };
  }

  private async notifyWinners(tournamentId: string): Promise<any> {
    const tournament = await tournamentManagement.getById(tournamentId);
    if (!tournament) return { notified: 0 };

    // Would get top participants and notify them
    return { notified: 3 }; // Placeholder
  }

  private async archiveTournament(tournamentId: string): Promise<any> {
    return tournamentManagement.archive(tournamentId);
  }

  // Condition checking

  private async checkConditions(
    conditions: WorkflowCondition[],
    tournamentId: string,
    context?: Record<string, any>
  ): Promise<boolean> {
    for (const condition of conditions) {
      let value: any;

      // Get the field value
      if (condition.field === 'participantCount') {
        value = await participantManagement.getCount(tournamentId);
      } else if (context && condition.field in context) {
        value = context[condition.field];
      } else {
        continue; // Skip unknown fields
      }

      // Check the condition
      const met = this.evaluateCondition(value, condition.operator, condition.value);
      if (!met) return false;
    }

    return true;
  }

  private evaluateCondition(
    actual: any,
    operator: WorkflowCondition['operator'],
    expected: any
  ): boolean {
    switch (operator) {
      case 'eq': return actual === expected;
      case 'gt': return actual > expected;
      case 'lt': return actual < expected;
      case 'gte': return actual >= expected;
      case 'lte': return actual <= expected;
      default: return false;
    }
  }

  // Management methods

  registerWorkflow(workflow: WorkflowStep): void {
    this.workflows.set(workflow.id, workflow);
  }

  getWorkflow(id: string): WorkflowStep | undefined {
    return this.workflows.get(id);
  }

  listWorkflows(): WorkflowStep[] {
    return Array.from(this.workflows.values());
  }

  enableWorkflow(id: string): boolean {
    const workflow = this.workflows.get(id);
    if (workflow) {
      workflow.enabled = true;
      return true;
    }
    return false;
  }

  disableWorkflow(id: string): boolean {
    const workflow = this.workflows.get(id);
    if (workflow) {
      workflow.enabled = false;
      return true;
    }
    return false;
  }

  getExecutionHistory(tournamentId?: string): WorkflowExecution[] {
    const executions = Array.from(this.executions.values());
    if (tournamentId) {
      return executions.filter(e => e.tournamentId === tournamentId);
    }
    return executions;
  }
}

// Export singleton
export const workflowAutomation = new WorkflowAutomationService();

// Export class for testing
export { WorkflowAutomationService };
