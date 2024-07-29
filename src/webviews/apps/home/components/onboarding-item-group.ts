import { css, html, LitElement } from 'lit';
import { customElement, queryAssignedElements, queryAssignedNodes } from 'lit/decorators.js';
import { Logger } from '../../../../system/logger';
import type { GlOnboardingItem } from './onboarding-item';

@customElement('gl-onboarding-item-group')
export class GlOnboardingItemGroup extends LitElement {
	static override readonly styles = css`
		:host,
		.wrapper {
			display: flex;
			flex-direction: column;
			gap: 4px;
		}
		.wrapper {
			--indent: var(--group-indent, 10px);
			margin-left: var(--indent);
			width: calc(100% - var(--indent));
		}
	`;

	@queryAssignedNodes({ slot: 'top' })
	topItem!: Array<GlOnboardingItem>;

	@queryAssignedElements()
	childItems!: Array<GlOnboardingItem>;

	async subscribeListeners() {
		await this.updateComplete;
		this.topItem.forEach(topItem => {
			topItem.addOnCheckListener(() => {
				this.childItems.forEach(childItem => {
					childItem.onCheck();
				});
			});
		});
	}
	test() {
		debugger;
	}

	protected override render() {
		void this.subscribeListeners();
		return html`
			<slot name="top" @check=${this.test}></slot>
			<div class="wrapper">
				<slot></slot>
			</div>
		`;
	}
}
