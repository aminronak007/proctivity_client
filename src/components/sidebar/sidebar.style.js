import styled from "styled-components";
import { palette } from "styled-theme";
const SidebarWrapper = styled.div`
    .close-drawer-icon {
        display: none;
        position: absolute;
        right: 15px;
        top: 18px;
        font-size: 20px;
        z-index: 5
        cursor: pointer;
        color: ${props => props.sidebarTheme.textColor} !important;
    }

    .sidebar-scrollbar-style {
        position: relative;
        display: block;
        width: 100%;
        cursor: pointer;
        border-radius: inherit;
        background-color: rgba(0, 0, 0, 0.2);
        height: 206px;
        transform: translateY(0px);
        background-color: ${props => props.sidebarTheme.textColor} !important;
        opacity: 0.4;
    }

    .sidelist-header-name {
        text-transform: uppercase!important;
        font-weight: 700;
        display: flex;
        width: 100%;
        padding: .5rem 1rem;
        margin: 5px 10px 0;
        color: ${props => props.sidebarTheme.textColor} !important;
        font-size: 13px;
        white-space: nowrap;
        position: relative;
        justify-content: space-between;
        align-items: center;
        span {
            opacity: 0.4;
        } 
        .new-update-tag {
            opacity: 1; 
            position: relative;
            right: 0 !important;
            text-transform: capitalize !important;
            line-height: 30px;
        }
    }

    .second-child-list-icon {
        line-height: 25px !important;
    }
    
    .sideBack{
        background: ${palette("primary", 1)};
        overflow: hidden;
        margin-bottom: 0px;
        margin-top: 0px;
        box-shadow: 0 4px 7px 0 rgba(0, 0, 0, .2);
    }

    .sidebar-wrapper{
    
        .nav-link {
            color: ${props => props.sidebarTheme.textColor} !important;
            &:hover {
                padding-left: 22px !important;
            }
        }

        .arrow-sidebar {
            color: ${props => props.sidebarTheme.textColor + "!important"}
        }
        
        .main-list {
            line-height: 24px;
            font-size: 15px;
            white-space: nowrap;
            position: relative;
            text-transform: capitalize;
            color: #fff;
            -webkit-transform: translateZ(0);
            -ms-transform: translateZ(0);
            transform: translateZ(0);
            display: block;
            height: auto;
            opacity: 1;
            transition: all .15s linear;
            p {
                span {
                    font-family: "Roboto";
                }
            }
        }
    
        .child-list {
            margin: 0;
            line-height: 24px;
            font-size: 15px;
            font-weight: 400;
            white-space: nowrap;
            position: relative;
            color: #fff;
            -webkit-transform: translateZ(0);
            -ms-transform: translateZ(0);
            transform: translateZ(0);
            display: block;
            height: auto;
            opacity: 1;
            transition: all .15s linear;
        }

        .active-arrows {
            color: ${props =>
              props.sidebarTheme.activeRouteTextColor} !important;
        }
    
        .active {
            color: ${props =>
              props.sidebarTheme.activeRouteTextColor + "!important"};
            // style1
            background: ${props => props.sidebarTheme.activeRouteBackColor};
            font-weight: 600;
        }
    }

    .sidebar-header {
        cursor: pointer;
        position: relative;
        z-index: 4;
        padding: 30px 0;
        margin: 0 20px 25px;
        border-bottom: 1px solid #ddd;
        background-color: ${props =>
          props.sidebarTheme.header && props.sidebarTheme.header};
        .simple-text {            
            text-transform: capitalize;
            white-space: nowrap;
            font-size: 1rem;
            color: rgb(255, 255, 255);
            font-weight: 400;
            line-height: 30px;
            text-decoration: none;
            overflow: hidden;
        }
        .logo-mini {
            opacity: 1;
            float: left;
            text-align: center;
            margin-left: 12px;
            margin-right: 12px;
            padding: 6px 0px 8px;
            img {
                width: 34px;
                height: 34px;
            }
        }
        .logo-text {
            display: block;
            opacity: 1;
            transform: translateZ(0px);
            padding: 9px 0px 8px;
            color: ${props => props.sidebarTheme.textColor} !important;
            font-weight: 600;
        }
    }

    .sidebar-whole-list {
        background: ${props => props.sidebarTheme.sideOpenListBackground} 
    }
`;

export default SidebarWrapper;
