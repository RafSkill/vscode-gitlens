import type { PropertyValues } from 'lit';
import { css, html, LitElement } from 'lit';
import { customElement, property, queryAll, queryAssignedElements } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';
import { Logger } from '../../../../system/logger';
import { GlButton } from '../../shared/components/button';

export enum OnboardingButtonType {
	play = 'play',
	info = 'info',
}

@customElement('gl-onboarding-button')
export class GlOnboardingButton extends GlButton {
	@property({ type: String })
	type = OnboardingButtonType.info;
	static override readonly styles = [
		css`
			gl-button {
				--button-padding: 2px;
			}
			code-icon {
				font-size: 20px;
				font-weight: 500;
			}
		`,
	];

	getIconType() {
		switch (this.type) {
			case OnboardingButtonType.info:
				return 'info';
			case OnboardingButtonType.play:
				return 'play-circle';
			default:
				throw new Error('unknown button type');
		}
	}

	protected override render() {
		return html`
			<gl-button appearance="toolbar" ><code-icon icon=${this.getIconType()} @click=${this.onclick}></gl-button>
		`;
	}
}
