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

const ResetEmail = (token: string) => (
  <Html>
    <Tailwind>
      <Body className={"bg-white"}>
        <Heading>Reset hesla</Heading>
        <Text>
          Změna hesla je jednoduchá, jen klikni na odkaz níže a změň si ho.
          Pokud jsi tuto změnu nevyžádal/a, ignoruj tento e-mail.
        </Text>
        <Button href={`https://flipup.cz/reset-password/${token}`}>
          Ověřit e-mail
        </Button>
      </Body>
    </Tailwind>
  </Html>
);

export default ResetEmail;
