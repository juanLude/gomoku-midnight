import { User } from "./../types/User";
import { createContext } from "react";

type UserContextType = {
  user?: User;
  login: (username: string, password: string) => Promise<true | string>;
  register: (username: string, password: string) => Promise<true | string>;
  logout: () => void;
};

const UserContext = createContext<UserContextType>({} as UserContextType);
export default UserContext;
