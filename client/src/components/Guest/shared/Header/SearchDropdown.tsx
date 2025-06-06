import { Popover, Transition } from "@headlessui/react";
import Input from "components/Guest/shared/Input/Input";
import React, { Fragment } from "react";

const SearchDropdown = () => {
  const inputRef = React.createRef<HTMLInputElement>();
  const [search, setSearch] = React.useState("");

  const SearchProduct = () => {
    if (search !== "") {
      window.location.href = `/search?q=${search}`
    }
  }

  return (
    <React.Fragment>
      <Popover className="relative">
        {({ open }) => {
          if (open) {
            setTimeout(() => {
              inputRef.current?.focus();
            }, 100);
          }

          return (
            <>
              <Popover.Button className="text-2xl md:text-[28px] w-12 h-12 rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none flex items-center justify-center">
                <i className="las la-search"></i>
              </Popover.Button>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel
                  static
                  className="absolute right-0 z-10 w-screen max-w-[250px] mt-3"
                >
                  <Input
                    ref={inputRef}
                    type="search"
                    value={search}
                    onChange={(event: any) => setSearch(event.target.value)}
                    onKeyDown={(event: any) => {
                      if (event.keyCode === 13) {
                        SearchProduct();
                      }
                    }}
                    placeholder="Type and press enter"
                  />
                </Popover.Panel>
              </Transition>
            </>
          );
        }}
      </Popover>
    </React.Fragment>
  );
};

export default SearchDropdown;
