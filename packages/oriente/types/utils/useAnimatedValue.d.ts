import { SpringConfig } from 'react-spring';
interface AnimatedValueProps {
    config?: SpringConfig;
}
declare const useAnimatedValue: (to: any, { config }?: AnimatedValueProps) => any[];
export default useAnimatedValue;
