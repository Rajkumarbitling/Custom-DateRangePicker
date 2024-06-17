"use client"
import React, { Fragment, useEffect, useId, useState } from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";
import calendar, {
  isDate,
  isSameDay,
  isSameMonth,
  getDateISO,
  getNextMonth,
  getPreviousMonth,
  WEEK_DAYS,
  CALENDAR_MONTHS,
  formatDate,
  dateRange,
  isWeekEnd,
  preDefieOptions,
} from "../../helpers/calendar";

export default function Calendar({ date, onDateChanged, handleSetWeekEndSet }) {
  const [dateState, setDateState] = useState({
    current: new Date(),
    month: 0,
    year: 0,
  });
  const [dateSet, setDateSet] = useState([])
  const [dateRangeSet, setDateRangeSet] = useState([])

  const [today, setToday] = useState(new Date());
  useEffect(() => {
    let newDate = Array.isArray(date) ? date[0] : date
    addDateToState(newDate);
    let range = getRange(date)
    setDateRangeSet(range || [date])
  }, []);

  const id = useId()

  const addDateToState = (date) => {
    const isDateObject = isDate(date);
    const _date = isDateObject ? date : new Date();
    setDateState({
      current: isDateObject ? date : null,
      month: +_date.getMonth() + 1,
      year: _date.getFullYear(),
    });
  };

  const setYear = (e) => {
    e.preventDefault()
    let {value} = e.target
    let temp = dateState.year - value
    const isDateObject = isDate(dateState.current);
    const _date = isDateObject ? date : new Date();
    _date.setFullYear(_date.getFullYear() - temp);
    setDateState({
      current: _date,
      month: +_date.getMonth() + 1,
      year: _date.getFullYear(),
    });
  }

  const setMonth = (e) => {
    e.preventDefault()
    let {value} = e.target
    const isDateObject = isDate(dateState.current);
    const _date = isDateObject ? date : new Date();
    _date.setMonth(value);
    setDateState({
      current: _date,
      month: +_date.getMonth() + 1,
      year: _date.getFullYear(),
    });
  }

  const renderYear = () => {
    const { month, year } = dateState;
    let min = year - 50
    let max = year + 50
    const optionsList = [];
    {for (let i = min; i < max; i++) {
      optionsList.push(<option key={`${id}-${i}`} value={i}>{i}</option>)
    }}
    return optionsList
  }

  const renderMonth = () => {
    return Object.keys(CALENDAR_MONTHS).map((month, i) => <option key={`${id}-${i}`} value={i}>{month}</option>)
  }

  const getCalendarDates = () => {
    const { current, month, year } = dateState;
    const calendarMonth = month || +current?.getMonth() + 1;
    const calendarYear = year || current?.getFullYear();
    return calendar(calendarMonth, calendarYear);
  };

  const renderMonthAndYear = () => {
    const { month, year } = dateState;
    const formatter = new Intl.DateTimeFormat('zh-CN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    // Resolve the month name from the CALENDAR_MONTHS object map
    const monthname =
      Object.keys(CALENDAR_MONTHS)[Math.max(0, Math.min(month - 1, 11))];
    return (
      <Styled.CalendarHeader>
        <Styled.ArrowLeft
          onClick={handlePrevious}
          title="Previous Month"
        />
        <Styled.CalendarMonth>
          {<select name="month" id="month" value={month-1} onChange={setMonth}>{renderMonth()}</select>} {<select name="year" id="year" value={year} onChange={setYear}>{renderYear()}</select>}
        </Styled.CalendarMonth>
        <Styled.ArrowRight
          onClick={handleNext}
          title="Next Month"
        />
      </Styled.CalendarHeader>
    );
  };

  // Render the label for day of the week
  // This method is used as a map callback as seen in render()
  const renderDayLabel = (day, index) => {
    // Resolve the day of the week label from the WEEK_DAYS object map
    const daylabel = WEEK_DAYS[day].toUpperCase();
    return (
      <Styled.CalendarDay key={daylabel} index={index}>
        {daylabel}
      </Styled.CalendarDay>
    );
  };

  // Render PreDefined option buttons to select
  const renderOptions = (item, index) => {
    return (
      <Styled.preDefieOptionsButton key={index} onClick={selectPreDefineoptions} value={preDefieOptions[item]}>{item}</Styled.preDefieOptionsButton>
    );
  };
  // Render a calendar date as returned from the calendar builder function
  const renderCalendarDate = (date, index) => {
    const { current, month, year } = dateState;
    const _date = new Date(date.join("-"));
    // Check if calendar date is same day as today
    const isToday = isSameDay(_date, today);
    // Check if calendar date is same day as currently selected date
    const isCurrent = dateRangeSet.filter(date => new Date(date) && isSameDay(_date, new Date(date))).length;

    const isBlocked = isWeekEnd(date)
    // Check if calendar date is in the same month as the state month and year
    const inMonth = month && year && isSameMonth(_date, new Date([year, month, 1].join("-")));
    // The click handler
    const onClick = isBlocked ? null : gotoDate(_date);
    const onMouseEnter = isBlocked ? null : () => onHoverDate(_date);
    const onMouseLeave = isBlocked ? null : () => onHoverDate(new Date());
    const props = { index, inMonth, onClick, onMouseEnter, onMouseLeave, title: _date.toDateString() };
    // Conditionally render a styled date component
    const DateComponent = isCurrent && !isBlocked
      ? Styled.HighlightedCalendarDate
      : isToday
        ? Styled.TodayCalendarDate
        : !isBlocked
          ? Styled.CalendarDate
          : Styled.BlockedCalendarDate;
  
    return (
      <DateComponent key={getDateISO(_date)} {...props}>
        {_date.getDate()}
      </DateComponent>
    );
  };

  const gotoDate = (date) => (evt) => {
    evt && evt.preventDefault();
    const { current } = dateState;
    if (!(current && isSameDay(date, current))) {
      addDateToState(date);
      setDateRange(date);
    }
  };

  const setDateRange = (date) => {
    let temp = [...dateSet]
    if(temp .length !== 2 ) temp.push(formatDate(date))
    else temp = [formatDate(date)]
    temp = temp.slice(Math.max(temp.length - 2, 0))
    setDataToState(temp)
  }

  const getRange = (temp) =>{
    let range
    if(Array.isArray(temp)) temp = temp.sort()
    if(temp.length > 1) range = dateRange(...temp)
    return range
  }
  
  const gotoPreviousMonth = () => {
    const { month, year } = dateState;
    const previousMonth = getPreviousMonth(month, year);
    setDateState({
      month: previousMonth.month,
      year: previousMonth.year,
      current: dateState.current,
    });
  };
  const gotoNextMonth = () => {
    const { month, year } = dateState;
    const nextMonth = getNextMonth(month, year);
    setDateState({
      month: nextMonth.month,
      year: nextMonth.year,
      current: dateState.current,
    });
  };
  const handlePrevious = (evt) => {
    gotoPreviousMonth();
  };
  const handleNext = (evt) => {
    gotoNextMonth();
  };

  const selectPreDefineoptions = (e) => {
    e.preventDefault()
    let { value } = e.target
    let currentDate = new Date()
    const optionDate = new Date(currentDate.getTime() - value * 24 * 60 * 60 * 1000);
    let temp = [formatDate(optionDate), formatDate(currentDate)]
    setDataToState(temp)
  }

  const setDataToState = (temp) => {
    let weenkEndRange = []
    let range = getRange(temp)
    if(Array.isArray(temp)) temp = temp.sort()
    if(temp.length > 1) weenkEndRange = dateRange(...temp, true)
    setDateSet(temp)
    onDateChanged(temp)
    handleSetWeekEndSet(weenkEndRange)
    setDateRangeSet(range || temp)
  }

  const onHoverDate = (date) => {
    if(dateSet.length > 0 && dateSet.length < 2){
      let temp = [dateSet[0], formatDate(date)]
      let range = getRange(temp)
      setDateRangeSet(range || temp)
    }
  }

  return (
    <>
      <Styled.CalendarContainer>
        {renderMonthAndYear()}
        <Styled.CalendarGrid>
          <Fragment>{Object.keys(WEEK_DAYS).map(renderDayLabel)}</Fragment>
          <Fragment>{getCalendarDates().map(renderCalendarDate)}</Fragment>
        </Styled.CalendarGrid>
      </Styled.CalendarContainer>
      <Fragment>{Object.keys(preDefieOptions).map(renderOptions)}</Fragment>
    </>
  );
}
Calendar.propTypes = {
  date: PropTypes.instanceOf(Date),
  onDateChanged: PropTypes.func,
  handleSetWeekEndSet: PropTypes.func,
};