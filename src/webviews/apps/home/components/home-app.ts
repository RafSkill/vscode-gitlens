import { css, CSSResultGroup, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Logger } from '../../../../system/logger';
import type { OnboardingState } from '../../../home/protocol';
import { OnboardingButtonType } from './onboarding-button';
// import { Commands } from '../../../../constants';
// import { executeCommand } from '../../../../system/command';

@customElement('gl-home-app')
export class GlHomeApp extends LitElement {
	@property({ type: Object })
	state?: OnboardingState;

	static override readonly styles = css`
		gl-progress-tracker {
			padding: 0 20px;
			--progress-color: var(--vscode-charts-blue);
			--progress-background-color: var(--progress-bar-color);
		}

		gl-onboarding-item-group {
			--group-indent: 20px;
		}
		gl-onboarding-item-group.top-onboarding-group {
			padding: 0 20px;
			--group-indent: 0px;
		}
	`;

	@property({ type: Boolean })
	private item1Checked = false;
	async playItem1() {
		// await executeCommand('test');
		await new Promise(resolve => setTimeout(resolve, 2000));
		this.item1Checked = true;
	}

	protected override render() {
		Logger.log('state', this.state);

		return html`
			<gl-progress-tracker></gl-progress-tracker>
			<gl-onboarding-item-group class="top-onboarding-group">
				<gl-onboarding-item .onPlay=${this.playItem1} ?checked=${this.state?.graphVisited}
					><span>Visit Commit Graph</span>
					<a href="command:gitlens.showGraph" slot="actions">
						<gl-onboarding-button type=${OnboardingButtonType.play}></gl-onboarding-button>
					</a>
					<gl-onboarding-button slot="actions"></gl-onboarding-button>
				</gl-onboarding-item>
				<gl-onboarding-item ?checked=${true}>item 2</gl-onboarding-item>
				<gl-onboarding-item-group>
					<gl-onboarding-item slot="top">group 11</gl-onboarding-item>
					<gl-onboarding-item>item 11</gl-onboarding-item>
					<gl-onboarding-item>item 22</gl-onboarding-item>
				</gl-onboarding-item-group>
				<gl-onboarding-item>item 111</gl-onboarding-item>
				<gl-onboarding-item>item 222</gl-onboarding-item>
			</gl-onboarding-item-group>
		`;
	}
}
