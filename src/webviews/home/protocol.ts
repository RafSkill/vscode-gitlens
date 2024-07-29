import type { Subscription } from '../../plus/gk/account/subscription';
import type { IpcScope, WebviewState } from '../protocol';
import { IpcCommand, IpcNotification } from '../protocol';

export const scope: IpcScope = 'home';

export interface OnboardingState {
	graphVisited: boolean;
}

export interface State extends WebviewState {
	repositories: DidChangeRepositoriesParams;
	webroot?: string;
	promoStates: Record<string, boolean>;
	subscription: Subscription;
	orgSettings: {
		drafts: boolean;
	};
	onboardingState: OnboardingState;
	walkthroughCollapsed: boolean;
}

// COMMANDS

export interface CollapseSectionParams {
	section: string;
	collapsed: boolean;
}
export const CollapseSectionCommand = new IpcCommand<CollapseSectionParams>(scope, 'section/collapse');

// NOTIFICATIONS

export interface DidChangeRepositoriesParams {
	count: number;
	openCount: number;
	hasUnsafe: boolean;
	trusted: boolean;
}
export const DidChangeRepositories = new IpcNotification<DidChangeRepositoriesParams>(scope, 'repositories/didChange');

export interface DidChangeUsagesParams extends OnboardingState {}
export const DidChangeUsage = new IpcNotification<DidChangeUsagesParams>(scope, 'onboarding/usage/didChange');

export interface DidChangeSubscriptionParams {
	promoStates: Record<string, boolean>;
	subscription: Subscription;
}
export const DidChangeSubscription = new IpcNotification<DidChangeSubscriptionParams>(scope, 'subscription/didChange');

export interface DidChangeOrgSettingsParams {
	orgSettings: State['orgSettings'];
}
export const DidChangeOrgSettings = new IpcNotification<DidChangeOrgSettingsParams>(scope, 'org/settings/didChange');
