import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAuthStore from 'stores/useAuthStore';
import Spinner from 'renderer/components/Spinner';
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Input,
} from '@fluentui/react-components';
import { fmtDateTime } from 'utils/util';
import useToast from '../../../hooks/useToast';
import { captureException } from '../../logging';

// 使用 console.log 替代 Debug
const log = (...args: any[]) => {
  console.log('[TabSubscription]', ...args);
};

export default function TabSubscription() {
  const { t } = useTranslation();
  const { notifyError, notifyInfo, notifySuccess } = useToast();
  const [loading, setLoading] = useState(true);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemCode, setRedeemCode] = useState<string>('');
  const [subscription, setSubscription] = useState<any>();
  const [orders, setOrders] = useState<any[]>([]);
  const [usage, setUsage] = useState<string>('-');
  const user = useAuthStore((state) => state.user);

  const isSubscribed = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      subscription &&
      subscription.deadline &&
      new Date(subscription.deadline).getTime() >= today.getTime()
    );
  }, [subscription]);

  const loadUsage = async (userId: string) => {
    try {
      const resp = await fetch('https://skyfire.agisurge.com/v1/usage', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userId}`,
        },
      });
      const data = await resp.json();
      setUsage(data.usage);
    } catch (error) {
      log('loadUsage error:', error);
      captureException(error as Error);
    }
  };

  const loadSubscription = async (userId: string) => {
    try {
      // 模拟订阅数据
      const mockSubscription = {
        id: '1',
        user_id: userId,
        quota_per_day: 100,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      setSubscription(mockSubscription);
    } catch (error) {
      log('loadSubscription error:', error);
      captureException(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async (userId: string) => {
    try {
      // 模拟订单数据
      const mockOrders = [
        {
          id: '1',
          num_of_month: 1,
          currency: 'USD',
          amount: 1000,
          created_at: new Date().toISOString(),
        },
      ];
      setOrders(mockOrders);
    } catch (error) {
      log('loadOrders error:', error);
      captureException(error as Error);
    }
  };

  const onRedeem = useCallback(
    async (userId: string | undefined) => {
      if (!userId) {
        notifyError('User not found');
        return;
      }
      if (redeemCode.length !== 20) {
        notifyInfo(t('Subscription.Notification.InvalidRedeemCode'));
        return;
      }
      try {
        setRedeeming(true);
        // 模拟兑换逻辑
        await new Promise((resolve) => setTimeout(resolve, 1000));
        notifySuccess(t('Subscription.Notification.RedeemSuccess'));
        setRedeemOpen(false);
        setRedeemCode('');
        loadSubscription(userId);
      } catch (error) {
        log('onRedeem error:', error);
        captureException(error as Error);
      } finally {
        setRedeeming(false);
      }
    },
    [redeemCode, t],
  );

  useEffect(() => {
    if (user?.id) {
      loadSubscription(user.id);
      loadOrders(user.id);
      loadUsage(user.id);
    }
  }, [user?.id]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col gap-5 w-full min-h-96">
      <div className="text-xl border-b border-base pb-2">
        {t('Common.Subscription')}
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-lg">{t('Subscription.Status')}</div>
        <div>
          {isSubscribed ? (
            <div className="text-color-success">{t('Subscription.Active')}</div>
          ) : (
            <div className="text-color-error">{t('Subscription.Inactive')}</div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-lg">{t('Subscription.Usage')}</div>
        <div>{usage}</div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-lg">{t('Subscription.Orders')}</div>
        <div className="flex flex-col gap-2">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex justify-between items-center border-b border-base pb-2"
            >
              <div>
                {t('Subscription.OrderInfo', {
                  numOfMonth: order.num_of_month,
                  currency: order.currency,
                  amount: order.amount,
                })}
              </div>
              <div>{fmtDateTime(new Date(order.created_at))}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Dialog
          open={redeemOpen}
          onOpenChange={(_, { open }) => setRedeemOpen(open)}
        >
          <DialogTrigger disableButtonEnhancement>
            <Button appearance="primary">{t('Subscription.Redeem')}</Button>
          </DialogTrigger>
          <DialogSurface>
            <DialogBody>
              <DialogTitle>{t('Subscription.Redeem')}</DialogTitle>
              <DialogContent>
                <div className="flex flex-col gap-4">
                  <div>{t('Subscription.RedeemInfo')}</div>
                  <Input
                    value={redeemCode}
                    onChange={(_, data) => setRedeemCode(data.value)}
                    placeholder={t('Subscription.RedeemCode')}
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  appearance="secondary"
                  onClick={() => setRedeemOpen(false)}
                >
                  {t('Common.Cancel')}
                </Button>
                <Button
                  appearance="primary"
                  disabled={redeeming}
                  onClick={() => onRedeem(user?.id)}
                >
                  {redeeming ? t('Common.Waiting') : t('Common.Confirm')}
                </Button>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      </div>
    </div>
  );
}
