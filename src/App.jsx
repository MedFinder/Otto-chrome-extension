import { useCallback, useEffect, useRef, useState } from "react";
import ChatContentArea from "./components/chats/chatContent";
import ChatInputArea from "./components/chats/chatInput";
import Header from "./components/header";
import styled from "styled-components";
import "./styles/index.css";
import { toast } from "sonner";
import axios from "axios";

const App = () => {
  const wsRef = useRef(null);
  const params = new URLSearchParams(window.location.search);
  const [view, setView] = useState(params.get("view"));
  const [chatQues, setChatQues] = useState([
    {
      id: "init-ai",
      from: "assistant",
      text: "Hello! How can I assist you today?",
    },
  ]);

  const connectWebSocket = useCallback(
    async (requestId) => {
      if (wsRef?.current) {
        console.log("Reusing existing WebSocket connection...");
        return; // Exit if the WebSocket is already connected
      }

      const url = `wss://callai-backend-243277014955.us-central1.run.app/ws/chat/${requestId}`;

      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log("WebSocket connected successfully and opened.");
      };

      wsRef.current.onmessage = async (event) => {
        const chunk = event.data;

        setChatQues((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];

          if (last?.from === "assistant" || last.from === undefined) {
            updated[updated.length - 1] = {
              ...last,
              text: chunk,
            };
          }

          return updated;
        });
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket disconnected");
        wsRef.current = null; // Reset the WebSocket reference
      };

      wsRef.current.onerror = (error) => {
        console.log("Retrying WebSocket connection in 5 seconds...", error);
        wsRef.current = null; // clear ref before retry
        setTimeout(() => {
          const id = localStorage.getItem("requestID");
          if (id) connectWebSocket(id);
        }, 5000);
      };
    },
    [setChatQues]
  );

  const retrieveRequestId = async (ipaddress) => {
    const default_ip = localStorage.getItem("ipAddress");

    const data = {
      device_category: "web",
      device_ip_address: ipaddress ?? default_ip,
    };
    try {
      const response = await axios.post(
        "https://callai-backend-243277014955.us-central1.run.app/api/patient-network-info",
        data
      );
      if (response.data) {
        const request_id = response.data.request_id;
        localStorage.setItem("requestID", request_id);
        localStorage.setItem("GET_REQUEST_ID", "called");
        connectWebSocket(request_id);
      } else {
        toast.error("Could not retrieve your ");
      }
    } catch (error) {
      toast.error("Could not determine your location. Using default location.");
    }
  };

  // Function to get location from IP address
  const getLocationFromIP = async () => {
    try {
      const ipGeolocationResponse = await axios.get("https://ipapi.co/json/");
      if (ipGeolocationResponse.data) {
        const ip_address = ipGeolocationResponse.data.ip;
        localStorage.setItem("ipAddress", ip_address);
        retrieveRequestId(ip_address);
      } else {
        toast.error(
          "Could not determine your location. Using default location."
        );
      }
    } catch (error) {
      console.error("Error with IP geolocation:", error);
      toast.error("Could not determine your location. Using default location.");
    }
  };

  const handleClick = () => {
    window.parent.postMessage({ action: "close-float-icon" }, "*");
    setView("sidepanel");
  };

  const handleSendChat = (text) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const userMessage = { id: Date.now() + "-user", from: "user", text };
      const aiPlaceholder = {
        id: Date.now() + "-ai",
        from: "assistant",
        text: "",
      };

      setChatQues((prev) => [...prev, userMessage, aiPlaceholder]);
      wsRef.current.send(text);
    }
  };

  useEffect(() => {
    const requestId = localStorage.getItem("requestID");
    if (requestId) {
      connectWebSocket(requestId);
    }
  }, [connectWebSocket]);

  useEffect(() => {
    const isRequestID = localStorage.getItem("GET_REQUEST_ID") === "called";
    if (!isRequestID) {
      getLocationFromIP();
    }
  }, []);

  console.log(chatQues)
  if (!view) return <FloatIconStyle onClick={handleClick} />; // default view
  return (
    <>
      {view === "float-icon" && <FloatIconStyle onClick={handleClick} />}
      {view === "panel" && (
        <SidePanelWrapper>
          <Header setView={setView} />

          <ChatAreaStyle>
            <ChatContentArea chats={chatQues} />
            <ChatInputArea handleSendChat={handleSendChat} />
          </ChatAreaStyle>
        </SidePanelWrapper>
      )}
    </>
  );
};

const FloatIconStyle = styled.button`
  width: 50px;
  height: 50px;
  background-size: cover;
  background-image: url(${chrome.runtime?.getURL("icons/otto-logo_128.png")});
  cursor: pointer;
  border: none;
`;

const SidePanelWrapper = styled.aside`
  width: 100vw;
  height: 100vh;
`;

const ChatAreaStyle = styled.div`
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 90vh;
`;
export default App;
