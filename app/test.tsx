import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import "@/global.css";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

function TestScreen() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <View className="flex-1 items-center justify-center dark:bg-zinc-900">
      <Button onPress={() => router.back()}>
        <Text>Go back</Text>
      </Button>
      <Button onPress={() => setIsOpen(true)}>
        <Text>Open dialog</Text>
      </Button>

      <Dialog open={isOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onPress={() => setIsOpen(false)}>
              <Text>Close</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  );
}

export default TestScreen;
