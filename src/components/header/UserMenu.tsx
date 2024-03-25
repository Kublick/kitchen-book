"use client";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/server/auth";
import { ChevronDownIcon } from "@radix-ui/react-icons";

interface Props {
  user: {
    username: string;
  };
}

const UserMenu = ({ user }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center">
        {user.username} <ChevronDownIcon className="ml-2 h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Mis Recetas</DropdownMenuItem>
        <DropdownMenuItem>Favoritas</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            logout();
          }}
        >
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
