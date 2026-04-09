import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

type Props = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

function BaseView({ style, lightColor, darkColor, ...otherProps }: Props) {
  const backgroundColor = useThemeColor(
    {
      light: lightColor,
      dark: darkColor,
    },
    "background"
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

export { BaseView };
