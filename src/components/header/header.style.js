import styled from "styled-components";

const HeaderWrapper = styled.div`
  .headerBack {
    background: #2e3a44;
    padding: 25px 30px;
    margin-left: 0px;
    @media only screen and (max-width: 991.98px) {
      margin-left: 0px !important;
    }

    .drawer-handle-arrow {
      @media only screen and (max-width: 991.98px) {
        display: none;
      }
    }

    .mini-drawer-menu-icon {
      margin: 6px 0;
      justify-content: center;
      cursor: pointer;
      display: none;
      color: ${props => props.topbarTheme.textColor};
      @media only screen and (max-width: 991.98px) {
        display: block;
      }
      i {
        font-size: 20px;
        margin-right: 10px;
        position: relative;
        top: 2px;
      }
      .app-name {
        font-weight: 600;
      }
    }

    .top-header-profile-class {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid #fff;
      background: #fff;
      margin-right: 10px;
      display: inline-block;
    }
  }
`;

export default HeaderWrapper;
