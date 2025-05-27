import styled from "styled-components";
import AddIcon from "../../assets/plus-icon.svg";
import SendIcon from "../../assets/send-icon.svg";

const ChatInputArea = () => {
  return (
    <ChatAreaStyled>
      <div className="chatInput_top">
        <button className="chat_btn">Pause this task</button>
        <button className="chat_btn">Mark as complete</button>
      </div>

      <InputTextStyled>
        <textarea type="text" className="text_area" />

        <div className="bottom_row">
          <div className="upload_icon_wrapper">
            <img src={AddIcon} alt="upload_icon" />
            <p>Upload File</p>
          </div>

          <div className="send_icon_bg">
            <img src={SendIcon} alt="send_icon" />
          </div>
        </div>
      </InputTextStyled>
    </ChatAreaStyled>
  );
};

const ChatAreaStyled = styled.div`
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
    height: 100%;
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

    .upload_icon_wrapper {
      display: flex;
      gap: 6px;
      cursor: pointer;
    }

    .send_icon_bg {
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba(133, 80, 255, 1);
    }
  }
`;

export default ChatInputArea;
