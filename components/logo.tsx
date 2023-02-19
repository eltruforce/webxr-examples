import { Box, createStyles, Text, useMantineColorScheme } from "@mantine/core";
import Link from "next/link";
import ETprintIcon from "./icons/etprint";

const useStyles = createStyles((theme) => ({
  span: {
    fontWeight: "bold",
    fontSize: "18px",
    display: "inline-flex",
    alignItems: "center",
    height: "30px",
    lineHeight: "20px",
    padding: "10px",
    paddingRight: "30px",

    "&:hover": {
      cursor: "pointer",
    },

    "> svg": {
      transition: "200ms ease",
    },

    "&:hover > svg": {
      transform: "rotate(20deg)",
      cursor: "pointer",
    },
  },
}));

const Logo = () => {
  const { classes, theme } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <Link
      href="/"
      scroll={false}
      style={{
        textDecoration: "none",
      }}
    >
      <Box className={classes.span}>
        <ETprintIcon />
        <Text
          color={colorScheme === "dark" ? "dark.0" : "gray.7"}
          fw="bold"
          ml={3}
          mt={5}
        >
          ElTruforce's WebXR Examples
        </Text>
      </Box>
    </Link>
  );
};

export default Logo;
