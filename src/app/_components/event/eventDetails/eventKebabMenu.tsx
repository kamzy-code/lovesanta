import { Menu, Portal } from "@chakra-ui/react";
import { Button } from "~/components/ui/button";
import { KebabMenu } from "~/components/ui/kebabMenu";

interface EventKebabMenuProps {
    isCreator: boolean;
    handleLeaveEvent: () => void;
    handleDeleteEvent: () => void;
}

export function EventKebabMenu({isCreator, handleLeaveEvent, handleDeleteEvent}: EventKebabMenuProps) {
    return (
         <Menu.Root>
                      <Menu.Trigger asChild>
                        <Button variant="ghost" size="sm">
                          <KebabMenu />
                        </Button>
                      </Menu.Trigger>
                      <Portal>
                        <Menu.Positioner>
                          <Menu.Content>
                            {!isCreator && (
                              <Menu.Item value="leave-event" onClick={() => handleLeaveEvent()}>
                                Leave Event
                              </Menu.Item>
                            )}
        
                            {isCreator && (
                              <Menu.Item
                                value="delete-event"
                                onClick={() => handleDeleteEvent()}
                              >
                                Delete Event
                              </Menu.Item>
                            )}
                          </Menu.Content>
                        </Menu.Positioner>
                      </Portal>
                    </Menu.Root>
    )
}