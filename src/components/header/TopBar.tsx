import React from "react";
import { redirect } from "next/navigation";
import { logout, validateRequest } from "@/server/auth";
import { Button } from "../ui/button";
import UserMenu from "./UserMenu";
import Link from "next/link";

const TopBar = async () => {
  const { user } = await validateRequest();

  return (
    <div className="bg-primary text-white p-8 flex justify-around items-center">
      <Link href="/">
        <h1 className="font-nunito font-bold sm:text-3xl">
          Recetario de mi ama
        </h1>
      </Link>
      <div className="flex gap-4">
        {user ? (
          <>
            <Button variant={"secondary"}>
              <a href="/recetas/nueva">Nueva Receta</a>
            </Button>

            <UserMenu user={user} />
          </>
        ) : (
          <Button variant={"secondary"}>
            <a href="/login">Ingresar</a>
          </Button>
        )}
      </div>
    </div>
  );
};

export default TopBar;
