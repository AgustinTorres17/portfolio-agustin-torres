export default `
import React, { useState, useEffect } from "react";
import { CompanyOverviewsHeader } from "./CompanyOverviewsHeader";
import { CompanyOverviewsBody } from "./CompanyOverviewsBody";
import { getWeekInfo } from "@/app/services/dashboardService";
import { DayData, WeekInfo } from "@/types/dashboard";

export const CompanyOverviews = () => {
  const getPreviousMonday = (date: Date) => {
    const day = date.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    const previousMonday = new Date(date);
    previousMonday.setDate(date.getDate() + diff);
    return previousMonday;
  };
  const [currentDate, setCurrentDate] = useState(getPreviousMonday(new Date()));
  const [weekData, setWeekData] = useState<DayData[]>([]);

  useEffect(() => {
    const fetchWeekData = async () => {
      const data: WeekInfo = await getWeekInfo(currentDate);
      const parsedWeekData: DayData[] = data.days.map((day) => ({
        ...day,
        date: new Date(day.date),
      }));
      setWeekData(parsedWeekData);
    };

    fetchWeekData();
  }, [currentDate]);

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
      return newDate;
    });
  };

  return (
    <div className="w-full hidden md:block px-8 py-5 overflow-x-hidden relative top-[-70px] md:static md:top-[unset]">
      <div className=" bg-white rounded-xl border border-slate-200 space-y-6 overflow-hidden">
        <CompanyOverviewsHeader
          currentDate={currentDate}
          onNavigate={navigateWeek}
        />
        <CompanyOverviewsBody weekData={weekData} />
      </div>
    </div>
  );
};`;
