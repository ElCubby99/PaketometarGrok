import { Brand } from "./Brand";
import { Nav } from "./Nav";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Brand />
        <Nav />
      </div>
    </header>
  );
}
