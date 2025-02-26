const fileTypes = {
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'application/pdf': 'PDF',
  'text/plain': 'TXT',
  'application/msword': 'DOC',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.ms-powerpoint': 'PPT',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'DOCX',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    'PPTX',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
};
const sheetFTypes = [
  // 'application/vnd.ms-excel',
  // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // 'application/vnd.ms-excel.sheet.macroEnabled.12',
  'text/csv',
];

const allStatus = [
  { id: 1, name: 'pending', color: 'volcano' },
  { id: 2, name: 'New', color: 'geekblue' },
  { id: 3, name: 'Matched', color: 'purple' },
  { id: 4, name: 'Job Done', color: 'geekblue' },
  { id: 5, name: 'archive', color: 'orange' },
  { id: 6, name: 'complete', color: 'green' },
  { id: 7, name: 'cancel', color: 'red' },
  { id: 8, name: 'Disputed', color: 'red', hideInFilter: true },
  { id: 0, name: 'expire', color: 'red' },
];

const typeofTime = [
  {
    id: 1,
    name: 'Normal',
    priceKey: 'regular_normal_price',
    feeKey: 'system_normal_fee',
  },
  {
    id: 2,
    name: 'Urgent',
    priceKey: 'regular_urgent_price',
    feeKey: 'system_urgent_fee',
  },
  {
    id: 3,
    name: 'Weekend',
    priceKey: 'regular_weekend_price',
    feeKey: 'system_weekend_fee',
  },
];
const frequncyArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const entityArray = [
  { id: 'Law-firm', val: 'Law Firm Profile' },
  { id: 'User', val: 'Solicitor Profile' },
  {
    id: 'subscription cancel',
    val: 'Subscription Cancelled',
  },
  { id: 'Review-reply', val: 'Review Reply' },
  { id: 'plan subscription', val: 'New Subscription' },
  { id: 'Question-answer', val: 'New Question Answer' },
  { id: 'Guide', val: 'Legel Guides' },
  { id: 'Offer', val: 'Offers' },
  { id: 'Question', val: 'Question' },
  { id: 'New Office Created', val: 'New Office Created' },
  { id: 'Edit Office', val: 'Edit Office' },
  { id: 'Reactivated Subscription', val: 'Reactivated Subscription' },
  { id: 'Invited Solicitors', val: 'Invited Solicitors' },
];
export {
  allStatus,
  typeofTime,
  frequncyArray,
  sheetFTypes,
  fileTypes,
  entityArray,
};
export default fileTypes;
