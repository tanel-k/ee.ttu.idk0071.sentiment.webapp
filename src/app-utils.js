import 'jquery';
import blockUI from 'blockUI';

export const blockPage = () => {
  $.blockUI({ message: null });
};

export const releasePage = () => {
  $.unblockUI();
};
