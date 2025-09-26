import { useShallow } from 'zustand/react/shallow';
import { useUserStore } from '@/stores/useUserStore';
import { RoleEnum } from '@/constants/enums';

function RoleBasedComponent({
  allowedRoles,
  children,
}: {
  allowedRoles: RoleEnum[];
  children: React.ReactNode;
}) {
  const { user } = useUserStore(useShallow((state) => ({ user: state.user })));

  if (!allowedRoles.includes(user?.role.name || RoleEnum.MEMBER)) {
    return null;
  }

  return <>{children}</>;
}

export default RoleBasedComponent;
