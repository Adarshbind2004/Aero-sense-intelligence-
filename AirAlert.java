// Placeholder Android service class (concept)
// In a real app this would be an Android Service using WorkManager/Firebase for notifications.
public class AirAlert {
    // model params would be fetched from backend
    private double intercept = 0.0;
    private double slope = 1.0;
    public AirAlert(double intercept, double slope){
        this.intercept = intercept; this.slope = slope;
    }
    public double predictAQI(double pm25){
        return intercept + slope * pm25;
    }
    public void notifyIfBad(double pm25){
        double aqi = predictAQI(pm25);
        if (aqi > 150) {
            System.out.println("ALERT: Unhealthy air quality — AQI=" + aqi);
        }
    }
}
