"use client";
import { fetchData } from "~/utils/fetchData";
import { API_URL } from "~/constants";
import { Category } from "~/types/category";
import { createContext, useContext, useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { User } from "~/types/user";

interface GlobalContextType {
  categoryList: Category[];
  isLoggedIn: boolean | null;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>;
  userInfo: User;
}

// Tạo Context
export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const userInfoString = getCookie("user") as string;
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { res, data } = await fetchData(`${API_URL}/category`);
        if (res?.ok) {
          setCategoryList(data);
        }
      } catch (error) {
        console.error(error);
        setIsLoggedIn(false);
      }
    };

    fetchCategories();
  }, []);

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
