import React, { useState, memo, useEffect } from 'react';
import {
  Avatar,
  Button,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  SelectTabEvent,
  Tab,
  TabList,
  Text,
} from '@fluentui/react-components';
import {
  CheckmarkStarburst16Filled,
  Premium24Regular,
  ShieldKeyhole24Regular,
} from '@fluentui/react-icons';
import { useTranslation } from 'react-i18next';
import Empty from 'renderer/components/Empty';
import useAppearanceStore from 'stores/useAppearanceStore';
import useAuthStore from 'stores/useAuthStore';
import useToast from 'hooks/useToast';
import TabPassword from './TabPassword';
import TabSubscription from './TabSubscription';

const MemorizedTabPassword = memo(TabPassword);
const MemorizedTabSubscription = memo(TabSubscription);

export default function Account() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const getPalette = useAppearanceStore((state) => state.getPalette);
  const updateUserMetadata = useAuthStore((state) => state.updateUserMetadata);
  const updateAvatar = useAuthStore((state) => state.updateAvatar);
  const avatarUrl = useAuthStore((state) => state.avatarUrl);
  const { notifySuccess, notifyError } = useToast();

  const [tab, setTab] = useState('password');
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [avatarKey, setAvatarKey] = useState(0);

  const loadAvatar = async () => {
    const avatarPath = await window.electron.getAvatarPath();
    console.log('Avatar path:', avatarPath);
    if (avatarPath) {
      const url = `file://${encodeURI(avatarPath)}?t=${Date.now()}`;
      console.log('Avatar URL:', url);
      updateAvatar(url);
      setAvatarKey((prev) => prev + 1);
    }
  };

  const onTabSelect = (_: SelectTabEvent, tabItem: any) => {
    setTab(tabItem.value);
  };

  const handleNameSave = () => {
    if (newName.trim()) {
      updateUserMetadata({ name: newName.trim() });
      setEditingName(false);
      notifySuccess(t('Account.Notification.NameUpdated'));
    }
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        notifyError(t('Account.Notification.ImageTooLarge'));
        return;
      }

      try {
        const reader = new FileReader();

        reader.onload = async () => {
          try {
            const base64Data = reader.result as string;
            const base64Content = base64Data.split(',')[1];

            const success = await window.electron.saveAvatar(base64Content);

            if (success) {
              await loadAvatar();
              setAvatarKey((prev) => prev + 1);
              notifySuccess(t('Account.Notification.AvatarUpdated'));
            } else {
              throw new Error('Failed to save avatar');
            }
          } catch (error) {
            console.error('Failed to save avatar:', error);
            notifyError(t('Account.Notification.AvatarUpdateFailed'));
          }
        };

        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error in handleAvatarChange:', error);
        notifyError(t('Account.Notification.AvatarUpdateFailed'));
      }
    }
  };

  useEffect(() => {
    if (user?.user_metadata.name) {
      setNewName(user.user_metadata.name);
    }
    loadAvatar();
  }, [user]);

  return (
    <div className="page h-full">
      <div className="page-top-bar" />
      <div className="page-header flex items-center justify-between">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl flex-shrink-0 mr-6">{t('Common.Account')}</h1>
        </div>
      </div>
      {/* {user?.confirmed_at ? null : (
        <div className="page-msg">
          <MessageBar key="warning" intent="warning">
            <MessageBarBody>
              <MessageBarTitle>
                {t('Account.Notification.InactiveAccountTitle')}
              </MessageBarTitle>
              <Text>{t('Account.Notification.InactiveAccountInfo')}</Text>
            </MessageBarBody>
          </MessageBar>
        </div>
      )} */}
      <div className="mt-2.5 pb-12 h-full -mr-5 overflow-y-auto">
        {user ? (
          <div>
            <div className="flex justify-start flex-nowrap items-center">
              <div className="relative">
                <Avatar
                  key={`avatar-${avatarKey}`}
                  aria-label={t('Common.User')}
                  name={user.user_metadata.name}
                  image={{ src: avatarUrl }}
                  color="colorful"
                  className="mr-2"
                  size={56}
                  style={{
                    objectFit: 'cover',
                    backgroundColor: avatarUrl ? 'transparent' : undefined,
                  }}
                  onError={(e) => {
                    console.error('Avatar image load error:', e);
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                  id="avatar-input"
                />
                <Button
                  appearance="subtle"
                  size="small"
                  className="absolute bottom-0 right-0"
                  onClick={() =>
                    document.getElementById('avatar-input')?.click()
                  }
                >
                  {t('Common.Change')}
                </Button>
              </div>
              <div>
                <div>
                  {editingName ? (
                    <div className="flex items-center">
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="mr-2"
                      />
                      <Button appearance="primary" onClick={handleNameSave}>
                        {t('Common.Save')}
                      </Button>
                      <Button
                        appearance="subtle"
                        onClick={() => {
                          setEditingName(false);
                          setNewName(user.user_metadata.name);
                        }}
                      >
                        {t('Common.Cancel')}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Text truncate size={500} className="mr-2">
                        <b>{user.user_metadata.name}</b>
                      </Text>
                      <Button
                        appearance="subtle"
                        size="small"
                        onClick={() => setEditingName(true)}
                      >
                        {t('Common.Edit')}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-10 flex justify-start items-start h-5/6">
              <div className="flex-shrink-0 h-full">
                <TabList selectedValue={tab} vertical onTabSelect={onTabSelect}>
                  <Tab
                    value="password"
                    icon={<ShieldKeyhole24Regular className="tips" />}
                  >
                    {t('Common.Password')}
                  </Tab>
                </TabList>
              </div>
              <div className="flex-grow ml-10">
                {tab === 'subscription' ? (
                  <MemorizedTabSubscription />
                ) : (
                  <MemorizedTabPassword />
                )}
              </div>
            </div>
          </div>
        ) : (
          <Empty image="door" text={t('Notification.SignOutSuccess')} />
        )}
      </div>
    </div>
  );
}
