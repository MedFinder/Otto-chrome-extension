import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import "./styles/index.css";
import { toast } from "sonner";
import axios from "axios";
import SidePanelComponent from "./SidePanel";

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

  const closeWebSocket = () => {
    if (wsRef.current) {
      console.log("❌ Closing WebSocket connection manually");
      wsRef.current.close();
      wsRef.current = null;

      // remove initial request ID
      localStorage.removeItem('requestID')
    }
  };

  const connectWebSocket = useCallback(
    async (requestId, source = "default") => {
      if (wsRef.current) {
        console.log("🔁 Reusing existing WebSocket connection...");
        return;
      }

      const url = `wss://callai-backend-243277014955.us-central1.run.app/ws/chat/${requestId}`;
      console.log(
        `🔌 Connecting WebSocket for requestId: ${requestId} [source: ${source}]`
      );

      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log("✅ WebSocket connected successfully.");
      };

      wsRef.current.onmessage = (event) => {
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
        console.log("❌ WebSocket disconnected");
        wsRef.current = null;
      };

      wsRef.current.onerror = (error) => {
        console.error("⚠️ WebSocket error. Retrying in 5s...", error);
        wsRef.current = null;
        setTimeout(() => {
          const id = localStorage.getItem("requestID");
          if (id) connectWebSocket(id, source);
        }, 5000);
      };
    },
    [setChatQues]
  );

  const retrieveRequestId = async (ipaddress) => {
    const data = {
      device_category: "web",
      device_ip_address: ipaddress,
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
        connectWebSocket(request_id, "initial");
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
      connectWebSocket(requestId, "initial");
    }
  }, [connectWebSocket]);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        closeWebSocket();
      }
    };
  }, []);

  useEffect(() => {
    const isRequestID = localStorage.getItem("GET_REQUEST_ID") === "called";
    if (!isRequestID) {
      getLocationFromIP();
    }
  }, []);

  if (!view) return <FloatIconStyle onClick={handleClick} />; // default view
  return (
    <>
      {view === "float-icon" && <FloatIconStyle onClick={handleClick} />}
      {view === "panel" && (
        <SidePanelComponent
          setView={setView}
          chatQues={chatQues}
          handleSendChat={handleSendChat}
          connectSocket={(id) => connectWebSocket(id, 'task')}
          closeWebSocket={closeWebSocket}
        />
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

export default App;
