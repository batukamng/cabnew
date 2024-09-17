package com.mram.config.security;

import com.mram.service.core.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ScheduledTasks {
    private final ActivityService activityService;

    @Autowired
    public ScheduledTasks(ActivityService activityService) {
        this.activityService = activityService;
    }

    public ActivityService getActivityService() {
        return activityService;
    }

    /*
     * @Scheduled(cron = "0 1 15 * * ?")
     * void deleteActivitiesOlderThanAMonth() {
     * Activity firstActivity = this.activityService.findFirst();
     * List<Activity> activityList = this.activityService.findAll();
     * for (Activity activity : activityList) {
     * if (!activity.getId().equals(firstActivity.getId())) { // exclude first
     * activity
     * 
     * long diff = new Date().getTime() - activity.getRegDtm().getTime();
     * 
     * if (diff/(60 * 1000) % 60 >= 31) {
     * this.activityService.delete(activity.getId());
     * System.out.println("Deleted activity! " + activity.getId());
     * }
     * }
     * }
     * System.out.println("Deleted old user activities!");
     * }
     */
}
