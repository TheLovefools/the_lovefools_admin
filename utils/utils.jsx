/* eslint-disable no-unused-vars */
import axios from 'axios';
import axiosInstance from './axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { MonthsOptions, Roles } from './constant';
import { datepickerFormatDate } from './formatTime';

export const numberWithCommas = (x) => {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const findSelectedValueLabelOptions = (
  options = [],
  selectedValues = [],
) => {
  const selectedOptions = [];
  options?.forEach((option) => {
    if ('options' in option) {
      const selectedGroupOptions = option.options.filter((item) =>
        selectedValues.includes(item.value),
      );
      selectedOptions.push(...selectedGroupOptions);
    } else {
      if (selectedValues.includes(option.value)) {
        selectedOptions.push(option);
      }
    }
  });

  return selectedOptions;
};

export function getDaysInMonth(monthName) {
  const monthIndex = MonthsOptions.findIndex(
    (month) => month.value === monthName.toUpperCase(),
  );

  if (monthIndex === -1) {
    return [];
  }

  const now = new Date();
  const currentYear = now.getFullYear();

  const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();

  const dateOptions = [];
  for (let day = 1; day <= daysInMonth; day++) {
    dateOptions.push({ value: String(day), label: String(day) });
  }

  return dateOptions;
}

export const exportData = async (api, name, handleError) => {
  try {
    const response = await axiosInstance.get(api, {
      responseType: 'blob',
    });

    if (!response || !response.data) {
      throw new Error('Empty response or no data received.');
    }

    const contentType = response.headers['content-type'];

    if (!contentType || contentType !== 'application/octet-stream') {
      throw new Error('Invalid Content-Type for file download.');
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error('Error exporting data:', error);
    handleError(error);
  }
};

export const disabledForSA = (roles) => {
  const rolesNames = roles.map((role) => role.roleName);
  return !(rolesNames && rolesNames.includes(Roles.SUPER_ADMIN));
};

export const disabledForRoles = (roles, Role) => {
  const rolesNames = roles.map((role) => role.roleName);
  return !(rolesNames && Role.some((role) => rolesNames.includes(role)));
};

export const findSingleSelectedValueLabelOption = (options, selectedValue) => {
  return options.find((item) => item?.value === selectedValue) || null;
};

export const generateOptionsFromEnum = (members) =>
  members.map((member) => {
    return {
      value: member,
      label: member
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (match) => match.toUpperCase()),
    };
  });

export const generateOptions = (
  options,
  valueKey,
  labelKey,
  idkey,
  groupKey = null,
  groupTitleKey = null,
  isDirectValues = false,
) => {
  if (options && options.length > 0 && options[0]?.data) {
    return options.map((group) => {
      const groupTitle = groupTitleKey ? group[groupTitleKey] : group.title;

      const unique = group.data.filter((obj, index) => {
        return index === group.data.findIndex((o) => obj.id === o.id);
      });

      return {
        label: groupTitle
          ?.toLowerCase()
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (match) => match.toUpperCase()),
        options: unique.map((item) => ({
          value: isDirectValues ? item : item[valueKey],
          label: `${item?.employeeId} - ${item[labelKey]
            ?.toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (match) => match.toUpperCase())}`,
        })),
      };
    });
  } else {
    return options?.length > 0
      ? options.map((item) => {
          if (groupKey && item[groupKey]) {
            return {
              label: item[groupKey]
                ?.toLowerCase()
                .replace(/_/g, ' ')
                .replace(/\b\w/g, (match) => match.toUpperCase()),
              options: item[groupKey].map((status) => ({
                value: isDirectValues ? status : status[valueKey],
                label: status[labelKey]
                  ?.toLowerCase()
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (match) => match.toUpperCase()),
              })),
            };
          } else {
            const label = isDirectValues ? item : item[labelKey];
            return {
              value: isDirectValues ? item : item[valueKey],
              label: `${idkey ? `${item[idkey]} - ` : ''}${label
                ?.toLowerCase()
                .replace(/_/g, ' ')
                .replace(/\b\w/g, (match) => match.toUpperCase())}`,
            };
          }
        })
      : [];
  }
};

export const generateDocumentTypeOptions = (panNumber, aadharNumber) => {
  const options = [];

  if (aadharNumber) {
    options.push({ value: 'AADHAR_CARD', label: 'Aadhar Card' });
  }

  if (panNumber) {
    options.push({ value: 'PAN_CARD', label: 'Pan Card' });
  }

  return options;
};

export const downloadFile = async (url, fileName) => {
  try {
    const response = await axios.get(url, {
      responseType: 'blob',
    });
    let docName = '';
    if (!fileName) {
      docName = url.substring(url.lastIndexOf('/') + 1);
    }
    const blob = new Blob([response.data]);

    const href = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = href;
    link.download = !fileName ? docName : fileName;
    link.click();
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

export const formatCurrency = (amount) => {
  const inputValue = String(amount);

  const cleaned = inputValue.replace(/[^\d.]/g, '');

  const parts = cleaned.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '';

  let lastThree = integerPart.slice(-3);
  const otherNumbers = integerPart.slice(0, -3);

  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }

  const formattedInteger =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  let result = formattedInteger;
  if (decimalPart.length > 0 || inputValue.includes('.')) {
    result += '.' + decimalPart;
  }
  return '₹' + result;
};

export function formatCurrencyInWord(amount) {
  if (amount >= 1e9) {
    return (amount / 1e9).toFixed(2) + ' Billion';
  } else if (amount >= 1e7) {
    return (amount / 1e7).toFixed(2) + ' Crore';
  } else if (amount >= 1e5) {
    return (amount / 1e5).toFixed(2) + ' Lac';
  } else if (amount >= 1e4) {
    return (amount / 1e3).toFixed(1) + ' K';
  } else if (amount >= 10) {
    return amount.toString();
  } else {
    return amount.toString();
  }
}

export const generateMonthList = (startYear, startMonth, numMonths) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const monthList = [];
  let currentYear = startYear;
  let currentMonth = startMonth;

  for (let i = 0; i < numMonths; i++) {
    monthList.push({
      label: `${monthNames[currentMonth % 12]} ${currentYear}`,
      value: `${monthNames[currentMonth % 12].toUpperCase()} ${currentYear}`,
    });
    currentMonth--;
    if (currentMonth === -1) {
      currentMonth = 11;
      currentYear--;
    }
  }

  return monthList.reverse();
};

export const formatDateIfValid = (date) => {
  try {
    return new Date(datepickerFormatDate(date));
  } catch (error) {
    console.error('Invalid date:', date);
    return null;
  }
};

export const toTitleCase = (str) => {
  return str
    ?.split(' ')
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    ?.join(' ');
};

export const disablePastDate = (date) => {
  const selectedDate = new Date(date).setHours(0, 0, 0, 0);
  const currentDate = new Date().setHours(0, 0, 0, 0);
  return selectedDate < currentDate;
};

export function convertTimeObjectToString(timeObj) {
  const hour = timeObj?.hour ? timeObj?.hour.toString().padStart(2, '0') : '00'; // Ensure 2 digits
  const minute = timeObj?.minute
    ? timeObj?.minute.toString().padStart(2, '0')
    : '00';
  const second = timeObj?.second
    ? timeObj?.second.toString().padStart(2, '0')
    : '00';

  return `${hour}:${minute}:${second}`;
}

export const formatDateForApi = (date) => {
  const localDate = new Date(date); // Ensure it's a Date object
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
};
