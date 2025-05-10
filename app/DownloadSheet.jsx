import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/components/common/Button';
import ControllerSelect from '../components/common/ControllerSelect';
import { reciptDownloadSchema } from '@/schema/receipt/receiptDownload';
import * as XLSX from 'xlsx'; // ✅ added here
import { toZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import {
  formatDate,
  formatIndianDateTime,
  getTimeInAmPm,
} from '@/utils/formatTime';
import { convertToAmPm } from '@/utils/utils';

// --- generateOptions helper ---
export const generateOptions = (options, valueKey, labelKey) => {
  return options.map((item) => ({
    value: item[valueKey],
    label: item[labelKey]
      ?.toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (match) => match.toUpperCase()),
  }));
};

// --- Main component ---
const DownloadSheet = ({ data }) => {
  const [monthOptions, setMonthOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);

  const methods = useForm({
    resolver: yupResolver(reciptDownloadSchema),
    defaultValues: {
      month: null,
      year: null,
    },
  });

  const { handleSubmit, watch } = methods;

  const onSubmit = (formData) => {
    console.log('Excel Export with:', formData);

    const { month, year } = formData;

    if (!month || !year) {
      console.warn('Month and Year are required');
      return;
    }

    // ✅ Filter data based on month & year selection
    // const filteredData = data.filter((item) => {
    //   if (!item.created_date) return false;
    //   const date = new Date(item.created_date);
    //   return date.getMonth() === month && date.getFullYear() === year;
    // });

    let dateArr = [];

    const filteredData = data.filter((item) => {
      if (!item.created_date) return false; // change if field name is different
      // const date = new Date(item.created_date);
      // const itemMonth = date.getMonth();
      // const itemYear = date.getFullYear();

      // Force Asia/Kolkata zone (or keep it in UTC depending on your needs)
      const date = new Date(item.created_date);

      // Get India timezone equivalent
      const indiaDate = toZonedTime(date, 'Asia/Kolkata');

      const itemMonth = indiaDate.getMonth(); // ✅ fixes the issue
      const itemYear = indiaDate.getFullYear();

      dateArr.push(itemMonth);

      // console.log('Month selected:', itemMonth, typeof itemMonth);
      // console.log('Month_data selected:', month.value, typeof month);
      // console.log('Month_data selected:', month, typeof month);
      // console.log('Year selected:', itemYear, typeof itemYear);
      // console.log('Year_data selected:', year.value, typeof year);
      // console.log('Data sample:', data[0]);
      return (
        Number(itemMonth) === Number(month.value) &&
        Number(itemYear) === Number(year.value)
      );
    });
    console.log('filteredData_', filteredData, dateArr);

    if (filteredData.length === 0) {
      alert('No data available for the selected month and year.');
      return;
    }

    // ✅ Map data into a plain array of objects (for Excel)
    const excelData = filteredData.map((item, index) => ({
      SNo: index + 1,
      'Order #': item.orderId || '-',
      'Receipt No': item.receiptName || '-',
      'Payment Status': item.paymentSuccess ? 'Paid' : 'Unpaid' || '-',
      'Email Id': item.emailId || '-',
      'Mobile No': item.mobileNo || '-',
      'Payment Date': formatDate(item.created_date) || '-',
      'Payment Time': getTimeInAmPm(item.created_date) || '-',
      'Booking Date': formatDate(item.date) || '-',
      'Booking Time': convertToAmPm(item.time) || '-',
      'Booking Amount': '₹' + item.price || '-',
      'Booked Room': item.room || '-',
      'Booked Table': item.table_number || '-',
      'Menu Type': item.type === '2' ? 'Set Menu' : 'Ala Carte' || '-',
      'Submenu Type': item.sub_type === '2' ? 'Non-Veg' : 'Veg' || '-',
      // Add other fields you want in Excel
    }));

    // ✅ Generate worksheet & workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Receipts');

    // ✅ Trigger download
    const fileName = `Receipts-${year.value}-${new Date(
      0,
      month.value,
    ).toLocaleString('default', {
      month: 'long',
    })}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  // --- Dynamic Months & Years based on data ---
  // useEffect(() => {
  //   console.log('DownloadSheet data_', data);

  //   if (data && data.length > 0) {
  //     const monthsSet = new Set();
  //     const yearsSet = new Set();

  //     data.forEach((item) => {
  //       if (item.created_date) {
  //         const date = new Date(item.created_date);
  //         monthsSet.add(date.getMonth()); // 0-11
  //         yearsSet.add(date.getFullYear());
  //       }
  //     });

  //     // Build monthOptions: array of { value, type }
  //     const monthsArray = [...monthsSet]
  //       .sort((a, b) => a - b)
  //       .map((month) => ({
  //         value: month,
  //         type: new Date(0, month).toLocaleString('default', { month: 'long' }), // Jan, Feb...
  //       }));

  //     // Build yearOptions: array of { value, type }
  //     const yearsArray = [...yearsSet]
  //       .sort((a, b) => b - a)
  //       .map((year) => ({
  //         value: year,
  //         type: year.toString(),
  //       }));

  //     setMonthOptions(monthsArray);
  //     setYearOptions(yearsArray);
  //   } else {
  //     setMonthOptions([]);
  //     setYearOptions([]);
  //   }
  // }, [data]);

  useEffect(() => {
    console.log('DownloadSheet data_', data);

    if (data && data.length > 0) {
      const monthsSet = new Set();
      const yearsSet = new Set();
      const dateObjects = [];

      data.forEach((item) => {
        if (item.created_date) {
          const date = new Date(item.created_date);
          dateObjects.push(date);

          monthsSet.add(date.getMonth()); // 0-11
          yearsSet.add(date.getFullYear());
        }
      });

      // Build monthOptions: array of { value, type }
      const monthsArray = [...monthsSet]
        .sort((a, b) => a - b)
        .map((month) => ({
          value: month,
          type: new Date(0, month).toLocaleString('default', { month: 'long' }),
        }));

      // Build yearOptions: array of { value, type }
      const yearsArray = [...yearsSet]
        .sort((a, b) => b - a)
        .map((year) => ({
          value: year,
          type: year.toString(),
        }));

      setMonthOptions(monthsArray);
      setYearOptions(yearsArray);

      // ✅ FIND the latest date to set as default
      if (dateObjects.length > 0) {
        const latestDate = new Date(
          Math.max(...dateObjects.map((d) => d.getTime())),
        );

        const latestMonth = latestDate.getMonth(); // 0-based
        const latestYear = latestDate.getFullYear();

        // Find the correct option objects (matching { value, label })
        const defaultMonth = monthsArray.find((m) => m.value === latestMonth);
        const defaultYear = yearsArray.find((y) => y.value === latestYear);

        // Set form default values programmatically
        if (defaultMonth) {
          methods.setValue('month', {
            value: defaultMonth.value,
            label: defaultMonth.type,
          });
        }
        if (defaultYear) {
          methods.setValue('year', {
            value: defaultYear.value,
            label: defaultYear.type,
          });
        }
      }
    } else {
      setMonthOptions([]);
      setYearOptions([]);
    }
  }, [data, methods]);

  return (
    <FormProvider {...methods}>
      <div className='download-sheet-form'>
        <ControllerSelect
          options={generateOptions(monthOptions, 'value', 'type')}
          placeholder='Select Month'
          name='month'
          label='Month'
          className='download-sheet-form-month'
        />
        <ControllerSelect
          options={generateOptions(yearOptions, 'value', 'type')}
          placeholder='Select Year'
          className='download-sheet-form-year'
          name='year'
          label='Year'
        />
        <div>
          <Button
            disabled={monthOptions.length === 0 || yearOptions.length === 0}
            className='download-bttn'
            onClick={handleSubmit(onSubmit)}>
            Download
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};

export default DownloadSheet;
