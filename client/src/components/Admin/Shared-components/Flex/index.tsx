import styled from "@emotion/styled";

type FlexProps = {
  justifyContent?: any;
  alignItems?: any;
  flexDirection?: any;
  gap?: any;
  padding?: any;
  margin?: any;
  href?: any
};

type FlexBaseStyle = {
  display: string;
  justifyContent: any;
  alignItems: any;
  gap: any;
  flexDirection?: any;
  padding?: any;
  margin?: any;
};

const Flex = styled.div<FlexProps>(
  ({ justifyContent, alignItems, flexDirection, gap, padding, margin }) => {
    const baseStyle: FlexBaseStyle = {
      display: "flex",
      justifyContent: justifyContent,
      alignItems: alignItems,
      gap: typeof gap === "number" ? `${gap}px` : gap,
    };

    if (flexDirection) {
      baseStyle.flexDirection = flexDirection;
    }

    if (padding) {
      baseStyle.padding = padding;
    }

    if (margin) {
      baseStyle.margin = margin;
    }

    return { ...baseStyle };
  }
);

export default Flex;
