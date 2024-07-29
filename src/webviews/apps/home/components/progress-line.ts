import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('gl-progress-line')
export class GlProgressLine extends LitElement {
	@property({ type: Number })
	value: number = 0;

	/**
	 * provides a value that defines the count of possible states of the progress line
	 */
	@property({ type: Number })
	valueRate: number = 20;

	static override readonly styles = css`
		.progress-container {
			display: block;
			height: 7px;
			width: 100%;
			border-radius: 4px;
			background-color: var(--progress-background-color, gray);
			position: relative;
			overflow: hidden;
		}

		.progress-container > .progress-line {
			display: block;
			position: absolute;
			background: var(--progress-color, currentColor);
			height: 100%;
			border-radius: 4px;
			left: 0;
		}
	`;

	get limitedProgress() {
		if (this.value < 0) {
			return 0;
		}
		if (this.value > 1) {
			return 1;
		}
		return Math.round(this.value * this.valueRate) / this.valueRate;
	}

	protected override render() {
		return html`
			<div class="progress-container">
				<style>
					.progress-container > .progress-line {
						/* Warning: this approach has limitations & performance issues! */
						width: ${this.limitedProgress * 100}%;
					}
				</style>
				<div class="progress-line"></div>
			</div>
		`;
	}
}
