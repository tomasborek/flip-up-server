import * as React from "react";
import {Html, Head, Body, Heading, Tailwind} from "@react-email/components";

const TestMail = () => {
    return (
        <Html>
            <Tailwind>
                <Body className={"bg-white "}>
                    <Heading>Hi</Heading>
                </Body>
            </Tailwind>
        </Html>
    );
}

export default TestMail;