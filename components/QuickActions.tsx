import { Grid, Button } from 'zmp-ui';
import { openOAChat } from '../services/oa';

export function QuickActions() {
  const actions = [
    { label: 'Tích điểm', onClick: () => (location.href = '/rewards') },
    { label: 'Đổi thưởng', onClick: () => (location.href = '/rewards') },
    { label: 'Đặt hàng', onClick: () => (location.href = '/cart') },
    { label: 'Liên hệ', onClick: () => openOAChat('Shop ơi tư vấn giúp em!') },
  ];
  return (
    <Grid columns={4} gap={12} className="my-3">
      {actions.map((a) => (
        <Button key={a.label} onClick={a.onClick} className="rounded-2xl h-20 shadow">
          {a.label}
        </Button>
      ))}
    </Grid>
  );
}