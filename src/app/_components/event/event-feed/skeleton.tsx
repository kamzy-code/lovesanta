import {
  Badge,
  Container,
  Flex,
  Heading,
  HStack,
  Skeleton,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";

export const EventFeedSkeleton = () => {
  return (
    <Container py={{ base: "12", md: "24" }}>
      <Stack gap="6">
        <HStack
          justify={"space-between"}
          flexDirection={{ base: "column", sm: "row" }}
          gap={{ base: "4", sm: "0" }}
          alignItems={{ base: "start", sm: "center" }}
        >
          <Skeleton width={{ base: "100%", sm: "auto" }}>
            <Heading size={{ base: "xl", md: "2xl" }} mb="8" mt="4">
              Welcome back, User!
            </Heading>
          </Skeleton>
          <Skeleton
            width={{ base: "100%", sm: "150px" }}
            height="40px"
            borderRadius="md"
          />
        </HStack>

        {[1, 2, 3].map((index) => (
          <Flex
            
            key={index}
            borderWidth="1px"
            boxShadow={"md"}
            borderRadius="l3"
            borderColor={{
              base: "fg.subtle",
              _dark: "gray.700",
            }}
            bg="bg"
            flexDirection={{ base: "column", sm: "row" }}
          >
            <Stack p={{ base: "4", sm: "6" }} flex="1" gap="4">
              <HStack
                flexDirection={{ base: "column", sm: "row" }}
                gap={{ base: "2", sm: "0" }}
              >
                <Skeleton
                  width={{ base: "100%", sm: "80px" }}
                  height="24px"
                  borderRadius="md"
                />
                <Skeleton
                  height="20px"
                  flex={{ base: "0", sm: "1" }}
                  width={{ base: "100%", sm: "auto" }}
                  borderRadius="md"
                />
              </HStack>

              <HStack
                fontWeight="medium"
                mt="4"
                flexDirection={{ base: "column", sm: "row" }}
                gap={{ base: "4", sm: "0" }}
                alignItems={{ base: "start", sm: "center" }}
              >
                <Skeleton
                  height="16px"
                  width={{ base: "100%", sm: "120px" }}
                  borderRadius="md"
                />
                <div
                  style={{ flex: 1, display: "none" }}
                  className="hidden sm:block"
                />

                <HStack
                  gap="4"
                  width={{ base: "100%", sm: "auto" }}
                  justifyContent={{ base: "space-between", sm: "flex-end" }}
                >
                  <Skeleton
                    height="16px"
                    width={{ base: "50%", sm: "180px" }}
                    borderRadius="md"
                  />
                  <Skeleton
                    height="16px"
                    width={{ base: "45%", sm: "100px" }}
                    borderRadius="md"
                  />
                </HStack>
              </HStack>
            </Stack>

            <VStack
              px={{ base: "4", sm: "4" }}
              py={{ base: "4", sm: "0" }}
              justify="center"
              flexShrink="0"
              color="fg"
              width={{ base: "100%", sm: "auto" }}
              borderTop={{ base: "1px solid", sm: "none" }}
              borderColor={{ base: "fg.subtle", sm: "transparent" }}
            >
              <LuChevronRight />
            </VStack>
          </Flex>
        ))}
      </Stack>
    </Container>
  );
};
