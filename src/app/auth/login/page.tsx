import { Container } from "@chakra-ui/react";
import { AuthenticateStack } from "~/app/_components/auth/authenticate";
import { NavbarComponent } from "~/components/navbar/block";

export default function LoginPage() {
  return (
    <Container>
      <AuthenticateStack />
    </Container>
  );
}
