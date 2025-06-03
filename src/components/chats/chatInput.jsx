import styled from "styled-components";
import AddIcon from "../../assets/plus-icon.svg";
import SendIcon from "../../assets/send-icon.svg";
import { useEffect, useState } from "react";

const ChatInputArea = ({ handleSendChat, initialText }) => {
  const [chat_text, setChat_text] = useState("");

  useEffect(() => {
    if (initialText !== undefined) {
      setChat_text(initialText);
    }
  }, [initialText]);

  const handleTextChange = (e) => {
    const { value } = e.target;
    setChat_text(value);
  };

  const handleFileUpload = (e) => {
    const { name, files } = e.target;
    console.log(name, files);
    // handle file upload
    console.log(e, "uploading file..");
  };

  const handlePauseTask = (e) => {
    // pause task.
    e.preventDefault();
    console.log("pause task");
  };

  const markTaskComplete = (e) => {
    // mark task complete.
    e.preventDefault();
    console.log("mark task");
  };

  const sendChart = (e) => {
    e.preventDefault();
    handleSendChat(chat_text);
    setChat_text("");
  };

  return (
    <ChatAreaStyled>
      <div className="chatInput_top">
        <button className="chat_btn" onClick={(e) => handlePauseTask(e)}>
          Pause this task
        </button>
        <button className="chat_btn" onClick={(e) => markTaskComplete(e)}>
          Mark as complete
        </button>
      </div>

      <InputTextStyled>
        <textarea
          type="text"
          name="chat_text"
          value={chat_text}
          className="text_area"
          placeholder="enter text..."
          onChange={(e) => handleTextChange(e)}
        />

        <div className="bottom_row">
          <UploadStyled>
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              name={"uploadDoc"}
              id={"uploadDoc"}
              className="inputfile inputfile-1"
              onChange={handleFileUpload}
            />

            <label htmlFor={"uploadDoc"} className="upload_icon_wrapper">
              <img src={AddIcon} alt="upload_icon" />
              <p>Upload File</p>
            </label>
          </UploadStyled>

          <div
            role="button"
            className="send_icon_bg"
            onClick={sendChart}
            type="submit"
          >
            <img src={SendIcon} alt="send_icon" />
          </div>
        </div>
      </InputTextStyled>
    </ChatAreaStyled>
  );
};

const UploadStyled = styled.div`
  position: relative;

  .inputfile {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  .upload_icon_wrapper {
    display: flex;
    gap: 6px;
    cursor: pointer;

    p {
      font-size: 14px;
      font-weight: 400;
    }
  }
`;
const ChatAreaStyled = styled.form`
  .chatInput_top {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
    margin-bottom: 1rem;
  }
  .chat_btn {
    border-radius: 10px;
    padding: 16px 8px;
    font-size: 14px;
    font-wieght: 400;
    height: 30px;
    width: auto;
    background-color: rgba(244, 244, 244, 1);
    color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    cursor: pointer;
  }
`;

const InputTextStyled = styled.div`
  width: auto;
  height: 152px;
  border: 1px solid rgba(0, 0, 0, 0.18);
  border-radius: 16px;
  padding: 16px 14px;
  position: relative;

  &:focus-within {
    border: 1px solid rgba(133, 80, 255, 1);
  }

  .text_area {
    width: -webkit-fill-available;
    height: 80%;
    border: none;
    resize: none;

    &:focus {
      outline: none;
    }
  }
  .bottom_row {
    position: absolute;
    bottom: 0px;
    width: 95%;
    display: flex;
    justify-content: space-between;

    .send_icon_bg {
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba(133, 80, 255, 1);
      cursor: pointer;
    }
  }
`;

export default ChatInputArea;
