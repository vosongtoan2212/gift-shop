"use client";
import { fetchData } from "~/utils/fetchData";
import { API_URL } from "~/constants";
import { Category } from "~/types/category";
import { createContext, useContext, useEffect, useState } from "react";
import { getCookie } from "cookies-next";

interface GlobalContextType {
  categoryList: Category[];
  isLoggedIn: boolean | null;
  setIsLoggedIn: Function;
  userInfo: {
    email: string;
    fullname: string;
    profilePictureURL: string;
    sub: number;
  };
}

// Tạo Context
export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);

const { data: categoryList } = await fetchData(`${API_URL}/category`);

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const userInfoString = getCookie("user") as string;
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  useEffect(() => {
    const checkLogin = async () => {
      try {
        setIsLoggedIn(null);
        const res = await fetch("/api/auth/is-login");
        const data = await res.json();
        setIsLoggedIn(data.loggedIn);
      } catch (error) {
        console.error(error);
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, []);
  return (
    <GlobalContext.Provider
      value={{ categoryList, isLoggedIn, setIsLoggedIn, userInfo }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a MyContextProvider");
  }
  return context;
};
