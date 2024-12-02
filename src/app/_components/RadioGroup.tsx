import {RadioGroup as HeadlessUiRadioGroup, Radio as HeadlessUiRadio, Field} from "@headlessui/react";
import {fadeTransitionClasses} from "@/app/_components/common";
import {cn} from "@/app/_lib/cn";

interface RadioProps {
	value: string
}

interface RadioGroupProps {
	items: string[]
	selected: string
	setSelected: (selected: string) => void
}

const RadioGroup = ({items, selected, setSelected}: RadioGroupProps) => {

	const Radio = ({value}: RadioProps) => (
		<div className={cn([
			"flex", "flex-row", "gap-3", "items-center",
			"hover:brightness-125",
			...fadeTransitionClasses
		])}>
			<HeadlessUiRadio
				value={value}
				className={cn([
					"group", "peer", "flex size-6", "items-center", "justify-center",
					"rounded-full", "ring-2", "ring-inset", "ring-secondary-text",
					"data-[checked]:ring-primary"
				])}>
				<span className={cn([
					"invisible", "size-3", "rounded-full", "bg-primary",
					"group-data-[checked]:visible"
				])}/>
			</HeadlessUiRadio>

			<label className={cn("text-secondary-text", "peer-data-[checked]:text-primary-text")}>{value}</label>
		</div>
	)

	const radioButtons = items.map(i => <Field key={i}> <Radio value={i}/></Field>)

	return (
		<HeadlessUiRadioGroup
			value={selected} onChange={setSelected}
			className={cn([
				"flex", "flex-col", "gap-3"
			])}>
			{radioButtons}
		</HeadlessUiRadioGroup>
	)
}

export default RadioGroup