import type { TreeViewVisibilityChangeEvent } from 'vscode';
import { Disposable, ThemeIcon, TreeItem, TreeItemCollapsibleState, Uri } from 'vscode';
import type { LaunchpadViewConfig } from '../config';
import { Commands, previewBadge } from '../constants';
import type { Container } from '../container';
import { AuthenticationRequiredError } from '../errors';
import { unknownGitUri } from '../git/gitUri';
import type { FocusCommandArgs } from '../plus/focus/focus';
import type { FocusGroup, FocusItem } from '../plus/focus/focusProvider';
import { focusGroupIconMap, focusGroupLabelMap, groupAndSortFocusItems } from '../plus/focus/focusProvider';
import { createCommand } from '../system/command';
import { CacheableChildrenViewNode } from './nodes/abstract/cacheableChildrenViewNode';
import { ViewNode } from './nodes/abstract/viewNode';
import { GroupingNode } from './nodes/groupingNode';
import { PullRequestNode } from './nodes/pullRequestNode';
import { ViewBase } from './viewBase';
import { registerViewCommand } from './viewCommands';

export class LaunchpadItemNode extends ViewNode<'launchpad-item', LaunchpadView> {
	constructor(
		view: LaunchpadView,
		protected override readonly parent: ViewNode,
		private readonly group: FocusGroup,
		private readonly item: FocusItem,
	) {
		super('launchpad-item', unknownGitUri, view, parent);

		// this.updateContext({ pullRequest: pullRequest });
		// this._uniqueId = getViewNodeId(this.type, this.context);
	}

	getChildren(): Promise<ViewNode[]> | ViewNode[] {
		if (this.item.openRepository == null) return [];

		return new PullRequestNode(
			this.view,
			this,
			this.item.underlyingPullRequest,
			this.item.openRepository.repo.path,
		).getChildren();
	}

	getTreeItem(): TreeItem {
		const lpi = this.item;

		const item = new TreeItem(
			lpi.title.length > 60 ? `${lpi.title.substring(0, 60)}...` : lpi.title,
			this.item.openRepository != null ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None,
		);
		item.contextValue = 'launchpad-item';
		item.description = `\u00a0 ${lpi.repository.owner.login}/${lpi.repository.name}#${lpi.id} \u00a0 ${
			lpi.codeSuggestionsCount > 0 ? ` $(gitlens-code-suggestion) ${lpi.codeSuggestionsCount}` : ''
		}`;
		item.iconPath = lpi.author?.avatarUrl != null ? Uri.parse(lpi.author.avatarUrl) : undefined;
		item.command = createCommand<[Omit<FocusCommandArgs, 'command'>]>(Commands.ShowLaunchpad, 'Open in Launchpad', {
			source: 'launchpad-view',
			state: {
				item: { ...this.item, group: this.group },
			},
		} satisfies Omit<FocusCommandArgs, 'command'>);
		return item;
	}
}

export class LaunchpadViewNode extends CacheableChildrenViewNode<
	'launchpad',
	LaunchpadView,
	GroupingNode | LaunchpadItemNode
> {
	constructor(view: LaunchpadView) {
		super('launchpad', unknownGitUri, view);
	}

	async getChildren(): Promise<(GroupingNode | LaunchpadItemNode)[]> {
		if (this.children == null) {
			const children: (GroupingNode | LaunchpadItemNode)[] = [];

			try {
				const result = await this.view.container.focus.getCategorizedItems();
				if (result.items == null) return [];

				const uiGroups = groupAndSortFocusItems(result.items);
				for (const [ui, groupItems] of uiGroups) {
					if (!groupItems.length) continue;

					const icon = focusGroupIconMap.get(ui)!;

					children.push(
						new GroupingNode(
							this.view,
							focusGroupLabelMap.get(ui)!,
							groupItems.map(i => new LaunchpadItemNode(this.view, this, ui, i)),
							TreeItemCollapsibleState.Collapsed,
							undefined,
							undefined,
							new ThemeIcon(icon.substring(2, icon.length - 1)),
						),
					);
				}
			} catch (ex) {
				if (!(ex instanceof AuthenticationRequiredError)) throw ex;
			}

			this.children = children;
		}

		return this.children;
	}

	getTreeItem(): TreeItem {
		const item = new TreeItem('Launchpad', TreeItemCollapsibleState.Expanded);
		return item;
	}
}

export class LaunchpadView extends ViewBase<'launchpad', LaunchpadViewNode, LaunchpadViewConfig> {
	protected readonly configKey = 'launchpad';
	private _disposable: Disposable | undefined;

	constructor(container: Container) {
		super(container, 'launchpad', 'Launchpad', 'launchpadView');

		this.description = previewBadge;
	}

	override dispose() {
		this._disposable?.dispose();
		super.dispose();
	}

	protected getRoot() {
		return new LaunchpadViewNode(this);
	}

	protected override onVisibilityChanged(e: TreeViewVisibilityChangeEvent): void {
		if (this._disposable == null) {
			this._disposable = Disposable.from(this.container.subscription.onDidChange(() => this.refresh(true), this));
		}

		super.onVisibilityChanged(e);
	}

	// override async show(options?: { preserveFocus?: boolean | undefined }): Promise<void> {
	// 	if (!(await ensurePlusFeaturesEnabled())) return;

	// 	return super.show(options);
	// }

	override get canReveal(): boolean {
		return false;
	}

	protected registerCommands(): Disposable[] {
		void this.container.viewCommands;

		return [
			// registerViewCommand(
			// 	this.getQualifiedCommand('info'),
			// 	() =>
			// 		executeCommand<OpenWalkthroughCommandArgs>(Commands.OpenWalkthrough, {
			// 			step: 'code-collab',
			// 			source: 'cloud-patches',
			// 			detail: 'info',
			// 		}),
			// 	this,
			// ),
			// registerViewCommand(
			// 	this.getQualifiedCommand('copy'),
			// 	() => executeCommand(Commands.ViewsCopy, this.activeSelection, this.selection),
			// 	this,
			// ),
			registerViewCommand(this.getQualifiedCommand('refresh'), () => this.refresh(true), this),
			// registerViewCommand(
			// 	this.getQualifiedCommand('create'),
			// 	async () => {
			// 		await executeCommand(Commands.CreateCloudPatch);
			// 		void this.ensureRoot().triggerChange(true);
			// 	},
			// 	this,
			// ),
			// registerViewCommand(
			// 	this.getQualifiedCommand('delete'),
			// 	async (node: DraftNode) => {
			// 		const confirm = { title: 'Delete' };
			// 		const cancel = { title: 'Cancel', isCloseAffordance: true };
			// 		const result = await window.showInformationMessage(
			// 			`Are you sure you want to delete Cloud Patch '${node.draft.title}'?`,
			// 			{ modal: true },
			// 			confirm,
			// 			cancel,
			// 		);

			// 		if (result === confirm) {
			// 			await this.container.launchpad.deleteDraft(node.draft.id);
			// 			void node.getParent()?.triggerChange(true);
			// 		}
			// 	},
			// 	this,
			// ),
			// registerViewCommand(this.getQualifiedCommand('setShowAvatarsOn'), () => this.setShowAvatars(true), this),
			// registerViewCommand(this.getQualifiedCommand('setShowAvatarsOff'), () => this.setShowAvatars(false), this),
		];
	}

	// private setShowAvatars(enabled: boolean) {
	// 	return configuration.updateEffective(`views.${this.configKey}.avatars` as const, enabled);
	// }
}
