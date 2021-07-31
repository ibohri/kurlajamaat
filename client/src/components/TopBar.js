import { Container, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useProvideAuth";
import { FiLogOut } from "react-icons/fi";

export function TopBar() {
  const auth = useAuth();
  const logout = () => {
    auth.signout();
  };
  return (
    !auth.loading && (
      <Navbar
        className="justify-content-end"
        bg="dark"
        variant="dark"
        expand="lg"
      >
        <Container fluid>
          <Navbar.Brand href="/">Kurla Jamaat</Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              {auth.user && auth.user.role === "Admin" && (
                <>
                  <Nav.Link as={Link} to="/settings">
                    Settings
                  </Nav.Link>
                  <Nav.Link as={Link} to="/users">
                    Users
                  </Nav.Link>
                </>
              )}
              <Nav.Link onClick={logout} as="span">
                <FiLogOut />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  );
}
