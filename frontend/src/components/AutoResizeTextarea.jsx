import ResizeTextarea from "react-textarea-autosize";
import { Textarea, forwardRef } from "@chakra-ui/react";

export const AutoResizeTextarea = forwardRef((props, ref) => (
  <Textarea
    maxH={700}
    minH="unset"
    overflow="auto"
    w="100%"
    resize="none"
    ref={ref}
    minRows={3}
    maxRows={16}
    as={ResizeTextarea}
    {...props}
  />
));