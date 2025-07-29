import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface ConfirmationDialogProps {
	isOpen: boolean
	title?: string
	message: string
	confirmText?: string
	cancelText?: string
	variant?: "default" | "destructive"
	onConfirm: () => void
	onCancel: () => void
}

export function ConfirmationDialog({
	isOpen,
	title = "Confirm Action",
	message,
	confirmText = "Confirm",
	cancelText = "Cancel",
	variant = "default",
	onConfirm,
	onCancel,
}: ConfirmationDialogProps) {
	// Handle escape key
	React.useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isOpen) {
				onCancel()
			}
		}

		if (isOpen) {
			document.addEventListener("keydown", handleEscape)
			// Prevent body scroll when dialog is open
			document.body.style.overflow = "hidden"
		}

		return () => {
			document.removeEventListener("keydown", handleEscape)
			document.body.style.overflow = "unset"
		}
	}, [isOpen, onCancel])

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div 
				className="absolute inset-0 bg-background"
				onClick={onCancel}
			/>
			
			{/* Dialog */}
			<Card className="relative w-full max-w-md mx-4 p-6 shadow-lg animate-in fade-in-0 zoom-in-95 duration-200">
				{/* Close button */}
				<button
					onClick={onCancel}
					className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
				>
					<X className="h-4 w-4" />
					<span className="sr-only">Close</span>
				</button>

				{/* Content */}
				<div className="space-y-4">
					<div className="space-y-2">
						<h2 className="text-lg font-semibold leading-none tracking-tight">
							{title}
						</h2>
						<p className="text-sm text-muted-foreground leading-relaxed">
							{message}
						</p>
					</div>

					{/* Actions */}
					<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
						<Button
							type="button"
							variant="outline"
							onClick={onCancel}
							className="sm:w-auto w-full"
						>
							{cancelText}
						</Button>
						<Button
							type="button"
							variant={variant === "destructive" ? "destructive" : "default"}
							onClick={onConfirm}
							className="sm:w-auto w-full"
						>
							{confirmText}
						</Button>
					</div>
				</div>
			</Card>
		</div>
	)
}

