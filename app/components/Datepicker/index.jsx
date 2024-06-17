"use client"
import React, { useId, useState } from "react";
import PropTypes from "prop-types";
import Calendar from "../Calendar/index";
import * as Styled from "./styles";
import { getVisibleDate } from "../../helpers/calendar";

export default function Datepicker(props) {
  const [dateState, setDateState] = useState([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [weekendSet, setWeekEndSet] = useState([])
  const { label } = props;

  const toggleCalendar = () => setCalendarOpen(!calendarOpen);
  const handleChange = (evt) => evt.preventDefault();
  const handleDateChange = (dateArr) => {
    setDateState(dateArr)
  };

  const handleSetWeekEndSet = (data) => {
    setWeekEndSet(data)
  }

  const closeCalendar = () => {
    setCalendarOpen(false)
  }

  const id = useId();

  const renderList = (list) => {
    return (
        <ul className="list-disc list-outside">
          {
            list.map((date, index) => <li key={`${id}-${index}`}>{date}</li>)
          }
        </ul>
    )
  }

  return (
    <Styled.DatePickerContainer >
      <div>
        <Styled.DatePickerFormGroup>
          <Styled.DatePickerLabel>{label || "Enter Date"}</Styled.DatePickerLabel>
          <Styled.DatePickerInput
            type="text"
            value={dateState.length > 0 ? getVisibleDate(dateState) : ""}
            onChange={handleChange}
            readOnly="readonly"
            placeholder="YYYY / MM / DD ~ YYYY / MM / DD"
          />
        </Styled.DatePickerFormGroup>
        <Styled.DatePickerDropdown isOpen={calendarOpen} toggle={toggleCalendar}>
          <Styled.DatePickerDropdownToggle color="transparent" />
          <Styled.DatePickerDropdownMenu>
            {calendarOpen && (
              <div>
                <Calendar
                  date={dateState.length > 1 && dateState || new Date()}
                  onDateChanged={handleDateChange}
                  handleSetWeekEndSet={handleSetWeekEndSet}
                />
                <Styled.DatePickerButton onClick={closeCalendar}>Save</Styled.DatePickerButton>
              </div>
            )}
          </Styled.DatePickerDropdownMenu>
        </Styled.DatePickerDropdown>
      </div>
      {Array.isArray(dateState) && dateState.length > 0 && <div>
        <h5>Date Range Selected</h5>
        {renderList(dateState)}
      </div>}
      {Array.isArray(weekendSet) && weekendSet.length > 0 && <div>
        <h5>WeekEnd Dates Selected</h5>
        {renderList(weekendSet)}
      </div>}
    </Styled.DatePickerContainer>
  );
}

Datepicker.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onDateChanged: PropTypes.func,
};