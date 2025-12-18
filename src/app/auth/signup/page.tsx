import { Container } from "@chakra-ui/react";
import { SignupStack } from "~/app/_components/auth/signup";
import { NavbarComponent } from "~/components/navbar/block";

export default function SignupPage() {
  return (
    <Container>
      <SignupStack />
      <NavbarComponent/>
    </Container>
  );
}
