// import {
//   DescriptionOutlined,
//   PieChartOutlined,
//   AccountCircleOutlined,
//   PersonSearchOutlined,
//   SettingsOutlined,
//   ReceiptLongOutlined,
// } from '@mui/icons-material';
// import { MenuItem } from '../../types/route';
// import {
//   LGU_DIRECTOR_ROLE_ID,
//   LGU_EDITOR_ROLE_ID,
//   LIQUIDATING_OFFICER_ROLE_ID,
//   MASTER_DIRECTOR_ROLE_ID,
// } from '@/api/services/AccountsService/config';
// import {
//   ProcessedTransactionsChip,
//   CancelledTransactionsChip,
// } from '@/pages/Transactions/TransactionsChip';

// export const menuItems: MenuItem[] = [
//   {
//     id: 'transactions',
//     path: '/transactions',
//     label: 'Transactions',
//     icon: <DescriptionOutlined />,
//     allowedRoles: [LIQUIDATING_OFFICER_ROLE_ID],
//   },
//   {
//     id: 'transactions',
//     path: '#',
//     label: 'Transactions',
//     icon: <DescriptionOutlined />,
//     allowedRoles: [MASTER_DIRECTOR_ROLE_ID, LGU_DIRECTOR_ROLE_ID, LGU_EDITOR_ROLE_ID],
//     subMenu: [
//       {
//         id: 'processed',
//         path: '/transactions/processed',
//         label: 'Processed',
//         rightElement: <ProcessedTransactionsChip />,
//       },
//       {
//         id: 'cancelled',
//         path: '/transactions/cancelled',
//         label: 'Cancelled',
//         rightElement: <CancelledTransactionsChip />,
//       },
//     ],
//   },
//   {
//     id: 'reports',
//     path: '/reports',
//     label: 'Reports',
//     icon: <PieChartOutlined />,
//   },
//   {
//     id: 'accounts',
//     path: '#',
//     label: 'Accounts',
//     icon: <AccountCircleOutlined />,
//     allowedRoles: [MASTER_DIRECTOR_ROLE_ID, LGU_DIRECTOR_ROLE_ID],
//     subMenu: [
//       {
//         id: 'all',
//         path: '/accounts/all',
//         label: 'All',
//         allowedRoles: [MASTER_DIRECTOR_ROLE_ID, LGU_DIRECTOR_ROLE_ID],
//       },
//       {
//         id: 'master-director',
//         path: '/accounts/master-director',
//         label: 'Master Director',
//         allowedRoles: [MASTER_DIRECTOR_ROLE_ID],
//       },
//       {
//         id: 'lgu-director',
//         path: '/accounts/lgu-director',
//         label: 'LGU Director/Treasurer',
//         allowedRoles: [MASTER_DIRECTOR_ROLE_ID, LGU_DIRECTOR_ROLE_ID],
//       },
//       {
//         id: 'lgu-editor',
//         path: '/accounts/lgu-editor',
//         label: 'LGU Collector',
//         allowedRoles: [MASTER_DIRECTOR_ROLE_ID, LGU_DIRECTOR_ROLE_ID],
//       },
//       {
//         id: 'liquidating-officer',
//         path: '/accounts/liquidating-officer',
//         label: 'Liquidating Officer',
//         allowedRoles: [MASTER_DIRECTOR_ROLE_ID, LGU_DIRECTOR_ROLE_ID, LIQUIDATING_OFFICER_ROLE_ID],
//       },
//     ],
//   },
//   {
//     id: 'lgu-directories',
//     path: '/lgu-directories',
//     label: 'LGU Directory',
//     icon: <PersonSearchOutlined />,
//     allowedRoles: [MASTER_DIRECTOR_ROLE_ID],
//   },
//   {
//     id: 'settings',
//     path: '/settings/AF51',
//     label: 'Settings',
//     icon: <SettingsOutlined />,
//     allowedRoles: [MASTER_DIRECTOR_ROLE_ID, LGU_DIRECTOR_ROLE_ID],
//     subMenu: [
//       {
//         id: 'AF51',
//         path: '/settings/AF51',
//         label: 'Account Groups',
//         allowedRoles: [MASTER_DIRECTOR_ROLE_ID, LGU_DIRECTOR_ROLE_ID],
//       },
//       {
//         id: 'AF52',
//         path: '/settings/accountcodes',
//         label: 'Account Codes',
//         allowedRoles: [MASTER_DIRECTOR_ROLE_ID, LGU_DIRECTOR_ROLE_ID],
//       },
//     ],
//   },
//   {
//     id: 'logs',
//     path: '/logs',
//     label: 'Logs',
//     icon: <ReceiptLongOutlined />,
//     allowedRoles: [MASTER_DIRECTOR_ROLE_ID, LGU_DIRECTOR_ROLE_ID],
//   },
// ];
