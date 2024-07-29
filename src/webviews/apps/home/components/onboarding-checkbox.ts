import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { Logger } from '../../../../system/logger';

@customElement('gl-onboarding-checkbox')
export class GlOnboardingCheckbox extends LitElement {
	static override readonly styles = css`
		:host {
			align-items: center;
			width: 12px;
			height: 12px;
		}
	`;

	@property({ type: Boolean })
	checked = false;

	onClick() {
		if (this.checked) {
			return;
		}
		const event = new CustomEvent('check', {
			bubbles: true,
		});
		this.dispatchEvent(event);
	}

	renderCheckedIcon() {
		return html`
			<style>
				code-icon {
					color: green;
					font-weight: 900;
					display: inline;
				}
			</style>
			<code-icon icon="check"></code-icon>
		`;
	}
	renderUnCheckedIcon() {
		return html`
			<style>
				i {
					display: inline-block;
					width: 100%;
					aspect-ratio: 1 / 1;
					border-radius: 50%;
					border: 1px solid;
					cursor: pointer;
					transition: all 0.1s;
				}
				i:hover {
					background: gray;
				}
				i:active {
					background: none;
					border: none;
				}
			</style>
			<i @click=${this.onClick}></i>
		`;
	}

	protected override render() {
		Logger.log('checked', this.checked);
		return html`
			${when(Boolean(this.checked), this.renderCheckedIcon.bind(this), this.renderUnCheckedIcon.bind(this))}
		`;
	}
}
