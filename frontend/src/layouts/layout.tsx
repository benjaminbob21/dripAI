// import Footer from "@/components/Footer";
import Header from "@/components/Header";

type Props = {
  children: React.ReactNode;
  showReset: boolean;
  toggleView: () => void;
};

const Layout = ({ children, showReset, toggleView }: Props) => {
  return (
    <div className="flex flex-col h-dvh">
      <Header showReset={showReset} toggleView={toggleView} />
      <div className="container mx-auto flex-1">{children}</div>
    </div>
  );
};

export default Layout;
