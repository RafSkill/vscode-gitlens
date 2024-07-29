import type { PropertyValues } from 'lit';
import { css, html, LitElement } from 'lit';
import { customElement, property, queryAll, queryAssignedElements } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';
import { Logger } from '../../../../system/logger';

@customElement('gl-onboarding-item')
export class GlOnboardingItem extends LitElement {
	private checkListeners: (() => void)[] = [];
	static override readonly styles = css`
		:host {
			display: flex;
			align-items: center;
			font-size: 14px;
		}
		gl-onboarding-checkbox {
			flex-shrink: 0;
			margin-right: 8px;
		}
		.actions {
			display: flex;
			align-items: center;
		}
		.description {
			display: inline-flex;
			flex: 1;
			align-items: center;
		}
		.description span {
			flex: 1;
		}
		.description.disabled {
			color: var(--disabled-color, gray);
		}
	`;

	@property({ type: Boolean })
	checked = false;

	onCheck() {
		this.checkListeners.map(x => x());
		this.checked = true;
	}

	addOnCheckListener(listener: () => void) {
		this.checkListeners.push(listener);
	}

	protected override shouldUpdate(_changedProperties: PropertyValues): boolean {
		Logger.log('test play', _changedProperties.get('onPlay'));
		return _changedProperties.has('onplay') || super.shouldUpdate(_changedProperties);
	}

	renderActions() {
		return html`
			<div class="actions">
				<slot name="actions"></slot>
			</div>
		`;
	}

	protected override render() {
		return html`
			<gl-onboarding-checkbox @check=${this.onCheck} ?checked=${this.checked}> </gl-onboarding-checkbox>
			<div
				class=${classMap({
					description: true,
					disabled: this.checked,
				})}
			>
				<span><slot></slot></span>
				${this.renderActions()}
			</div>
		`;
	}
}
