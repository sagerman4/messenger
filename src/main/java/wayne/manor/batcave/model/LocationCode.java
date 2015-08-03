package mil.army.logsa.reference.model;

/**
 *
 * @author joshua.s.davidson1
 */
public class LocationCode {
    private String code;
    private String description;
    private String conusOconus;

    public LocationCode() {
    }

    public LocationCode(final String code, final String description, final String conusOconus) {
        this.code = code;
        this.description = description;
        this.conusOconus = conusOconus;
    }

    public String getCode() {
        return code;
    }

    public void setCode(final String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(final String description) {
        this.description = description;
    }

    public String getConusOconus() {
        return conusOconus;
    }

    public void setConusOconus(final String conusOconus) {
        this.conusOconus = conusOconus;
    }
}
