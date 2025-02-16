import {cn} from "@/lib/cn";
import {motion} from "motion/react"
import useUserPreferences from "@/hooks/useUserPreferences";

type BarHeightType = 'Default' | 'Low' | 'Half' | 'High'
const BarHeights: Record<BarHeightType, number | string> = {
  Default: '0.375rem',
  Low: '0.5rem',
  Half: '1.5rem',
  High: '2.5rems'
}

interface MusicBarProps {
  heightsList?: (number | string)[]
}
function MusicBar({heightsList}: MusicBarProps) {
  const preferences = useUserPreferences()
  const bgColor = preferences.theme.colorClasses.background
  const initialHeight = heightsList?.[0] ?? BarHeights.Default
  return (
    <motion.div
      className={cn(
        bgColor, 'w-1.5', 'rounded-xl',
      )}
      initial={{
        height: initialHeight
      }}
      animate={{
        height: heightsList,
      }}
      transition={{
        ease: "linear",
        type: "keyframes",
        duration: 0.5,
        repeat: Infinity
      }}
    />
  );
}

interface MusicBarsProps {
  isPlaying: boolean
}
export default function MusicBars({isPlaying}: MusicBarsProps) {
  const barHeights = isPlaying ? [
    [BarHeights.Low, BarHeights.High, BarHeights.Half, BarHeights.Low,],
    [BarHeights.Low, BarHeights.Half, BarHeights.Half, BarHeights.Low,],
    [BarHeights.Half, BarHeights.High, BarHeights.High, BarHeights.Half,],
    [BarHeights.Half, BarHeights.Half, BarHeights.High, BarHeights.Half,],
    [BarHeights.Low, BarHeights.Half, BarHeights.Half, BarHeights.Low,],
    [BarHeights.Low, BarHeights.Low, BarHeights.Half, BarHeights.Low,],
  ] : [...Array(6).keys()].map(() => [BarHeights.Default])
  return barHeights.map((list, index) => (
    <MusicBar key={index} heightsList={list}/>
  ))
}