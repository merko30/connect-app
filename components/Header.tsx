import { Header as RNHeader } from "@react-navigation/elements";

const Header = (props: React.ComponentProps<typeof RNHeader>) => {
  return <RNHeader {...props} />;
};

export default Header;
