import OttoLogo from "../../assets/otto-logo.svg";
import FiltreIcon from "../../assets/filter_big.svg";
import styled from "styled-components";

const Header = ({setView, closeConnection}) => {

  const handleCloseExtension =()=> {
    window.parent.postMessage({ action: "close-extension-panel" }, "*");
    setView('float-icon');
    closeConnection()
  }
  return (
    <HeaderWrapper>
      <div>
        <img src={OttoLogo} alt="logo_icon"/>
      </div>

      <div id='close_extension' onClick={handleCloseExtension}>
        <img src={FiltreIcon} alt="filter_icon" className="filter_icon" />
      </div>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;

  .filter_icon {
    cursor: pointer;
  }
`;
export default Header;
