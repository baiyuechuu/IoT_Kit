import { Settings, Copy, Trash2 } from "lucide-react";

export default function Control({
	onSettings,
	onDuplicate,
	onDelete,
}: {
	onSettings?: () => void;
	onDuplicate?: () => void;
	onDelete?: () => void;
}) {
	return (
		<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-999">
			<button
				className="p-1 hover:bg-background/80 rounded"
				onClick={onSettings}
				title="Settings"
			>
				<Settings className="w-3 h-3 text-muted-foreground hover:text-foreground" />
			</button>
			<button
				className="p-1 hover:bg-background/80 rounded"
				onClick={onDuplicate}
				title="Duplicate"
			>
				<Copy className="w-3 h-3 text-muted-foreground hover:text-foreground" />
			</button>
			<button
				className="p-1 hover:bg-background/80 rounded"
				onClick={onDelete}
				title="Delete"
			>
				<Trash2 className="w-3 h-3 text-destructive hover:text-destructive/80" />
			</button>
		</div>
	);
}
