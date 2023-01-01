import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuPopover,
  useMenuButtonContext,
} from "@reach/menu-button";
import { useEffect } from "react";
import {
  EllipsisHorizontalIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/20/solid";

const MusiqMenuItems = ({
  className,
  inLibrary,
  onAdd = () => ({}),
  onDelete = () => ({}),
}: {
  className: string;
  inLibrary: boolean;
  onAdd?: () => void;
  onDelete?: () => void;
}) => {
  const context = useMenuButtonContext();

  useEffect(() => {
    const mainWrapper = document.querySelector<HTMLElement>("#mainWrapper");

    if (context.isExpanded && mainWrapper) {
      mainWrapper.classList.add("overflow-hidden");
      mainWrapper.classList.add("-z-[1]");
    }

    if (!context.isExpanded && mainWrapper) {
      mainWrapper.classList.remove("overflow-hidden");
      mainWrapper.classList.remove("-z-[1]");
    }
  }, [context.isExpanded]);

  return (
    <>
      <MenuButton className={className}>
        <span className="sr-only">Actions</span>
        <EllipsisHorizontalIcon className="h-5 w-5" />
      </MenuButton>
      <MenuPopover className="z-10">
        <MenuItems>
          {!inLibrary && (
            <MenuItem onSelect={onAdd} className="flex items-center">
              <span className="mr-2 flex-1">Add to Library</span>
              <PlusIcon className="h-5 w-5 self-end" />
            </MenuItem>
          )}
          {inLibrary && (
            <MenuItem onSelect={onDelete} className="flex items-center">
              <span className="mr-2 flex-1">Delete from Library</span>
              <MinusIcon className="h-5 w-5 self-end" />
            </MenuItem>
          )}
        </MenuItems>
      </MenuPopover>
    </>
  );
};

export const MusiqMenuButton = ({
  className,
  inLibrary,
  onAdd,
}: {
  className: string;
  inLibrary: boolean;
  onAdd: () => void;
}) => {
  return (
    <Menu>
      <MusiqMenuItems
        className={className}
        inLibrary={inLibrary}
        onAdd={onAdd}
      />
    </Menu>
  );
};
