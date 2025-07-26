import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, RefreshCw, Settings } from "lucide-react";
import { useState } from "react";

export default function DevPage() {
	const [editMode, setEditMode] = useState(false);
	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="flex items-center justify-between mb-8 mt-16">
					<div>
						<h1 className="text-4xl font-bold text-primary">
							Development Dashboard
						</h1>
					</div>
					<div className="flex gap-4 items-center">
						<div className="flex items-center gap-2">
							<Switch
								id="edit-mode"
								checked={editMode}
								onCheckedChange={setEditMode}
							/>
							<label htmlFor="edit-mode" className="text-sm font-medium">
								{editMode ? "Edit Mode" : "View Mode"}
							</label>
						</div>
						<Button variant="outline" size="sm">
							<Plus className="w-4 h-4 mr-2" />
							Add Widget
						</Button>
						<Button variant="outline" size="sm">
							<RefreshCw className="w-4 h-4 mr-2" />
							Refresh
						</Button>
						<Button variant="outline" size="sm">
							<Settings className="w-4 h-4 mr-2" />
							Settings
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

