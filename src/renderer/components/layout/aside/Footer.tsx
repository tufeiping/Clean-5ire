import { useState, useCallback, useEffect } from 'react';
import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@fluentui/react-components';
import Mousetrap from 'mousetrap';
import {
  QuestionCircle20Regular,
  ArrowRight16Regular,
  ArrowLeft16Regular,
  Alert20Regular,
} from '@fluentui/react-icons';
import { useTranslation } from 'react-i18next';
import useAppearanceStore from 'stores/useAppearanceStore';
import AlertDialog from 'renderer/components/AlertDialog';

export default function Footer({ collapsed }: { collapsed: boolean }) {
  const [showAbout, setShowAbout] = useState(false);

  const toggleSidebarCollapsed = useAppearanceStore(
    (state) => state.toggleSidebarCollapsed,
  );
  const { t } = useTranslation();
  const goTwitter = useCallback(() => {
    window.electron.openExternal('https://x.com/dreamOfTu');
    window.electron.ingestEvent([{ app: 'go-twitter' }]);
  }, []);

  const goHome = useCallback(() => {
    window.electron.openExternal('https://5ire.app');
    window.electron.ingestEvent([{ app: 'go-homepage' }]);
  }, []);

  const goDocs = useCallback(() => {
    window.electron.openExternal('https://5ire.app/docs');
    window.electron.ingestEvent([{ app: 'go-docs' }]);
  }, []);

  const goGitHub = useCallback(() => {
    window.electron.openExternal('https://github.com/tufeiping/Clean-5ire');
    window.electron.ingestEvent([{ app: 'go-github' }]);
  }, []);

  useEffect(() => {
    Mousetrap.bind('mod+t', () => toggleSidebarCollapsed());
    // @ts-ignore
    const canny = window?.Canny;
    if (canny) {
      canny('initChangelog', {
        appID: '64cd076f9481f00996a16c42',
        position: 'top',
        align: 'left',
        theme: 'auto',
      });
    }
    return () => {
      Mousetrap.unbind('mod+t');
    };
  }, []);

  return (
    <div
      className={`flex w-full items-center justify-between self-baseline border-t border-base bg-brand-sidebar px-6 py-2 ${
        collapsed ? 'flex-col' : ''
      }`}
    >
      <button
        data-canny-changelog
        type="button"
        className={`flex items-center gap-x-1 rounded-md px-2 py-2 text-xs font-medium text-brand-secondary outline-none hover:bg-brand-surface-1 hover:text-brand-base ${
          collapsed ? 'w-full justify-center' : ''
        }`}
        title="Changelog"
        aria-label="changelog"
      >
        <Alert20Regular />
      </button>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <button
            type="button"
            className={`flex items-center gap-x-1 rounded-md px-2 py-2 text-xs font-medium text-brand-secondary outline-none hover:bg-brand-surface-1 hover:text-brand-base ${
              collapsed ? 'w-full justify-center' : ''
            }`}
            title={t('Common.Help')}
          >
            <QuestionCircle20Regular />
            {collapsed ? '' : <span>{t('Common.Help')}</span>}
          </button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="18"
                  height="18"
                  strokeWidth="1.5"
                >
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
              }
              onClick={goTwitter}
            >
              {t('Common.Author')}
            </MenuItem>
            <MenuItem
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="18"
                  height="18"
                  strokeWidth="1.5"
                >
                  <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
                </svg>
              }
              onClick={goGitHub}
            >
              {t('Common.GitHub')}
            </MenuItem>
            <MenuItem
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="20"
                  height="20"
                  strokeWidth="1.5"
                >
                  <path d="M15 21h-9a3 3 0 0 1 -3 -3v-1h10v2a2 2 0 0 0 4 0v-14a2 2 0 1 1 2 2h-2m2 -4h-11a3 3 0 0 0 -3 3v11" />
                  <path d="M9 7l4 0" />
                  <path d="M9 11l4 0" />
                </svg>
              }
              onClick={goDocs}
            >
              {t('Common.Docs')}
            </MenuItem>
            <MenuItem
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="20"
                  height="20"
                  strokeWidth="1.5"
                >
                  <path d="M12 12c2 -2.96 0 -7 -1 -8c0 3.038 -1.773 4.741 -3 6c-1.226 1.26 -2 3.24 -2 5a6 6 0 1 0 12 0c0 -1.532 -1.056 -3.94 -2 -5c-1.786 3 -2.791 3 -4 2z" />
                </svg>
              }
              // onClick={goHome}
              onClick={() => {
                setShowAbout(true);
              }}
            >
              {t('Common.About')}
            </MenuItem>
            <MenuItem
              icon={
                <svg
                  className="icon"
                  viewBox="0 0 1048 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                >
                  <path
                    d="M1.09468 192.505529h867.71621v59.428952h-867.71621zM540.589388 708.245685c-5.94776 0-11.883358 0-17.831118-5.94776-17.831118-11.895521-17.831118-29.714476-5.94776-41.609997l101.038948-130.753423-101.038948-130.753424c-11.883358-11.883358-11.883358-29.714476 0-41.597834 17.831118-11.895521 35.662236-5.94776 41.597833 5.947761l101.038948 130.753423c17.831118 23.766715 17.831118 53.493354 0 71.31231l-101.038948 130.753424c-5.923434 5.94776-11.871195 11.895521-17.818955 11.89552zM1005.463422 470.724489L937.033769 611.682761c-2.165033 4.451698-7.577617 6.324817-12.029315 4.171947l-98.837425-47.971303c-4.463861-2.165033-6.33698-7.577617-4.171947-12.041478l68.818872-141.773201c1.970424-4.050315-1.119006-9.049353-5.850455-9.098005-21.139484 0.243262-42.838471 4.731449-63.576572 13.938923-73.015144 32.366034-111.718158 115.184644-89.581299 191.751416 6.300491 22.076043 16.699949 41.391061 30.480751 57.835584L639.365998 931.244129c-3.150245 6.482937-15.556617 32.670111 15.556617 48.056445l52.97034 25.579018c40.028792 19.071755 53.310908-16.578318 56.765231-23.15856l119.174144-254.208982c23.061255 0.437872 46.767155-4.074642 69.804083-14.413284 70.619012-31.538942 108.957132-110.526173 90.359739-185.62121-5.59503-21.990901-14.984951-41.305919-27.561606-58.176151-3.284039-3.60028-9.110169-2.919146-10.971124 1.423084z m-30.04288 3.916521M345.69989 347.597335c5.94776 0 11.883358 0 17.831118 5.94776 17.831118 11.895521 17.831118 29.714476 5.94776 41.609997l-101.038948 130.753423 101.038948 130.753424c11.883358 11.883358 11.883358 29.714476 0 41.597834-17.831118 11.895521-35.662236 5.94776-41.597833-5.947761l-101.038949-130.753424c-17.831118-23.766715-17.831118-53.493354 0-71.312309l101.038949-130.753424c5.935597-5.94776 11.883358-11.895521 17.818955-11.89552z"
                    fill="#515151"
                  />
                  <path
                    d="M549.16438 916.587583H137.941821c-76.055922 0-137.941821-61.873736-137.941821-137.929659V152.707836c0-76.055922 61.873736-137.941821 137.941821-137.941821h600.772453c76.068085 0 137.941821 61.873736 137.941821 137.941821v153.109218c0 14.595731-11.822542 26.418273-26.418273 26.418274-14.595731 0-26.418273-11.822542-26.418273-26.418274V152.707836c0-46.925275-38.18-85.105275-85.105275-85.105275H137.941821c-46.925275 0-85.105275 38.18-85.105275 85.105275v625.950088c0 46.925275 38.18 85.093112 85.105275 85.093112h411.222559c14.595731 0 26.418273 11.822542 26.418273 26.418274 0 14.595731-11.822542 26.418273-26.418273 26.418273z"
                    fill="#515151"
                  />
                </svg>
              }
              // onClick={goHome}
              onClick={() => {
                window.electron.ipcRenderer.sendMessage('open-devtools');
              }}
            >
              {t('Common.DevTools')}
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <button
        type="button"
        title="Mod+t"
        className={`hidden items-center gap-3 rounded-md px-2 py-2 text-xs font-medium outline-none hover:bg-brand-surface-1 hover:text-brand-base md:flex ${
          collapsed ? 'w-full justify-center' : ''
        }`}
        onClick={() => toggleSidebarCollapsed()}
      >
        {collapsed ? <ArrowRight16Regular /> : <ArrowLeft16Regular />}
      </button>
      <div className="relative" />
      {showAbout ? (
        <AlertDialog
          type="success"
          open={showAbout}
          setOpen={setShowAbout}
          title="About"
          message="<h2>Clean version of 5ire</h2><br/><hr/><br/>Modified from <a href='https://github.com/nanbingxyz/5ire' target='_blank'>https://github.com/nanbingxyz/5ire</a><br /><br />Modified by Sunny"
        />
      ) : null}
    </div>
  );
}
