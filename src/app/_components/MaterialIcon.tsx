import clsx from "clsx";
import {ReactNode} from "react";

type MaterialIconProps = {
	children: ReactNode,
	className?: string
}

const MaterialIcon = ({children, className}: Readonly<MaterialIconProps>) =>
	<span className={clsx('material-symbols-outlined', className)}>
		{children}
	</span>


export default MaterialIcon