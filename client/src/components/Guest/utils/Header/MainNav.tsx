import { FC } from "react";
import { useSelector } from "react-redux";
import Logo from "components/Guest/shared/Logo/Logo";
import MenuBar from "components/Guest/shared/MenuBar/MenuBar";
import Navigation from "components/Guest/shared/Navigation/Navigation";
import AvatarDropdown from "./AvatarDropdown";
import SearchDropdown from "../../shared/Header/SearchDropdown";
import ButtonPrimary from "components/Guest/shared/Button/ButtonPrimary";
import CartDropdown from "./CartDropdown";
import { RootState } from "store";

export interface MainNavProps {
  className?: string;
}

const MainNav: FC<MainNavProps> = ({ className = "" }) => {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  return (
    <div className="nc-MainNav2Logged relative z-10 bg-white dark:bg-slate-900 ">
      <div className="container">
        <div className="h-20 flex justify-between">
          <div className="flex items-center md:hidden flex-1">
            <MenuBar />
          </div>
          <div className="flex items-center space-x-3 sm:space-x-8">
            <Logo />
            <div className="hidden md:block">
              <Navigation />
            </div>
          </div>
          <div className="flex-1 flex items-center justify-end ">
            <div className="mr-2">
              <SearchDropdown />
            </div>
            {(currentUser && currentUser.role === undefined) ?
              <>
                <AvatarDropdown />
                <CartDropdown />
              </>
              :
              <div className="flex-shrink-0 flex items-center justify-end text-neutral-700 dark:text-neutral-100 space-x-1">
                <div className="items-center xl:flex space-x-1">
                  <ButtonPrimary href="/login">Sign in</ButtonPrimary>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav;
