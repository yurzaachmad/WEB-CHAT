"use client";

import { Login } from "../Login";
import { UserList } from "../User/UserList";
import { ChatForm } from "./ChatForm";
import { ChatList } from "./ChatList";
import styles from "./chat.module.css";
import { io } from "socket.io-client";
import {
  loadChatAsync,
  selectReceiver,
  useDispatch,
  useSelector,
} from "@/lib/redux";
import { createContext, useEffect } from "react";

const socket = io("http://localhost:3001", {
  // path: "/api/socketio",
});

export const SocketContext = createContext(socket);

export const Chat = () => {
  const token = localStorage.getItem("user");

  const receiver = useSelector(selectReceiver);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const dispatch = useDispatch();

  useEffect((): any => {
    // connect to socket server

    // log socket connection
    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id);
    });

    // update chat on new message dispatched
    socket.on("invite", (room: string, receiver: string) => {
      if (receiver == user.username) socket.emit("join", room, "");
    });

    socket.on("messageReceived", (sender: string, receiver: string) => {
      if (user.username === receiver)
        dispatch(loadChatAsync({ sender, receiver: user.username }));
    });
    // socket disconnet onUnmount if exists
    //if (socket) return () => socket.disconnect();
  }, [user, receiver]);

  if (user?.username) {
    return (
      <SocketContext.Provider value={socket}>
        <div
          className="w-full h-32"
          style={{ backgroundColor: "#449388" }}
        ></div>

        <div className="container mx-auto" style={{ marginTop: -128 }}>
          <div className="py-6 h-screen">
            <div className="flex border border-grey rounded shadow-lg h-full">
              <div className="w-1/3 border flex flex-col">
                <div className="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
                  <div>
                    <img
                      className="w-10 h-10 rounded-full"
                      src="bussines-man.png"
                    />
                  </div>
                  <p>{user.username}</p>
                  <div className="flex">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path
                          fill="#727A7E"
                          d="M12 20.664a9.163 9.163 0 0 1-6.521-2.702.977.977 0 0 1 1.381-1.381 7.269 7.269 0 0 0 10.024.244.977.977 0 0 1 1.313 1.445A9.192 9.192 0 0 1 12 20.664zm7.965-6.112a.977.977 0 0 1-.944-1.229 7.26 7.26 0 0 0-4.8-8.804.977.977 0 0 1 .594-1.86 9.212 9.212 0 0 1 6.092 11.169.976.976 0 0 1-.942.724zm-16.025-.39a.977.977 0 0 1-.953-.769 9.21 9.21 0 0 1 6.626-10.86.975.975 0 1 1 .52 1.882l-.015.004a7.259 7.259 0 0 0-5.223 8.558.978.978 0 0 1-.955 1.185z"
                        ></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path
                          opacity=".55"
                          fill="#263238"
                          d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z"
                        ></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path
                          fill="#263238"
                          fillOpacity=".6"
                          d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="py-2 px-2 bg-grey-lightest">
                  <input
                    type="text"
                    className="w-full px-2 py-2 text-sm"
                    placeholder="Search or start new chat"
                  />
                </div>
                <UserList />
              </div>
              <div className="w-2/3 border flex flex-col">
                <div className="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
                  <div className="flex items-center">
                    <div>
                      <img
                        className="w-10 h-10 rounded-full"
                        src="bussines-man.png"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="text-grey-darkest">{receiver}</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path
                          fill="#263238"
                          fillOpacity=".5"
                          d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z"
                        ></path>
                      </svg>
                    </div>
                    <div className="ml-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path
                          fill="#263238"
                          fillOpacity=".5"
                          d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.572.572 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z"
                        ></path>
                      </svg>
                    </div>
                    <div className="ml-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path
                          fill="#263238"
                          fillOpacity=".6"
                          d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div
                  className="flex-1 overflow-auto"
                  style={{ backgroundColor: "#dad3cc" }}
                >
                  <div className="py-2 px-3">
                    <div className="flex justify-center mb-2">
                      <div
                        className="rounded py-2 px-4"
                        style={{ backgroundColor: "#ddecf2" }}
                      >
                        <p className="text-sm uppercase">February 20, 2018</p>
                      </div>
                    </div>

                    <div className="flex justify-center mb-4">
                      <div
                        className="rounded py-2 px-4"
                        style={{ backgroundColor: "#fcf4cb" }}
                      >
                        <p className="text-xs">
                          Messages to this chat and calls are now secured with
                          end-to-end encryption. Tap for more info.
                        </p>
                      </div>
                    </div>
                    <ChatList />
                  </div>
                </div>
                <ChatForm />
              </div>
            </div>
          </div>
        </div>
      </SocketContext.Provider>
    );
  } else {
    return <Login />;
  }
};
