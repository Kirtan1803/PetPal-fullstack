import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="page-content">{children}</main>
    </>
  );
}

export default Layout;
