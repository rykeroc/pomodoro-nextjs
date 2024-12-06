import {ITheme} from "@/app/_lib/contexts/theme/IThemeContext";
import {HTMLProps} from "react";

interface IThemeButtonProps extends HTMLProps<HTMLButtonElement>{
	theme: ITheme
}

const ThemeButton = ({theme, onClick}: IThemeButtonProps) => (
	<button onClick={onClick}>
		<p>{theme.wallpaperName}</p>
	</button>
)

export default ThemeButton