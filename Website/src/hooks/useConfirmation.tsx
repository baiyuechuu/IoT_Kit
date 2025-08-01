import { createContext, useContext, useState, type ReactNode } from "react"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"

interface ConfirmationOptions {
	title?: string
	message: string
	confirmText?: string
	cancelText?: string
	variant?: "default" | "destructive"
}

interface ConfirmationContextType {
	confirm: (options: ConfirmationOptions) => Promise<boolean>
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined)

interface DialogState {
	isOpen: boolean
	options: ConfirmationOptions
	resolve?: (value: boolean) => void
}

interface ConfirmationProviderProps {
	children: ReactNode
}

export function ConfirmationProvider({ children }: ConfirmationProviderProps) {
	const [dialogState, setDialogState] = useState<DialogState>({
		isOpen: false,
		options: { message: "" }
	})

	const confirm = (options: ConfirmationOptions): Promise<boolean> => {
		return new Promise((resolve) => {
			setDialogState({
				isOpen: true,
				options,
				resolve
			})
		})
	}

	const handleConfirm = () => {
		if (dialogState.resolve) {
			dialogState.resolve(true)
		}
		setDialogState({
			isOpen: false,
			options: { message: "" }
		})
	}

	const handleCancel = () => {
		if (dialogState.resolve) {
			dialogState.resolve(false)
		}
		setDialogState({
			isOpen: false,
			options: { message: "" }
		})
	}

	return (
		<ConfirmationContext.Provider value={{ confirm }}>
			{children}
			<ConfirmationDialog
				isOpen={dialogState.isOpen}
				title={dialogState.options.title}
				message={dialogState.options.message}
				confirmText={dialogState.options.confirmText}
				cancelText={dialogState.options.cancelText}
				variant={dialogState.options.variant}
				onConfirm={handleConfirm}
				onCancel={handleCancel}
			/>
		</ConfirmationContext.Provider>
	)
}

export function useConfirmation() {
	const context = useContext(ConfirmationContext)
	if (context === undefined) {
		throw new Error("useConfirmation must be used within a ConfirmationProvider")
	}
	return context
}

