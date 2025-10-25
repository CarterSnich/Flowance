import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import "@/global.css";
import { View } from "react-native";

function TestScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Button>
        <Text>Click me</Text>
      </Button>
    </View>
  );
}

export default TestScreen;
