import * as React from "react";
import {
  Html,
  Head,
  Body,
  Heading,
  Tailwind,
  Text,
  Button,
} from "@react-email/components";

const VerificationEmail = (token: string) => (
  <Html>
    <Tailwind>
      <Body className={"bg-white"}>
        <Heading>Ověřte svůj účet na Flipupu</Heading>
        <Text>
          Vítej u nás, poslední věc, která tě dělí od toho aby ses stal
          Flipperem je ověřit svůj e-mail. Klikni na tlačítko níže.
        </Text>
        <Button href={`https://flipup.cz/verify/${token}`}>
          Ověřit e-mail
        </Button>
      </Body>
    </Tailwind>
  </Html>
);

export default VerificationEmail;
