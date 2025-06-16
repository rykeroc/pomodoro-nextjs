const fadeTransitionClasses: string[] = [
	'transition',
	'ease-in-out',
	'duration-300'
]

const glassEffectClasses: string[] = [
	"border",
	"border-primary-container",
	"bg-gradient-to-br",
	"from-primary-container",
	"backdrop-blur",
]

interface IDialogMenuProps {
	isOpen: boolean
	onClose: () => void
}

export {
	fadeTransitionClasses,
	glassEffectClasses
}

export type {
	IDialogMenuProps
}