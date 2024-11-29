import {RadioGroup as HeadlessUiRadioGroup, Radio as HeadlessUiRadio, Field} from "@headlessui/react";
import clsx from "clsx";
import {fadeTransitionClasses} from "@/app/_components/common";

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
		<div className={clsx(
			'flex flex-row gap-3 items-center',
			"hover:brightness-125",
			fadeTransitionClasses
		)}>
			<HeadlessUiRadio
				value={value}
				className={clsx("group flex size-6 items-center justify-center",
					"rounded-full ring-2 ring-inset ring-secondary-text",
					"data-[checked]:ring-primary")}
			>
				<span className={clsx(
					"invisible size-3 rounded-full bg-primary",
					"group-data-[checked]:visible"
				)}/>
			</HeadlessUiRadio>

			<label className={clsx({"text-secondary-text": selected !== value})}>{value}</label>
		</div>
	)


	return <HeadlessUiRadioGroup value={selected} onChange={setSelected} className={clsx(
		'flex flex-col gap-3'
	)}>
		{
			items.map(i => <Field key={i}>	<Radio value={i}/></Field>)
		}
	</HeadlessUiRadioGroup>
}

export default RadioGroup