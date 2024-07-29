import { css, CSSResultGroup, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('gl-progress-tracker')
export class ProgressTracker extends LitElement {
	static override readonly styles = css`
		:host {
			padding: initial;
			display: flex;
			align-items: center;
			gap: 12px;
		}
		span {
			flex-shrink: 0;
			font-weight: 700;
			font-size: 13px;
		}
		gl-progress-line {
			flex: 1;
		}
	`;
	protected override render() {
		return html`
			<span>3/5</span>
			<gl-progress-line value=${3 / 5} valueRate=${5}></gl-progress-line>
		`;
	}
}
