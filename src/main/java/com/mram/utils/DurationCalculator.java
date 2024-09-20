package com.mram.utils;

import java.sql.Timestamp;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.stream.IntStream;

public class DurationCalculator {

    private static final int WORK_HOUR_START = 9;
    private static final int WORK_HOUR_END = 18;
    private static final long MINUTES = 60;

    private static final long WORKING_HOURS_PER_DAY = WORK_HOUR_END - WORK_HOUR_START;
    private static final long WORKING_MINUTES_PER_DAY = WORKING_HOURS_PER_DAY * MINUTES;
    private int minutes = 0;
    private long time = 0;

    public DurationCalculator(int minutes) {
        this.minutes = minutes;
    }

    public DurationCalculator(long time) {
        this.minutes = (int) (time / 60000);
    }

    public DurationCalculator(Date start, Date end) {
        if (start == null || end == null) {
            minutes = 0;
            time = 0L;
        } else {
            minutes = getWorkingMinutes(new Timestamp(start.getTime()), new Timestamp(end.getTime()));
            time = getWorkingMinutes2(new Timestamp(start.getTime()), new Timestamp(end.getTime()));
        }
    }

    public String getParsed() {
        String parsed = "";
        int time = minutes;
        if (time >= 1440) {
            parsed += time / 1440 + " хоног ";
            time %= 1440;
        }
        if (time >= 60) {
            parsed += time / 60 + " цаг ";
            time %= 60;
        }
        parsed += time + " минут";
        return parsed;
    }

    public long getWorkingMinutes2(final Timestamp startTime, final Timestamp endTime) {
        if (null == startTime || null == endTime) {
            return 0;
        }
        if (endTime.before(startTime)) {
            return 0;
        }
        return endTime.getTime() - startTime.getTime();
    }



    private boolean isWorkingDay(final LocalDateTime time) {
        if (time != null) {
            if (time.getDayOfWeek() != null) {
                return time.getDayOfWeek().getValue() < DayOfWeek.SATURDAY.getValue();
            }
        }
        return false;
    }

    private boolean isWorkingHours(final LocalDateTime time) {
        int hour = time.getHour();
        return WORK_HOUR_START <= hour && hour <= WORK_HOUR_END;
    }

    public int getMinutes() {
        return minutes;
    }

    public long getTime() {
        return time;
    }

    public void setMinutes(int minutes) {
        this.minutes = minutes;
    }
}
