import { Global } from "@emotion/react";

export const RootStyles = () => (
  <Global
    styles={`
        /* -----------Make clicks pass-through----------- */
        * {
          font-variant-ligatures: common-ligatures contextual;
          font-feature-settings: 'kern', 'liga', 'clig', 'calt';
          font-kerning: normal;
        }
        a {
          text-decoration: none;
        }
        a:hover {
          color: #00804A
        }
        #nprogress {
          pointer-events: none;
        }
        #nprogress .bar {
          background: #D9A02E;
          position: fixed;
          z-index: 199999939;  /* index to override what is set for sticky nav */
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
        }
        /* Fancy blur effect */
        #nprogress .peg {
          display: block;
          position: absolute;
          z-index: 199999939;  /* index to override what is set for sticky nav */
          right: 0px;
          width: 100px;
          height: 100%;
          box-shadow: 0 0 3px rgba(17, 28, 107, 0.5), 0 0 5px rgba(237, 147, 89, 0.3);
          opacity: 1.0;
          -webkit-transform: rotate(3deg) translate(0px, -4px);
              -ms-transform: rotate(3deg) translate(0px, -4px);
                  transform: rotate(3deg) translate(0px, -4px);
        }
        .nprogress-custom-parent {
          overflow: hidden;
          position: relative;
        }
        .nprogress-custom-parent #nprogress .spinner,
        .nprogress-custom-parent #nprogress .bar {
          position: absolute;
        }
        @-webkit-keyframes nprogress-spinner {
          0%   { -webkit-transform: rotate(0deg); }
          100% { -webkit-transform: rotate(360deg); } 
        }
        @keyframes nprogress-spinner {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
  />
);
